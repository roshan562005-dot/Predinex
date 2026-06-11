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
    const {
      razorpay_payment_id,
      razorpay_signature,
      // Subscription fields
      razorpay_subscription_id,
      // Legacy one-time order fields
      razorpay_order_id,
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // --- Determine if this is a Subscription or a one-time Order ---
    const isSubscription = !!razorpay_subscription_id;

    // Build the expected signature payload
    const signaturePayload = isSubscription
      ? `${razorpay_payment_id}|${razorpay_subscription_id}`
      : `${razorpay_order_id}|${razorpay_payment_id}`;

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(signaturePayload)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
    }

    // Payment is valid! Grant Premium access immediately
    // For subscriptions, the trial starts now; autopay will renew later.
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 5);

    const updatePayload: Record<string, any> = {
      is_premium: true,
      subscription_end_date: trialEndDate.toISOString(),
    };

    if (isSubscription) {
      updatePayload.razorpay_subscription_id = razorpay_subscription_id;
      updatePayload.subscription_status = 'trialing';
    } else {
      // Legacy one-time payment: grant 1 month
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      updatePayload.subscription_end_date = oneMonthFromNow.toISOString();
      updatePayload.subscription_status = 'active';
    }

    const { error } = await supabase
      .from('users')
      .update(updatePayload)
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
