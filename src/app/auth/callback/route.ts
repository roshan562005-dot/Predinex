import { NextResponse } from 'next/server';
// Auth.js handles OAuth callbacks automatically at /api/auth/callback/google
// This route is kept for backward compatibility but redirects to the dashboard.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/dashboard`);
}
