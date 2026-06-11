-- Users table to store basic profile settings beyond Auth
create table public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
create policy "Users can read own profile." on public.profiles for select using (auth.uid() = id);


-- Assessments table to store Risk Assessment answers and scores
create table public.assessments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  score integer not null,
  risk_level text not null, -- 'low', 'moderate', 'high'
  answers jsonb not null, -- Raw quiz answers
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assessments enable row level security;
create policy "Users can insert their own assessments." on public.assessments for insert with check (auth.uid() = user_id);
create policy "Users can read own assessments." on public.assessments for select using (auth.uid() = user_id);


-- Habits table for the Daily Tips (Hydration, Sleep, Sun) tracking
create table public.daily_habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null, -- e.g. '2026-03-15'
  water_ml integer default 0,
  sleep_hours numeric default 0,
  sunlight_mins integer default 0,
  mindfulness_mins integer default 0,
  blood_sugar integer, -- mg/dL
  steps integer default 0,
  weight numeric, -- lbs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date) -- One entry per user per day
);

alter table public.daily_habits enable row level security;
create policy "Users can insert own habits." on public.daily_habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits." on public.daily_habits for update using (auth.uid() = user_id);
create policy "Users can read own habits." on public.daily_habits for select using (auth.uid() = user_id);


-- Trigger to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Community Posts table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  tag text not null default 'Discussion',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;
create policy "Anyone can read posts." on public.posts for select using (true);
create policy "Users can insert own posts." on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts." on public.posts for delete using (auth.uid() = user_id);
