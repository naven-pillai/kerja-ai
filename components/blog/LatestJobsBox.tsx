import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { Briefcase } from 'lucide-react';
import CompanyLogo from '@/components/common/CompanyLogo';

type Job = {
  id: string;
  title: string;
  slug: string;
  job_category: string[];
  job_location: string[];
  companies: { name: string; logo_url: string | null } | null;
};

export default async function LatestJobsBox() {
  const supabase = await createSupabaseServerClient();

  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, slug, job_category, job_location, companies(name, logo_url)')
    .eq('is_active', true)
    .lt('created_at', twelveHoursAgo)
    .order('created_at', { ascending: false })
    .limit(5) as { data: Job[] | null };

  if (!jobs?.length) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-[#1D4ED8]" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Latest Jobs
          </h4>
        </div>
        <Link
          href="/jobs"
          className="text-xs font-semibold text-[#1D4ED8] hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* Job list */}
      <div className="divide-y divide-gray-50">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            {/* Company logo */}
            <div className="shrink-0">
              <CompanyLogo
                src={job.companies?.logo_url}
                alt={job.companies?.name ?? 'Company'}
                size={32}
                className="rounded-md border border-gray-100"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 group-hover:text-[#1D4ED8] transition-colors leading-snug line-clamp-2">
                {job.title}
              </p>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {job.companies?.name && (
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full truncate">
                    {job.companies.name}
                  </span>
                )}
                {job.job_location?.[0] && (
                  <span className="text-[10px] font-medium bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full truncate">
                    {job.job_location[0].replace(/^Remote\s*-\s*/i, '')}
                  </span>
                )}
                {job.job_category?.[0] && (
                  <span className="text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full truncate">
                    {job.job_category[0]}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
