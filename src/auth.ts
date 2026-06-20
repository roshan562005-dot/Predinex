import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { Adapter, AdapterUser, AdapterSession, VerificationToken } from 'next-auth/adapters';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/db-queries';
import { authConfig } from './auth.config';

// ─── Custom Supabase Adapter for Auth.js ─────────────────────────────────────

function SupabaseAdapter(): Adapter {
  return {
    async createUser(user): Promise<AdapterUser> {
      const id = crypto.randomUUID();
      const { error: userError } = await supabase.from('users').insert({
        id,
        email: user.email?.toLowerCase() ?? null,
        full_name: user.name ?? '',
        avatar_url: user.image ?? null,
        auth_provider: 'google',
      });
      if (userError) console.error('Adapter createUser userError:', userError);

      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: id,
      });
      if (profileError) console.error('Adapter createUser profileError:', profileError);

      return { id, email: user.email!, name: user.name ?? '', image: user.image ?? null, emailVerified: null };
    },

    async getUser(id): Promise<AdapterUser | null> {
      const { data: row, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
      if (error || !row) return null;
      return { id: row.id, email: row.email, name: row.full_name, image: row.avatar_url, emailVerified: null };
    },

    async getUserByEmail(email): Promise<AdapterUser | null> {
      const { data: row, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
      if (error || !row) return null;
      return { id: row.id, email: row.email, name: row.full_name, image: row.avatar_url, emailVerified: null };
    },

    async getUserByAccount({ providerAccountId, provider }): Promise<AdapterUser | null> {
      const { data: account, error } = await supabase
        .from('accounts')
        .select('user_id')
        .eq('provider', provider)
        .eq('provider_account_id', providerAccountId)
        .maybeSingle();
      if (error || !account) return null;
      const { data: row } = await supabase.from('users').select('*').eq('id', account.user_id).maybeSingle();
      if (!row) return null;
      return { id: row.id, email: row.email, name: row.full_name, image: row.avatar_url, emailVerified: null };
    },

    async updateUser(user): Promise<AdapterUser> {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: user.name ?? '',
          avatar_url: user.image ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) console.error('Adapter updateUser error:', error);
      const { data: row } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      return { id: row?.id || user.id, email: row?.email || user.email!, name: row?.full_name || (user.name ?? ''), image: row?.avatar_url || (user.image ?? null), emailVerified: null };
    },

    async linkAccount(account): Promise<void> {
      const { error } = await supabase.from('accounts').insert({
        id: crypto.randomUUID(),
        user_id: account.userId,
        type: account.type,
        provider: account.provider,
        provider_account_id: account.providerAccountId,
        refresh_token: account.refresh_token ?? null,
        access_token: account.access_token ?? null,
        expires_at: account.expires_at ?? null,
        token_type: account.token_type ?? null,
        scope: account.scope ?? null,
        id_token: account.id_token ?? null,
        session_state: account.session_state ?? null,
      });
      if (error) console.error('Adapter linkAccount error:', error);
    },

    async createSession(session): Promise<AdapterSession> {
      const { error } = await supabase.from('sessions').insert({
        id: crypto.randomUUID(),
        user_id: session.userId,
        expires: session.expires.toISOString(),
        session_token: session.sessionToken,
      });
      if (error) console.error('Adapter createSession error:', error);
      return session;
    },

    async getSessionAndUser(sessionToken): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const { data: sessionRow, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .maybeSingle();
      if (sessionError || !sessionRow) return null;

      const { data: userRow, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionRow.user_id)
        .maybeSingle();
      if (userError || !userRow) return null;

      return {
        session: { sessionToken: sessionRow.session_token, userId: sessionRow.user_id, expires: new Date(sessionRow.expires) },
        user: { id: userRow.id, email: userRow.email, name: userRow.full_name, image: userRow.avatar_url, emailVerified: null },
      };
    },

    async updateSession(session): Promise<AdapterSession | null> {
      const updateData: any = {};
      if (session.expires) updateData.expires = session.expires.toISOString();
      const { error } = await supabase
        .from('sessions')
        .update(updateData)
        .eq('session_token', session.sessionToken);
      if (error) console.error('Adapter updateSession error:', error);
      return session as AdapterSession;
    },

    async deleteSession(sessionToken): Promise<void> {
      const { error } = await supabase.from('sessions').delete().eq('session_token', sessionToken);
      if (error) console.error('Adapter deleteSession error:', error);
    },

    async createVerificationToken(token): Promise<VerificationToken> {
      const { error } = await supabase.from('verification_tokens').insert({
        identifier: token.identifier,
        token: token.token,
        expires: token.expires.toISOString(),
      });
      if (error) console.error('Adapter createVerificationToken error:', error);
      return token;
    },

    async useVerificationToken({ identifier, token }): Promise<VerificationToken | null> {
      const { data: row, error: selectError } = await supabase
        .from('verification_tokens')
        .select('*')
        .eq('identifier', identifier)
        .eq('token', token)
        .maybeSingle();
      if (selectError || !row) return null;

      const { error: deleteError } = await supabase
        .from('verification_tokens')
        .delete()
        .eq('identifier', identifier)
        .eq('token', token);
      if (deleteError) console.error('Adapter useVerificationToken deleteError:', deleteError);

      return { identifier: row.identifier, token: row.token, expires: new Date(row.expires) };
    },

    async deleteUser(userId): Promise<void> {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) console.error('Adapter deleteUser error:', error);
    },

    async unlinkAccount({ providerAccountId, provider }): Promise<void> {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('provider', provider)
        .eq('provider_account_id', providerAccountId);
      if (error) console.error('Adapter unlinkAccount error:', error);
    },
  };
}

// ─── Auth.js Configuration ───────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  adapter: SupabaseAdapter(),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours strict
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || 'missing_client_id',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || 'missing_client_secret',
    }),
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        let user;
        // Phone OTP users log in with email prefix 'phone:XXXXXXXXXX'
        if ((credentials.email as string).startsWith('phone:')) {
          const phone = (credentials.email as string).replace('phone:', '');
          const userId = (credentials.password as string).replace('otp_verified:', '');
          const { data: row, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .eq('id', userId)
            .maybeSingle();
          if (!error && row) {
            user = { id: row.id, email: row.email, full_name: row.full_name, avatar_url: row.avatar_url };
          }
        } else {
          user = await verifyPassword(
            credentials.email as string,
            credentials.password as string
          );
        }

        if (!user) return null;
        return { id: user.id, email: user.email, name: user.full_name, image: user.avatar_url };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
