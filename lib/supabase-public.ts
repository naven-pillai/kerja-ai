// lib/supabase-public.ts
// Cookie-free Supabase client for public data fetches in server components.
// Does NOT opt into dynamic rendering — allows Next.js caching/ISR.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export function createSupabasePublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
