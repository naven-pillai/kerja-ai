import Link from 'next/link';
import dayjs from 'dayjs';
import { Briefcase, ArrowRight } from 'lucide-react';
import { createSupabasePublicClient } from '@/lib/supabase-public';
import { JobWithCompany } from '@/types/custom';
import JobCard from '@/components/common/JobCard';

export const revalidate = 300;

export default async function JobNotFound() {
  const supabase = createSupabasePublicClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from('jobs')
    .select(`
      id, slug, title, job_type, job_category, job_location, city, remote_type,
      min_salary, max_salary, currency, tags, created_at, is_featured,
      company_id, expires_at, status, goes_public_at,
      company:companies(name, logo_url, slug)
    `)
    .eq('status', 'published')
    .lte('goes_public_at', now)
    .order('created_at', { ascending: false })
    .limit(6);

  const jobs = ((data ?? []) as JobWithCompany[]).filter(
    (job) => !job.expires_at || dayjs().isBefore(dayjs(job.expires_at))
  );

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-5">
          <Briefcase className="w-5 h-5 text-gray-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          This role is no longer open
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          The listing has closed or been taken down. Plenty of AI and data roles
          across Malaysia and Singapore are still open — start with these.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-lg text-sm font-semibold transition"
          >
            Browse all jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/newsletter"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg text-sm font-semibold transition"
          >
            Get jobs by email
          </Link>
        </div>
      </div>

      {jobs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Latest AI &amp; data jobs
          </h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/jobs"
              className="text-sm font-semibold text-[#1D4ED8] hover:underline"
            >
              See all open roles →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
