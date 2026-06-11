'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { createUser, getUserByEmail } from '@/lib/db-queries';

/** Sign in with email + password */
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });
  } catch (error: any) {
    // Auth.js throws a redirect internally on success; re-throw it
    if (error?.message === 'NEXT_REDIRECT') throw error;
    redirect('/login?error=' + encodeURIComponent('Invalid email or password.'));
  }
}

import { sendWhatsAppMessage } from '@/lib/whatsapp';

/** Sign in with Google OAuth */
export async function loginWithGoogle() {
  await signIn('google', { redirectTo: '/dashboard' });
}

/** Register a new user with email + password */
export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  if (!email || !password || !fullName) {
    redirect('/register?error=' + encodeURIComponent('All fields are required.'));
  }

  if (password.length < 8) {
    redirect('/register?error=' + encodeURIComponent('Password must be at least 8 characters.'));
  }

  const user = await createUser(email, password, fullName, phone);
  if (!user) {
    redirect('/register?error=' + encodeURIComponent('An account with this email already exists.'));
  }

  // Send Welcome WhatsApp Message if phone is provided
  if (phone) {
    await sendWhatsAppMessage(
      phone,
      `Hello ${fullName}! Welcome to Predinex 🌿. We're thrilled to have you start your journey toward better metabolic health. Check your dashboard to begin your daily tracking!`
    );
  }

  // Sign in immediately after registration
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });
  } catch (error: any) {
    if (error?.message === 'NEXT_REDIRECT') throw error;
    redirect('/login?error=' + encodeURIComponent('Account created! Please sign in.'));
  }
}

/** Log out */
export async function logout() {
  await signOut({ redirectTo: '/' });
}

/** Send OTP to phone number (calls our API route) */
export async function sendOTPSms(phone: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return await res.json();
  } catch {
    return { error: 'Failed to send OTP. Please try again.' };
  }
}

/** Verify SMS OTP */
export async function verifyOTPSms(
  phone: string,
  token: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: token }),
    });
    const data = await res.json();
    if (data.success) {
      // Sign in as phone user using credentials
      try {
        await signIn('credentials', {
          email: `phone:${phone}`, // special prefix for phone users
          password: `otp_verified:${data.userId}`,
          redirectTo: '/dashboard',
        });
      } catch (err: any) {
        if (err?.message === 'NEXT_REDIRECT') throw err;
      }
    }
    return data;
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err;
    return { error: 'Verification failed. Please try again.' };
  }
}
