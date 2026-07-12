import { NextResponse } from 'next/server';
import { createSupabasePublicClient } from '@/lib/supabase-public';

/**
 * Full-text search over jobs, INCLUDING the description body.
 *
 * Returns matching job ids only — never the job rows. The board already holds
 * every published job client-side, so it just filters what it has. That keeps
 * the response a few hundred bytes regardless of how many jobs exist, instead of
 * shipping ~4.5 KB of description HTML per job to every visitor.
 *
 * Anon client: RLS already restricts reads to published, public jobs, so this
 * cannot leak drafts or pending submissions.
 */

const MAX_QUERY_LENGTH = 120;

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() ?? '';

  // Nothing to search — the client falls back to its local filter.
  if (!q) return NextResponse.json({ ids: [] });

  // A pathological query is a cheap way to make Postgres work hard. Cap it.
  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ ids: [], error: 'Query too long' }, { status: 400 });
  }

  const supabase = createSupabasePublicClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('id')
    // `websearch` gives users quoted "exact phrases", OR, and -exclusion for
    // free, and — unlike plainto_tsquery — never throws on odd punctuation.
    .textSearch('search_vector', q, { type: 'websearch', config: 'english' })
    .eq('status', 'published')
    .limit(200);

  if (error) {
    // Log server-side; the client degrades to its local (title/company/tag)
    // match rather than showing an error.
    console.error('[job-search] failed:', error.message);
    return NextResponse.json({ ids: [] }, { status: 200 });
  }

  return NextResponse.json(
    { ids: (data ?? []).map((row) => row.id) },
    // Same query from many visitors is common (the quick-search pills). Let the
    // CDN absorb it.
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}
