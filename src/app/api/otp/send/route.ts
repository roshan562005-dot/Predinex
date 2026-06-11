import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    const result = await sendOTP(phone);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully!' });
  } catch (err) {
    console.error('OTP send error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
