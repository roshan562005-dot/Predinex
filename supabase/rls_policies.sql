-- ─── Enable Row Level Security on all tables ─────────────────────────────────
-- Since we use the service_role key server-side (which bypasses RLS),
-- enabling RLS with no anon policies means the anon key gets zero access.
-- This is the safest possible setup for a server-side NextAuth app.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- ─── No anon policies (service_role bypasses RLS automatically) ───────────────
-- The service_role JWT used in src/lib/supabase.ts bypasses all RLS.
-- Anonymous/public requests get ZERO rows on all tables by default.

-- ─── Optional: Allow authenticated Supabase users to read their own data ──────
-- (Only needed if you ever use Supabase Auth client-side. Leave commented for now.)

-- CREATE POLICY "Users can read own data" ON public.users
--   FOR SELECT USING (auth.uid()::text = id);

-- CREATE POLICY "Users can read own profile" ON public.profiles
--   FOR SELECT USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can read own assessments" ON public.assessments
--   FOR SELECT USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can read own habits" ON public.daily_habits
--   FOR SELECT USING (auth.uid()::text = user_id);

-- CREATE POLICY "Anyone can read posts" ON public.posts
--   FOR SELECT USING (true);

-- ─── Verify RLS is enabled ────────────────────────────────────────────────────
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
