import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, getAllAssessments, getAllHabits, getPosts } from '@/lib/db-queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authQuery = searchParams.get('auth');
  const adminSession = request.cookies.get('prednix_admin_session')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'predinex-admin-2024';

  if (authQuery !== adminPassword && adminSession !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const exportData = {
    exported_at: new Date().toISOString(),
    users: (await getAllUsers()).map((u) => ({
      ...u,
      password_hash: '[REDACTED]', // Never export password hashes
    })),
    assessments: await getAllAssessments(),
    daily_habits: await getAllHabits(),
    posts: await getPosts(),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="predinex-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}
