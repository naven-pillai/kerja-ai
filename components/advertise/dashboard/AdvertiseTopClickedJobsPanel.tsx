'use client';

// Verbatim mirror of admin's TopClickedJobsPanel with only:
// - createSupabaseBrowserClient (public-site anon client, same RPC)
// - public /jobs/[slug] link

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { MousePointerClick, Zap, AlertCircle } from 'lucide-react';

type TopJob = {
  id: string;
  title: string;
  slug: string;
  clicks: number;
  companies: { name: string } | null;
};

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-6 w-6 rounded-full bg-gray-100 animate-pulse shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3.5 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
            </div>
          </div>
          <div className="h-5 bg-gray-100 rounded-full animate-pulse w-14" />
        </div>
      ))}
    </div>
  );
}

export default function AdvertiseTopClickedJobsPanel() {
  const [jobs, setJobs] = useState<TopJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createSupabaseBrowserClient();

        const { data: topData, error: rpcErr } = await supabase
          .rpc('top_jobs_by_event' as never, {
            p_event_type: 'click',
            p_limit: 5,
          } as never);

        if (rpcErr) throw rpcErr;

        const rows = (topData ?? []) as { job_id: string; event_count: number }[];
        const topIds = rows.map((r) => r.job_id);
        const countMap: Record<string, number> = {};
        for (const r of rows) {
          countMap[r.job_id] = r.event_count;
        }

        if (topIds.length === 0) {
          setJobs([]);
          return;
        }

        const { data: jobData, error: jobErr } = await supabase
          .from('jobs')
          .select('id, title, slug, companies(name)')
          .in('id', topIds);

        if (jobErr) throw jobErr;

        const merged: TopJob[] = topIds
          .map((id: string) => {
            const job = (jobData ?? []).find((j) => j.id === id);
            if (!job) return null;
            return {
              id: job.id,
              title: job.title,
              slug: job.slug,
              clicks: countMap[id],
              companies: job.companies as { name: string } | null,
            };
          })
          .filter(Boolean) as TopJob[];

        setJobs(merged);
      } catch {
        setError('Could not load top clicked jobs.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-violet-400 p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-gray-800">Top Clicked Jobs</h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">
          All time
        </span>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-gray-400">
          <MousePointerClick className="w-8 h-8 text-gray-300" />
          <p className="text-sm">No click data yet</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-50">
          {jobs.map((job, index) => (
            <li key={job.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-gray-300 w-4 shrink-0">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="text-sm font-medium text-gray-800 hover:text-violet-600 truncate block max-w-50"
                  >
                    {job.title}
                  </Link>
                  {job.companies?.name && (
                    <span className="text-xs text-gray-400 truncate">
                      {job.companies.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500 shrink-0">
                <MousePointerClick className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{job.clicks.toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
