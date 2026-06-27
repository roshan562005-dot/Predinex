import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendReminderEmail } from '@/lib/email';

// Define route as edge or node. We use node because of crypto/Twilio etc.
export const runtime = 'nodejs';

/**
 * GET /api/cron/reminders
 * This endpoint is intended to be called daily (e.g. at 8:00 PM) via a cron job
 * to remind users to log their vitals if they haven't done so today.
 */
export async function GET(request: Request) {
  // Optional: Check a cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Get all users who have an email attached (which is all of them)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, email')
      .not('email', 'is', null);

    if (usersError) throw usersError;
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users with emails found.' });
    }

    // 2. Get today's habits
    const { data: habitsToday, error: habitsError } = await supabase
      .from('daily_habits')
      .select('user_id')
      .eq('date', today);

    if (habitsError) throw habitsError;

    const loggedUserIds = new Set((habitsToday || []).map(h => h.user_id));

    // 3. Find who hasn't logged
    const unloggedUsers = users.filter(u => !loggedUserIds.has(u.id));
    
    let sentCount = 0;

    // 4. Send Email reminders
    for (const user of unloggedUsers) {
      if (user.email) {
        const firstName = user.full_name ? user.full_name.split(' ')[0] : 'there';
        const { success } = await sendReminderEmail(user.email, firstName);
        if (success) {
          sentCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sent ${sentCount} reminders out of ${unloggedUsers.length} pending users.`,
    });

  } catch (error: any) {
    console.error('Error in cron/reminders:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
