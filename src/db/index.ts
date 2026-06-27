import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

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
    realtime: {
      transport: ws as any,
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