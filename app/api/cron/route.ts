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

    const now = new Date();
    const lagosFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    let currentLagosTime = lagosFormatter.format(now);
    if (currentLagosTime.startsWith('24:')) {
      currentLagosTime = currentLagosTime.replace('24:', '00:');
    }

    console.log(`--- Running Cron Job at ${now.toISOString()} ---`);
    console.log(`📍 Current Lagos Time: ${currentLagosTime}`);

    for (const reminder of reminders) {
      const { phone, prayer_times } = reminder;

      try {
        console.log(`[${phone}] Target Times: ${JSON.stringify(prayer_times)}`);

        // Check if the exact HH:mm exists in their requested prayer_times
        if (Array.isArray(prayer_times) && prayer_times.includes(currentLagosTime)) {
          console.log(`⏰ Match found for ${phone} at Lagos time ${currentLagosTime}! Initiating wake-up call...`);
          
          const call = await client.calls.create({
            twiml: '<Response><Say voice="alice" language="en-GB">Oya! Wake up and pray right now! Time is going and you are still sleeping. Get up!</Say></Response>',
            to: phone,
            from: twilioPhoneNumber,
          });

          callsInitiated.push({ phone, callSid: call.sid, localTime: currentLagosTime });
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
