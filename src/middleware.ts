import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const publicPaths = ['/', '/login', '/register', '/terms', '/privacy', '/auth', '/forgot-password', '/reset-password', '/admin-login'];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  const isLoggedIn = !!req.auth;

  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Admin route: require both login AND the admin password cookie
  if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url));
    }
    const adminSession = req.cookies.get('prednix_admin_session')?.value;
    const adminPassword = process.env.ADMIN_PASSWORD || 'predinex-admin-2024';
    if (adminSession !== adminPassword) {
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
    return NextResponse.next();
  }

  if (isPublic) {
    if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
