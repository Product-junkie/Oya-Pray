import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import twilio from 'twilio';

// THIS BANS VERCEL CACHING 🚫🧠
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
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

  const { data: allReminders } = await supabase.from('reminders').select('*');

  if (!allReminders) {
    return NextResponse.json({ message: 'Database empty or broken' });
  }

  // NUCLEAR SEARCH: Turn the whole row into text, check if the time is inside. Impossible to fail.
  const peopleToCall = allReminders.filter(r => JSON.stringify(r).includes(lagosTime));

  if (peopleToCall.length === 0) {
    return NextResponse.json({ message: `No reminders for ${lagosTime}` });
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
        return { phone: r.phone, status: 'Failed', error: err.message };
      }
    })
  );

  return NextResponse.json({ time: lagosTime, results });
}