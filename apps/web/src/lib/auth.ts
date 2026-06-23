// Admin authentication helpers, built on Supabase Auth (email/password).
//
// Scope: ADMIN login only. There is no public signup, and no customer /
// restaurant / rider login yet. A user is an admin iff their `profiles.role`
// is 'admin' (see migration 0003).

import { getSupabase } from './supabase';
import type { Profile } from '@/types/database';

export type SignInResult =
  | { ok: true; profile: Profile }
  | { ok: false; reason: 'unconfigured' | 'invalid_credentials' | 'not_admin' | 'error'; message: string };

/**
 * Sign in with email/password and verify the user is an admin.
 * - Wrong credentials → { ok: false, reason: 'invalid_credentials' }
 * - Valid login but not an admin → signs the user back out and returns
 *   { ok: false, reason: 'not_admin' } so no non-admin session lingers.
 */
export async function signInAdmin(email: string, password: string): Promise<SignInResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, reason: 'unconfigured', message: 'Authentication is not configured.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, reason: 'invalid_credentials', message: 'Invalid email or password.' };
  }

  const profile = await fetchMyProfile();
  if (!profile || profile.role !== 'admin') {
    // Don't leave a non-admin signed in on the admin login surface.
    await supabase.auth.signOut();
    return { ok: false, reason: 'not_admin', message: 'You do not have admin access.' };
  }

  return { ok: true, profile };
}

/** The signed-in user's profile, or null if not signed in / not configured. */
export async function fetchMyProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

/** Sign the current user out. */
export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}
