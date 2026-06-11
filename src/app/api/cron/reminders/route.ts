import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

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

    // 1. Get all users who have a phone number attached
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, phone')
      .not('phone', 'is', null);

    if (usersError) throw usersError;
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users with phone numbers found.' });
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

    // 4. Send WhatsApp reminders
    for (const user of unloggedUsers) {
      if (user.phone) {
        const message = `Hi ${user.full_name.split(' ')[0]} 👋! Just a friendly reminder from Predinex: You haven't logged your vitals today. Staying consistent is key to lowering your blood sugar. Log in here to update your dashboard: https://predinex.com/progress`;
        
        const success = await sendWhatsAppMessage(user.phone, message);
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
