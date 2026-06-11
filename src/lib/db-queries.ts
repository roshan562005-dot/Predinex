import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string | null;
  password_hash: string | null;
  full_name: string;
  phone: string | null;
  auth_provider: string;
  google_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Profile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  dob: string | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  diabetes_type: string | null;
}

export interface Assessment {
  id: string;
  user_id: string;
  score: number;
  risk_level: string;
  answers: string; // JSON string
  completed_at: string;
}

export interface DailyHabits {
  id: string;
  user_id: string;
  date: string;
  water_ml: number | null;
  sleep_hours: number | null;
  sunlight_mins: number | null;
  mindfulness_mins: number | null;
  blood_sugar: number | null;
  steps: number | null;
  weight: number | null;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

// ─── User Queries ─────────────────────────────────────────────────────────────

/** Create a new user with email + password */
export async function createUser(
  email: string,
  password: string,
  fullName: string
): Promise<User | null> {
  const existing = await getUserByEmail(email);
  if (existing) return null; // Email already in use

  const password_hash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  const { error: insertError } = await supabase
    .from('users')
    .insert({
      id,
      email: email.toLowerCase(),
      password_hash,
      full_name: fullName,
      auth_provider: 'email',
    });

  if (insertError) {
    console.error('Error inserting user:', insertError);
    return null;
  }

  // Create empty profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ user_id: id });

  if (profileError) {
    console.error('Error inserting profile:', profileError);
  }

  return getUserById(id);
}

/** Create or update a user from Google OAuth */
export async function upsertGoogleUser(
  googleId: string,
  email: string,
  fullName: string,
  avatarUrl: string | null
): Promise<User> {
  // Check if user exists by google_id or email
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('google_id', googleId)
    .maybeSingle();

  if (!user) {
    const { data: userByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    user = userByEmail;
  }

  if (user) {
    // Update existing user
    const { data: updated, error } = await supabase
      .from('users')
      .update({
        google_id: googleId,
        full_name: fullName,
        avatar_url: avatarUrl,
        auth_provider: 'google',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) console.error('Error updating google user:', error);
    return updated as User;
  }

  // Create new Google user
  const id = crypto.randomUUID();
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      id,
      email: email.toLowerCase(),
      full_name: fullName,
      auth_provider: 'google',
      google_id: googleId,
      avatar_url: avatarUrl,
    })
    .select('*')
    .single();

  if (insertError) console.error('Error inserting google user:', insertError);

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ user_id: id });
  if (profileError) console.error('Error inserting google profile:', profileError);

  return newUser as User;
}

/** Create or get a user from phone number */
export async function upsertPhoneUser(phone: string): Promise<User> {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (user) return user as User;

  const id = crypto.randomUUID();
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      id,
      phone,
      full_name: 'User',
      auth_provider: 'phone',
    })
    .select('*')
    .single();

  if (insertError) console.error('Error inserting phone user:', insertError);

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ user_id: id });
  if (profileError) console.error('Error inserting phone profile:', profileError);

  return newUser as User;
}

/** Get user by ID */
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
  return data as User | null;
}

/** Get user by email */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
  return data as User | null;
}

/** Verify email + password */
export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.password_hash) return null;
  const valid = await bcrypt.compare(password, user.password_hash);
  return valid ? user : null;
}

// ─── Profile Queries ──────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<(Profile & { email?: string }) | null> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('Error getting profile:', profileError);
    return null;
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .maybeSingle();

  if (userError) {
    console.error('Error getting user for email:', userError);
  }

  if (profile) {
    return {
      ...profile,
      email: user?.email || '',
    } as Profile & { email?: string };
  }
  return null;
}

export async function updateUserProfile(userId: string, data: Partial<Profile>): Promise<void> {
  const cleanData: any = { ...data };
  delete cleanData.user_id;

  if (Object.keys(cleanData).length === 0) return;

  const { error } = await supabase
    .from('profiles')
    .update({
      ...cleanData,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) console.error('Error updating profile:', error);
}

// ─── Assessment Queries ───────────────────────────────────────────────────────

export async function saveAssessment(
  userId: string,
  score: number,
  riskLevel: string,
  answers: Record<number, number>
): Promise<void> {
  const { error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      score,
      risk_level: riskLevel.toLowerCase(),
      answers: answers,
    });

  if (error) console.error('Error saving assessment:', error);
}

export async function getLatestAssessment(userId: string): Promise<Assessment | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error getting latest assessment:', error);
    return null;
  }

  if (data) {
    // Return answers formatted as a JSON string to match original sqlite interface
    return {
      ...data,
      answers: typeof data.answers === 'string' ? data.answers : JSON.stringify(data.answers),
    } as Assessment;
  }
  return null;
}

// ─── Daily Habits Queries ─────────────────────────────────────────────────────

export async function upsertHabits(
  userId: string,
  date: string,
  data: Partial<Omit<DailyHabits, 'id' | 'user_id' | 'date'>>
): Promise<void> {
  // Try to find existing row
  const { data: existingRow } = await supabase
    .from('daily_habits')
    .select('id')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (existingRow) {
    const { error } = await supabase
      .from('daily_habits')
      .update(data)
      .eq('user_id', userId)
      .eq('date', date);
    if (error) console.error('Error updating habits:', error);
  } else {
    const { error } = await supabase
      .from('daily_habits')
      .insert({
        user_id: userId,
        date,
        ...data,
      });
    if (error) console.error('Error inserting habits:', error);
  }
}

export async function getDailyHabits(userId: string, date: string): Promise<DailyHabits | null> {
  const { data, error } = await supabase
    .from('daily_habits')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.error('Error getting daily habits:', error);
    return null;
  }
  return data as DailyHabits | null;
}

export async function getHabitHistory(userId: string, days: number = 7): Promise<DailyHabits[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_habits')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error getting habits history:', error);
    return [];
  }
  return data as DailyHabits[];
}

export async function clearHabitHistory(userId: string, days: number = 7): Promise<void> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { error } = await supabase
    .from('daily_habits')
    .delete()
    .eq('user_id', userId)
    .gte('date', startDateStr);

  if (error) console.error('Error clearing habits history:', error);
}

// ─── Community Posts Queries ──────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      title,
      content,
      tag,
      created_at,
      profiles:user_id (
        first_name,
        last_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting posts:', error);
    return [];
  }

  // Flatten profiles join to match first_name/last_name expected in UI
  return (data as any[]).map((post) => {
    const profile = post.profiles;
    return {
      id: post.id,
      user_id: post.user_id,
      title: post.title,
      content: post.content,
      tag: post.tag,
      created_at: post.created_at,
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
    };
  });
}

export async function createPost(userId: string, title: string, content: string, tag: string = 'Discussion'): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      title,
      content,
      tag,
    });
  if (error) console.error('Error creating post:', error);
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting all users:', error);
    return [];
  }
  return data as User[];
}

export async function getAllAssessments(): Promise<(Assessment & { full_name: string; email: string })[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      user_id,
      score,
      risk_level,
      answers,
      completed_at,
      users:user_id (
        full_name,
        email
      )
    `)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error getting all assessments:', error);
    return [];
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    score: row.score,
    risk_level: row.risk_level,
    answers: typeof row.answers === 'string' ? row.answers : JSON.stringify(row.answers),
    completed_at: row.completed_at,
    full_name: row.users?.full_name || 'Unknown',
    email: row.users?.email || '',
  }));
}

export async function getAllHabits(): Promise<(DailyHabits & { full_name: string })[]> {
  const { data, error } = await supabase
    .from('daily_habits')
    .select(`
      id,
      user_id,
      date,
      water_ml,
      sleep_hours,
      sunlight_mins,
      mindfulness_mins,
      blood_sugar,
      steps,
      weight,
      users:user_id (
        full_name
      )
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error getting all habits:', error);
    return [];
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    date: row.date,
    water_ml: row.water_ml,
    sleep_hours: row.sleep_hours,
    sunlight_mins: row.sunlight_mins,
    mindfulness_mins: row.mindfulness_mins,
    blood_sugar: row.blood_sugar,
    steps: row.steps,
    weight: row.weight,
    full_name: row.users?.full_name || 'Unknown',
  }));
}

export async function submitFeedback(userId: string | null, type: string, message: string, url: string): Promise<void> {
  const { error } = await supabase
    .from('feedbacks')
    .insert({
      user_id: userId,
      type,
      message,
      url,
    });
  if (error) console.error('Error submitting feedback:', error);
}
