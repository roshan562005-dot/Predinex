import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "921h8d12j9h812bh3kj12b3h1kv2j3v123h12v3jh1v23jh123",
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [], // Configured in auth.ts
};
