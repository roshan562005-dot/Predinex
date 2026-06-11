-- Drop in reverse order of foreign key dependencies
DROP TABLE IF EXISTS public.feedbacks CASCADE;
DROP TABLE IF EXISTS public.otp_codes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.daily_habits CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.verification_tokens CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Users table
CREATE TABLE public.users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE,
  password_hash TEXT,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT UNIQUE,
  auth_provider TEXT NOT NULL DEFAULT 'email',
  google_id TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Sessions table
CREATE TABLE public.sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  session_token TEXT UNIQUE NOT NULL
);

-- 3. Accounts table
CREATE TABLE public.accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

-- 4. Verification tokens
CREATE TABLE public.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 5. Profiles table
CREATE TABLE public.profiles (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  dob TEXT,
  gender TEXT,
  height_cm REAL,
  weight_kg REAL,
  activity_level TEXT,
  diabetes_type TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Risk assessments
CREATE TABLE public.assessments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Daily habits tracking
CREATE TABLE public.daily_habits (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- YYYY-MM-DD
  water_ml INTEGER DEFAULT 0,
  sleep_hours REAL DEFAULT 0,
  sunlight_mins INTEGER DEFAULT 0,
  mindfulness_mins INTEGER DEFAULT 0,
  blood_sugar REAL,
  steps INTEGER DEFAULT 0,
  weight REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- 8. Community posts
CREATE TABLE public.posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Discussion',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. OTP codes
CREATE TABLE public.otp_codes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Beta feedbacks
CREATE TABLE public.feedbacks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
