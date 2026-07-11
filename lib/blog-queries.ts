import { createSupabaseClient } from './supabase-client';

export async function fetchBlogs() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('blogs').select('*').order('date', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data;
}

export async function fetchBlogBySlug(slug: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function fetchRelatedBlogs(currentSlug: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('blogs')
    .select('id, title, slug, excerpt')
    .neq('slug', currentSlug)
    .limit(3);
  if (error) throw error;
  return data || [];
}
