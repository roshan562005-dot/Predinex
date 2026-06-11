import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Razorpay sends webhook events to this endpoint automatically.
// We use it to keep the database in sync when subscriptions are renewed or cancelled.

export async function POST(req: Request) {
  try {
    const body = await req.text(); // Get raw body for signature verification
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Verify the webhook signature
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set.");
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error("Razorpay webhook signature mismatch.");
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    // 2. Parse the event
    const event = JSON.parse(body);
    const eventType = event.event;
    const payload = event.payload;

    console.log(`[Razorpay Webhook] Received: ${eventType}`);

    // 3. Handle the events we care about
    if (eventType === 'subscription.charged') {
      // A recurring payment was successfully collected!
      const subscription = payload.subscription?.entity;
      const subscriptionId = subscription?.id;

      if (!subscriptionId) {
        return NextResponse.json({ received: true });
      }

      // Extend the user's subscription by 1 month
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      const { error } = await supabase
        .from('users')
        .update({
          is_premium: true,
          subscription_end_date: oneMonthFromNow.toISOString(),
          subscription_status: 'active',
        })
        .eq('razorpay_subscription_id', subscriptionId);

      if (error) {
        console.error("DB error on subscription.charged:", error);
      } else {
        console.log(`[Webhook] Renewed premium for subscription: ${subscriptionId}`);
      }
    }

    else if (eventType === 'subscription.cancelled' || eventType === 'subscription.halted') {
      // User cancelled or payment failed too many times
      const subscription = payload.subscription?.entity;
      const subscriptionId = subscription?.id;

      if (!subscriptionId) {
        return NextResponse.json({ received: true });
      }

      // Mark user as no longer premium
      const { error } = await supabase
        .from('users')
        .update({
          is_premium: false,
          subscription_status: eventType === 'subscription.cancelled' ? 'cancelled' : 'past_due',
        })
        .eq('razorpay_subscription_id', subscriptionId);

      if (error) {
        console.error(`DB error on ${eventType}:`, error);
      } else {
        console.log(`[Webhook] Revoked premium for subscription: ${subscriptionId}`);
      }
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
