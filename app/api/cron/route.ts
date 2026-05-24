import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Maps custom frontend timezone selections to standard IANA timezone identifiers
function mapTimezoneToIANA(tz: string): string {
  if (!tz) return 'Africa/Lagos';
  if (tz.includes('Lagos')) return 'Africa/Lagos';
  if (tz.includes('London')) return 'Europe/London';
  if (tz.includes('New York')) return 'America/New_York';
  return 'Africa/Lagos'; // Safe default fallback
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Secure the cron endpoint (supports Vercel's injected Auth header OR manual query secret)
    const authHeader = request.headers.get('Authorization');
    const isAuthorized = searchParams.get('secret') === process.env.CRON_SECRET || 
                         authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isAuthorized) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all active devotions from Supabase
    const { data: allReminders, error } = await supabase
      .from('reminders')
      .select('*');

    if (error || !allReminders) {
      console.error('Database query failed:', error);
      return NextResponse.json({ message: 'Database error', error });
    }

    const peopleToCall: any[] = [];
    const now = new Date();

    for (const r of allReminders) {
      try {
        const ianaTz = mapTimezoneToIANA(r.timezone);

        // Get the current date in YYYY-MM-DD format in the user's localized timezone
        const todayInUserTz = new Intl.DateTimeFormat('sv-SE', {
          timeZone: ianaTz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(now);

        // Verify if the journey's start date has been reached
        if (r.start_date && todayInUserTz < r.start_date) {
          console.log(`Skipping ${r.phone}: start_date (${r.start_date}) is in the future. Today in user TZ: ${todayInUserTz}`);
          continue;
        }

        // Get the current time in HH:MM format in the user's localized timezone
        const timeInUserTz = new Intl.DateTimeFormat('en-GB', {
          timeZone: ianaTz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);

        // Parse user configured prayer times (expects array or stringified array)
        const userTimes: string[] = Array.isArray(r.prayer_times)
          ? r.prayer_times
          : typeof r.prayer_times === 'string'
          ? JSON.parse(r.prayer_times)
          : [];

        console.log(`Evaluating user ${r.phone}: TZ=${r.timezone} (${ianaTz}), LocalTime=${timeInUserTz}, UserTimes=${JSON.stringify(userTimes)}, LocalToday=${todayInUserTz}`);

        // If the current time matches one of the user's prayer times, add to execution queue
        if (userTimes.includes(timeInUserTz)) {
          peopleToCall.push({
            phone: r.phone,
            matchedTime: timeInUserTz,
            frequency: r.frequency,
            userTimes,
          });
        }
      } catch (userErr) {
        console.error(`Error parsing reminder parameters for ${r.phone}:`, userErr);
      }
    }

    if (peopleToCall.length === 0) {
      return NextResponse.json({ message: 'No reminders matched current interval' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    const authToken = process.env.TWILIO_AUTH_TOKEN || '';
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '';

    const client = twilio(accountSid, authToken);

    const results = await Promise.all(
      peopleToCall.map(async (r) => {
        try {
          // Send customized premium WhatsApp notification
          await client.messages.create({
            body: '🚨 OYA PRAY! Wake up and connect with your maker right now! Time is going, no sleeping on a bicycle! 🕯️🔥',
            from: `whatsapp:${twilioPhone}`,
            to: `whatsapp:${r.phone}`,
          });

          // Handle 'Once' self-cleaning logic
          if (r.frequency === 'Once' || r.frequency === 'Just once') {
            const remainingTimes = r.userTimes.filter((t: string) => t !== r.matchedTime);
            if (remainingTimes.length === 0) {
              console.log(`Self-cleaning: Deleting user ${r.phone} reminder as all 'Once' times have fired.`);
              await supabase.from('reminders').delete().eq('phone', r.phone);
            } else {
              console.log(`Self-cleaning: Updating user ${r.phone} reminder, removing ${r.matchedTime}. Remaining: ${JSON.stringify(remainingTimes)}`);
              await supabase
                .from('reminders')
                .update({ prayer_times: remainingTimes })
                .eq('phone', r.phone);
            }
          }

          return { phone: r.phone, status: 'WhatsApp Sent', matchedTime: r.matchedTime };
        } catch (err: any) {
          console.error(`Twilio or DB Clean-up failure for ${r.phone}:`, err);
          return { phone: r.phone, status: 'Failed', error: err.message };
        }
      })
    );

    return NextResponse.json({ processedCount: results.length, results });
  } catch (e: any) {
    console.error('Server crash inside cron route:', e);
    return NextResponse.json({ message: 'Server crash', error: e.message });
  }
}