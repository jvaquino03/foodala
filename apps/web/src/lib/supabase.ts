// NOTE: The web app currently runs in MOCK-DATA mode (see src/data/catalog.ts)
// and does not import this file at runtime. It is kept for future backend
// integration and intentionally does NOT throw at import time, so there is no
// requirement for the NEXT_PUBLIC_SUPABASE_* env vars while in mock mode.
//
// Mirrors apps/customer-mobile/src/lib/supabase.ts. To switch to a real backend:
// set the env vars, then have the data helpers call getSupabase() and query the
// schema in apps/customer-mobile/supabase/migrations/0001_init.sql.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Lazily creates the Supabase browser client. Returns null (and warns) if env
 * vars are missing, so callers can fall back to mock data instead of crashing.
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
  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

/** Whether a real backend is configured. */
export function hasSupabase(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
