'use client'; // ✅ Client Component safe (important if you use this inside components)

import { createSupabaseClient } from '@/lib/supabase-client';

export async function fetchBlogs() {
  const supabase = createSupabaseClient(); // ✅ Client-side Supabase instance

  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, category, date, created_at, status')
    .order('date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }

  return data || [];
}
