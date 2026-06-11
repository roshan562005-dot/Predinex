import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, name } = session.user;
    
    // 1. Get Plan ID from environment
    const plan_id = process.env.RAZORPAY_PLAN_ID;
    if (!plan_id) {
      console.error("RAZORPAY_PLAN_ID is missing in environment variables.");
      return NextResponse.json({ error: 'Subscription plan not configured' }, { status: 500 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const authHeader = 'Basic ' + Buffer.from(key_id + ':' + key_secret).toString('base64');

    // 2. Create Razorpay Customer if needed (Subscriptions require a customer)
    let customer_id = null;
    
    // Check if user already has a customer ID in DB
    const { data: userData } = await supabase
      .from('users')
      .select('razorpay_customer_id')
      .eq('id', session.user.id)
      .single();

    if (userData?.razorpay_customer_id) {
      customer_id = userData.razorpay_customer_id;
    } else {
      // Create a new Razorpay customer
      const customerRes = await fetch('https://api.razorpay.com/v1/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          name: name || 'User',
          email: email || '',
          fail_existing: 0 // Return existing customer if email matches
        })
      });
      const customerData = await customerRes.json();
      
      if (customerData.id) {
        customer_id = customerData.id;
        // Save to DB
        await supabase
          .from('users')
          .update({ razorpay_customer_id: customer_id })
          .eq('id', session.user.id);
      }
    }

    // 3. Set Start Date 5 days from now (in Unix timestamp seconds)
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
    const start_at = Math.floor(fiveDaysFromNow.getTime() / 1000);

    // 4. Create the Subscription
    const subscriptionRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        plan_id: plan_id,
        total_count: 12, // For example, 1 year of autopay
        quantity: 1,
        customer_notify: 1,
        start_at: start_at, // Start charging after 5 days
        customer_id: customer_id
      })
    });

    const subscriptionData = await subscriptionRes.json();

    if (subscriptionData.error) {
      console.error("Razorpay Sub Error:", subscriptionData.error);
      return NextResponse.json({ error: subscriptionData.error.description }, { status: 400 });
    }

    // Save initial subscription ID to DB
    await supabase
      .from('users')
      .update({ razorpay_subscription_id: subscriptionData.id })
      .eq('id', session.user.id);

    return NextResponse.json({ 
      subscription_id: subscriptionData.id,
      key_id: key_id
    });

  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
