import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_replace_me';

    // Verify the signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
    }

    // Payment is valid! Update the user's database record to unlock Premium
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const { error } = await supabase
      .from('users')
      .update({
        is_premium: true,
        subscription_end_date: oneMonthFromNow.toISOString(),
      })
      .eq('id', session.user.id);

    if (error) {
      console.error("Database update error after payment:", error);
      return NextResponse.json({ error: 'Failed to update premium status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Premium unlocked successfully!' });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
