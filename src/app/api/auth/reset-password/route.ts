import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, token, password } = await req.json();

  if (!email || !token || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  // Look up the reset token
  const { data: record } = await supabase
    .from('verification_tokens')
    .select('*')
    .eq('identifier', `reset:${email.toLowerCase()}`)
    .eq('token', token)
    .maybeSingle();

  if (!record) {
    return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 });
  }

  // Check expiry
  if (new Date(record.expires) < new Date()) {
    await supabase.from('verification_tokens').delete().eq('identifier', `reset:${email.toLowerCase()}`);
    return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 });
  }

  // Update password
  const password_hash = await bcrypt.hash(password, 12);
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash })
    .eq('email', email.toLowerCase());

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update password. Please try again.' }, { status: 500 });
  }

  // Delete the used token
  await supabase.from('verification_tokens').delete().eq('identifier', `reset:${email.toLowerCase()}`);

  return NextResponse.json({ success: true });
}
