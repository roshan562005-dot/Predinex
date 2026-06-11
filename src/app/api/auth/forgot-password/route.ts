import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  // Check user exists (silently succeed even if not — prevents user enumeration)
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Store in verification_tokens table
    await supabase.from('verification_tokens').upsert({
      identifier: `reset:${email.toLowerCase()}`,
      token,
      expires,
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;

    await sendPasswordResetEmail(email.toLowerCase(), resetUrl);
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({ success: true });
}
