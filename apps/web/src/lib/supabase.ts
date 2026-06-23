// Lazy Supabase browser client for the web app.
//
// In use today by: restaurant partner applications (public submit + admin
// review) and admin authentication (Supabase Auth email/password). The catalog
// and admin orders still run on local mock data.
//
// getSupabase() returns null (and warns) when the NEXT_PUBLIC_SUPABASE_* env
// vars are missing, so the app builds and renders without them — callers show a
// "not configured" state instead of crashing. Anon key only; the service_role
// key is NEVER used in the frontend.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Lazily creates the Supabase browser client. Returns null (and warns) if env
 * vars are missing, so callers can fall back / show a configuration message
 * instead of crashing. The session is persisted in the browser so admin auth
 * survives reloads.
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.warn(
        'Supabase env vars are not set; running without a backend. ' +
          'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable it.'
      );
    }
    return null;
  }
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

/** Whether a real backend is configured. */
export function hasSupabase(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
