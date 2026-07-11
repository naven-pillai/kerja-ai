import { createSupabasePublicClient } from '@/lib/supabase-public';
import { JobWithCompany } from '@/types/custom';
import JobCard from '@/components/common/JobCard';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import dayjs from 'dayjs';

export default async function FeaturedJobsSection() {
  const supabase = createSupabasePublicClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from('jobs')
    .select(`
      id, slug, title, job_type, job_category, job_location, remote_type,
      min_salary, max_salary, currency, tags, created_at, is_featured,
      company_id, expires_at, status, goes_public_at,
      company:companies(name, logo_url, slug)
    `)
    .eq('status', 'published')
    .lte('goes_public_at', now)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(15);

  const jobs = ((data ?? []) as JobWithCompany[]).filter(
    (job) => !job.expires_at || dayjs().isBefore(dayjs(job.expires_at))
  );

  if (jobs.length === 0) return null;

  const featured = jobs.filter((j) => j.is_featured);
  const regular = jobs.filter((j) => !j.is_featured);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest Remote &amp; Hybrid Jobs in APAC</h2>
          <p className="text-sm text-gray-500 mt-1">New roles added weekly across tech, marketing, design, and more.</p>
        </div>

        <div>
          {featured.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Featured</span>
                <div className="flex-1 h-px bg-amber-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featured.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {regular.length > 0 && (
            <>
              {featured.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">All Jobs</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}
              <div className="space-y-3">
                {regular.map((job, index) => (
                  <div key={job.id}>
                    <JobCard job={job} />
                    {index === 2 && (
                      <Link
                        href="/talents/signup"
                        className="group mt-3 flex items-center gap-4 p-5 rounded-xl border border-dashed border-[#1D4ED8]/30 bg-linear-to-r from-red-50/60 to-orange-50/40 hover:border-[#1D4ED8]/60 hover:from-red-50 hover:to-orange-50/60 transition-all duration-200"
                      >
                        <div className="w-11 h-11 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#1D4ED8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-[#1D4ED8] transition-colors">
                            Looking for remote or hybrid work in APAC?
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Create a free talent profile and let employers find you — no cold applying.
                          </p>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1.5 shrink-0 text-xs font-semibold text-white bg-[#1D4ED8] group-hover:bg-[#1E40AF] px-3 py-1.5 rounded-lg transition">
                          Get Listed Free →
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/jobs"
            className="inline-block bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explore More Jobs →
          </Link>
        </div>
      </div>
    </section>
  );
}
