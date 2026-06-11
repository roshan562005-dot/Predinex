import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@/auth';

// Initialize Razorpay with test keys (to be replaced with live keys later)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_replace_me',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_replace_me',
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Price in paise (₹299.00 * 100)
    const amount = 29900; 

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        userId: session.user.id,
      }
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ order, key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_replace_me' });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
