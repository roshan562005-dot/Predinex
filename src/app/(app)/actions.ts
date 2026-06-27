'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import {
  saveAssessment as dbSaveAssessment,
  upsertHabits as dbUpsertHabits,
  getUserProfile as dbGetUserProfile,
  getLatestAssessment as dbGetLatestAssessment,
  getDailyHabits as dbGetDailyHabits,
  getHabitHistory as dbGetHabitHistory,
  getPosts as dbGetPosts,
  createPost as dbCreatePost,
  submitFeedback as dbSubmitFeedback,
  updateUserProfile as dbUpdateUserProfile,
} from '@/lib/db-queries';

/** Helper: get the current session's user ID, throw if not authenticated */
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');
  return session.user.id;
}

// ─── Assessment ───────────────────────────────────────────────────────────────

/** Save risk assessment results to local database */
export async function saveAssessment(
  score: number,
  riskLevel: string,
  answers: Record<number, number>
) {
  const userId = await requireUserId();
  await dbSaveAssessment(userId, score, riskLevel, answers);
  revalidatePath('/assessment');
}

// ─── Daily Habits ─────────────────────────────────────────────────────────────

/** Upsert daily habits (update or insert) */
export async function upsertHabits(data: {
  date?: string;
  water_ml?: number;
  water_glasses?: number; // convenience: auto-converted to ml
  sleep_hours?: number;
  sunlight_mins?: number;
  mindfulness_mins?: number;
  workout_minutes?: number;
  blood_sugar?: number;
  post_meal_blood_sugar?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  blood_pressure?: string;
  steps?: number;
  weight?: number;
}) {
  const userId = await requireUserId();
  const date = data.date || new Date().toISOString().split('T')[0];
  const { date: _, water_glasses, ...rest } = data;

  // Convert glasses → ml if provided
  const cleanData: any = { ...rest };
  if (water_glasses !== undefined) {
    cleanData.water_ml = water_glasses * 250;
  }

  await dbUpsertHabits(userId, date, cleanData);

  revalidatePath('/dashboard');
  revalidatePath('/plans');
  revalidatePath('/progress');
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/** Fetch user profile */
export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return await dbGetUserProfile(session.user.id);
}

/** Update user profile */
export async function updateUserProfile(data: any) {
  const userId = await requireUserId();
  await dbUpdateUserProfile(userId, data);
  revalidatePath('/dashboard');
  revalidatePath('/profile');
}

/** Check if user is premium */
export async function getPremiumStatus(): Promise<boolean> {
  // Free access for 2 months from 2026-06-13
  const freeAccessEndDate = new Date('2026-08-13T00:00:00Z');
  if (new Date() < freeAccessEndDate) {
    return true;
  }

  const session = await auth();
  if (!session?.user?.id) return false;
  const { getUserById } = require('@/lib/db-queries');
  const user = await getUserById(session.user.id);
  return user?.is_premium || false;
}

// ─── Assessment Fetch ─────────────────────────────────────────────────────────

/** Fetch latest assessment */
export async function getLatestAssessment() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return await dbGetLatestAssessment(session.user.id);
}

// ─── Habits Fetch ─────────────────────────────────────────────────────────────

/** Fetch daily habits for a date */
export async function getDailyHabits(dateString?: string) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const date = dateString || new Date().toISOString().split('T')[0];
  return await dbGetDailyHabits(session.user.id, date);
}

/** Fetch historical habits for the last X days */
export async function getHabitHistory(days: number = 7) {
  const session = await auth();
  if (!session?.user?.id) return [];
  return await dbGetHabitHistory(session.user.id, days);
}

/** Clear historical habits for the last X days */
export async function clearHabitHistory(days: number = 7) {
  const userId = await requireUserId();
  const { clearHabitHistory: dbClearHabitHistory } = require('@/lib/db-queries');
  await dbClearHabitHistory(userId, days);
  revalidatePath('/dashboard');
  revalidatePath('/progress');
}

// ─── Community Posts ──────────────────────────────────────────────────────────

/** Fetch all community posts */
export async function getPosts() {
  return await dbGetPosts();
}

/** Create a new community post */
export async function createPost(
  title: string,
  content: string,
  tag: string = 'Discussion'
) {
  const userId = await requireUserId();
  await dbCreatePost(userId, title, content, tag);
  revalidatePath('/community');
}

// ─── Medical News (public RSS — unchanged) ────────────────────────────────────

/** Fetch live medical news via public RSS endpoint */
export async function getMedicalNews() {
  try {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/health_medicine/diabetes.xml?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    if (data && data.items) {
      return data.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        content: item.content,
        source: 'ScienceDaily',
      }));
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch medical news:', err);
    return [];
  }
}

// ─── Feedback Data ────────────────────────────────────────────────────────────

export async function submitAppFeedback(type: string, message: string, url: string) {
  const session = await auth();
  const userId = session?.user?.id || null;
  await dbSubmitFeedback(userId, type, message, url);
}
