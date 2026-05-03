import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import twilio from 'twilio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const lagosTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  // 1. Fetch EVERY reminder from the database (Bypass Supabase search)
  const { data: allReminders, error } = await supabase
    .from('reminders')
    .select('*');

  if (error || !allReminders) {
    return NextResponse.json({ message: 'Error fetching database' });
  }

  // 2. 100% Foolproof JavaScript Search
  const peopleToCall = allReminders.filter((r) => {
    if (!r.prayer_times) return false;
    // Force it into a string to guarantee we find the time
    const timesString = JSON.stringify(r.prayer_times);
    return timesString.includes(lagosTime);
  });

  if (peopleToCall.length === 0) {
    return NextResponse.json({ message: `No reminders for ${lagosTime}` });
  }

  // 3. Call them!
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const results = await Promise.all(
    peopleToCall.map(async (r) => {
      try {
        await client.calls.create({
          twiml: `<Response><Say voice="alice">Oya! Wake up and pray right now! Time is going and you are still sleeping!</Say></Response>`,
          to: r.phone,
          from: process.env.TWILIO_PHONE_NUMBER as string,
        });
        return { phone: r.phone, status: 'Called' };
      } catch (err: any) {
        // If it fails, print the exact Twilio reason!
        return { phone: r.phone, status: 'Failed', error: err.message };
      }
    })
  );

  return NextResponse.json({ time: lagosTime, results });
}