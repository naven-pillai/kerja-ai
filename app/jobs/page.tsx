import dayjs from 'dayjs';
import JobsContentPage from '@/components/jobs/JobsContentPage';
import { createSupabasePublicClient } from '@/lib/supabase-public';
import { JobWithCompany } from '@/types/custom';

export const metadata = {
  title: 'AI, ML & Data Jobs in Malaysia & Singapore 2026 | Kerja-AI',
  description:
    'AI, machine learning and data jobs across Malaysia and Singapore. One board built for these roles — filter by category, salary and location, and post free.',
  alternates: {
    canonical: 'https://kerja-ai.com/jobs',
  },
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // Fetched here rather than in a browser useEffect. That kept the entire board
  // out of the initial HTML (download JS -> hydrate -> open a Supabase
  // connection -> fetch -> paint) and shipped the Supabase client to every
  // visitor. Filtering and sorting still happen on the client.
  //
  // Card columns only: `description` (large HTML), seo_title and seo_description
  // were fetched for every job on the board and read by nothing.
  const supabase = createSupabasePublicClient();

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id, title, slug, created_at, is_featured, status, expires_at,
      valid_through, job_type, job_category, job_location, remote_type,
      min_salary, max_salary, currency, tags, apply_url,
      company_id, goes_public_at,
      company:companies(name, slug, logo_url)
    `)
    .eq('status', 'published')
    .lte('goes_public_at', new Date().toISOString())
    .not('goes_public_at', 'is', null)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching jobs:', error);

  const jobs = ((data ?? []) as JobWithCompany[]).filter(
    (j) => !j.expires_at || dayjs().isBefore(dayjs(j.expires_at))
  );

  return <JobsContentPage initialKeyword={q ?? ''} jobs={jobs} loadError={Boolean(error)} />;
}
