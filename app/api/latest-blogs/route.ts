import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, featured_image, category, updated_at')
    .order('date', { ascending: false, nullsFirst: false })
    .limit(6);

  if (error) {
    console.error('Error fetching latest blogs:', error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
