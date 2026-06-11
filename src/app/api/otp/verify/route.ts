import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/sms';
import { upsertPhoneUser } from '@/lib/db-queries';
import { signIn } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and OTP code are required.' }, { status: 400 });
    }

    // Verify OTP from database
    const result = await verifyOTP(phone, code);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Create or get user for this phone number
    const user = await upsertPhoneUser(phone);

    // Return success — the client will then use a special credentials sign-in
    return NextResponse.json({ success: true, userId: user.id, phone });
  } catch (err) {
    console.error('OTP verify error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
