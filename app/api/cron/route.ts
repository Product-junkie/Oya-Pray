import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json({ error: 'Twilio credentials not configured' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    // Fetch all reminders from Supabase
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*');

    if (error) {
      console.error('Error fetching reminders:', error);
      return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
    }

    if (!reminders || reminders.length === 0) {
      console.log('No reminders found in database.');
      return NextResponse.json({ success: true, message: 'No reminders found' });
    }

    const callsInitiated = [];

    console.log(`--- Running Cron Job at ${new Date().toISOString()} ---`);

    for (const reminder of reminders) {
      const { phone, timezone, prayer_times } = reminder;

      try {
        // Get the current time in the user's timezone formatted strictly as HH:mm
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        
        // Output looks like "14:30"
        let currentHHMM = formatter.format(now);
        
        // Some systems return "24:00" for midnight instead of "00:00". Handle safely.
        if (currentHHMM.startsWith('24:')) {
          currentHHMM = currentHHMM.replace('24:', '00:');
        }

        console.log(`[${phone}] TZ: ${timezone} | Local Time: ${currentHHMM} | Target Times: ${JSON.stringify(prayer_times)}`);

        // Check if the exact HH:mm exists in their requested prayer_times
        if (Array.isArray(prayer_times) && prayer_times.includes(currentHHMM)) {
          console.log(`⏰ Match found for ${phone}! Initiating wake-up call...`);
          
          const call = await client.calls.create({
            twiml: '<Response><Say voice="alice" language="en-GB">Oya! Wake up and pray right now! Time is going and you are still sleeping. Get up!</Say></Response>',
            to: phone,
            from: twilioPhoneNumber,
          });

          callsInitiated.push({ phone, callSid: call.sid, localTime: currentHHMM });
          console.log(`📞 Call queued for ${phone}. SID: ${call.sid}`);
        }
      } catch (err) {
        console.error(`❌ Error processing reminder for ${phone}:`, err);
      }
    }

    console.log(`--- Cron Job Completed. Calls made: ${callsInitiated.length} ---`);

    return NextResponse.json({
      success: true,
      message: 'Cron job executed',
      totalChecked: reminders.length,
      callsMade: callsInitiated.length,
      calls: callsInitiated
    }, { status: 200 });

  } catch (error: any) {
    console.error('Critical Cron failure:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
