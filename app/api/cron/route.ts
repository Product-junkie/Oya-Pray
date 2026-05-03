import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  // Get current time
  const now = new Date();
  const lagosTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  // Fetch EVERYTHING from Supabase
  const { data: allReminders, error } = await supabase
    .from('reminders')
    .select('*');

  // Print it all directly to the screen!
  return NextResponse.json({
    message: "X-RAY VISION ACTIVATED 🩻",
    timeVercelIsLookingFor: lagosTime,
    databaseError: error,
    totalRowsFound: allReminders?.length || 0,
    whatVercelSeesInDatabase: allReminders
  });
}