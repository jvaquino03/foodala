// NOTE: The app currently runs in MOCK-DATA mode and does not import this file.
// It is kept for future backend integration. It intentionally does NOT throw at
// import time, so there is no runtime requirement for the EXPO_PUBLIC_SUPABASE_*
// env vars while in mock mode.
//
// To switch to a real backend later: set the env vars, then have the screens call
// `getSupabase()` / use the helpers in src/data instead of the mock data helpers.

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Lazily creates the Supabase client. Returns null (and warns) if env vars are
 * missing, so callers can fall back to mock data instead of crashing.
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase env vars are not set; running without a backend. ' +
        'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable it.'
    );
    return null;
  }
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
