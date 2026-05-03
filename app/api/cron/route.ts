import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    if (searchParams.get('secret') !== process.env.CRON_SECRET) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lagosTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());

    const { data: allReminders, error } = await supabase.from('reminders').select('*');

    if (error || !allReminders) {
      return NextResponse.json({ message: 'Database error', error });
    }

    const peopleToCall = allReminders.filter(r => {
      if (!r.prayer_times) return false;
      return JSON.stringify(r.prayer_times).includes(lagosTime);
    });

    if (peopleToCall.length === 0) {
      return NextResponse.json({ message: `No reminders for ${lagosTime}` });
    }

    // Force TypeScript to accept these as strings no matter what
    const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    const authToken = process.env.TWILIO_AUTH_TOKEN || '';
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '';

    const client = twilio(accountSid, authToken);

    const results = await Promise.all(
      peopleToCall.map(async (r) => {
        try {
          await client.calls.create({
            twiml: '<Response><Say voice="alice">Oya! Wake up and pray right now! Time is going and you are still sleeping!</Say></Response>',
            to: r.phone,
            from: twilioPhone,
          });
          return { phone: r.phone, status: 'Called' };
        } catch (err: any) {
          return { phone: r.phone, status: 'Failed', error: err.message };
        }
      })
    );

    return NextResponse.json({ time: lagosTime, results });
  } catch (e: any) {
    return NextResponse.json({ message: 'Server crash', error: e.message });
  }
}