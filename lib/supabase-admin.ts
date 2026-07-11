import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

let client: SupabaseClient<Database> | null = null;

/**
 * Service-role client. Bypasses RLS — server-only, never import from a
 * 'use client' module.
 *
 * Lazily constructed, on purpose. createClient() throws "supabaseUrl is
 * required" when the env vars are absent, and Next evaluates route modules at
 * build time to collect page data. Constructing at module scope therefore made
 * the *build* depend on runtime secrets being present in the build environment,
 * so a deploy without them broke before serving a single request.
 *
 * Constructing on first use keeps that failure at request time, in the route
 * that actually needs the database.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      throw new Error(
        'Missing Supabase admin env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set.'
      );
    }

    client = createClient<Database>(url, serviceRoleKey);
  }

  return client;
}
