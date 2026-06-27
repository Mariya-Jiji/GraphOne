/**
 * Supabase client singleton
 *
 * We use the service-role key (bypasses Row Level Security) because this is a
 * server-side API.  The anon key is intentionally NOT used here — it would
 * require RLS policies to be configured before any query works.
 *
 * The client is created once and reused across the process lifetime.
 * All environment variables are validated at startup in server.ts so that
 * missing config causes an early, obvious crash rather than a runtime error
 * deep inside a request handler.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing required environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_KEY. ' +
        'Copy .env.example to .env and fill in your Supabase project credentials.',
    );
  }

  _client = createClient(url, key, {
    auth: {
      // Disable auto-refresh tokens — unnecessary for a service-role server client
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}

// Convenience re-export so controllers can do: import { db } from '../db'
export const db = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
