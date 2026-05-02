import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import twilio from 'twilio';

export async function GET(request: Request) {
  // 1. Security Check
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Get Current Lagos Time (HH:mm)
  const now = new Date();
  const lagosTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  console.log(`Checking reminders for Lagos time: ${lagosTime}`);

  // 3. Find anyone who needs to pray right now
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .contains('prayer_times', [lagosTime]);

  if (error || !reminders || reminders.length === 0) {
    return NextResponse.json({ message: `No reminders for ${lagosTime}` });
  }

  // 4. Twilio Alice Setup
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const results = await Promise.all(
    reminders.map(async (r) => {
      try {
        await client.calls.create({
          twiml: `<Response><Say voice="alice">Oya! Wake up and pray right now! Time is going and you are still sleeping!</Say></Response>`,
          to: r.phone,
          from: process.env.TWILIO_PHONE_NUMBER,
        });
        return { phone: r.phone, status: 'Called' };
      } catch (err) {
        return { phone: r.phone, status: 'Failed' };
      }
    })
  );

  return NextResponse.json({ time: lagosTime, results });
}