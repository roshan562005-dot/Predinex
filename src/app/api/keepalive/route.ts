import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/keepalive
 * Pings the Supabase database to prevent auto-pause on the free tier.
 * Call this from an external cron service (e.g. cron-job.org) every 3 days.
 * URL: https://prednix.vercel.app/api/keepalive
 */
export async function GET() {
  const start = Date.now();
  const { error } = await supabase.from('users').select('id').limit(1);
  const latency = Date.now() - start;

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Supabase is alive ✓',
    latency_ms: latency,
    timestamp: new Date().toISOString(),
  });
}
