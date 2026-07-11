'use client';

// Verbatim mirror of admin's JobPerformanceTable with only:
// - createSupabaseBrowserClient (public-site anon client)
// - job link points to /jobs/[slug] (public) instead of /jobs/[slug]/edit
// - inline pagination footer (public site has no JobPagination component)

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
  Eye, MousePointerClick, Target, Search, ArrowUpDown, ArrowUp, ArrowDown,
  AlertCircle, Loader, Table2,
} from 'lucide-react';

type JobRow = {
  id: string;
  title: string;
  slug: string;
  company: string | null;
  views: number;
  clicks: number;
  ctr: number | null;
};

type SortKey = 'views' | 'clicks' | 'ctr';

function ctrBadge(ctr: number | null) {
  if (ctr === null) return 'bg-gray-50 text-gray-400';
  if (ctr >= 10) return 'bg-emerald-50 text-emerald-700';
  if (ctr >= 4) return 'bg-amber-50 text-amber-700';
  return 'bg-gray-50 text-gray-500';
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 flex-1 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function AdvertiseJobPerformanceTable() {
  const [rows, setRows] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('views');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createSupabaseBrowserClient();

        let q = supabase
          .from('jobs')
          .select('id, title, slug, companies(name)')
          .order('created_at', { ascending: false })
          .limit(1000);
        if (activeOnly) q = q.eq('status', 'published');

        const { data: jobs, error: jobErr } = await q;
        if (jobErr) throw jobErr;

        const jobList = (jobs ?? []) as {
          id: string; title: string; slug: string;
          companies: { name: string } | null;
        }[];

        if (jobList.length === 0) {
          setRows([]);
          return;
        }

        const ids = jobList.map((j) => j.id);
        const { data: statsData, error: statsErr } = await supabase.rpc(
          'get_jobs_stats' as never,
          { p_job_ids: ids } as never,
        );
        if (statsErr) throw statsErr;

        const statMap: Record<string, { views: number; clicks: number }> = {};
        ((statsData ?? []) as { job_id: string; views: number; clicks: number }[]).forEach((s) => {
          statMap[s.job_id] = { views: Number(s.views) || 0, clicks: Number(s.clicks) || 0 };
        });

        const merged: JobRow[] = jobList.map((j) => {
          const views = statMap[j.id]?.views ?? 0;
          const clicks = statMap[j.id]?.clicks ?? 0;
          return {
            id: j.id,
            title: j.title,
            slug: j.slug,
            company: j.companies?.name ?? null,
            views,
            clicks,
            ctr: views > 0 ? (clicks / views) * 100 : null,
          };
        });

        setRows(merged);
      } catch {
        setError('Could not load job performance.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeOnly]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? rows.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            (r.company?.toLowerCase().includes(term) ?? false)
        )
      : rows;

    const dir = sortDir === 'desc' ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? -1;
      const bv = b[sortKey] ?? -1;
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
  }, [rows, search, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, activeOnly, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paged = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortHeader = ({
    label, k, icon: Icon,
  }: {
    label: string; k: SortKey; icon: typeof Eye;
  }) => {
    const active = sortKey === k;
    const Arrow = !active ? ArrowUpDown : sortDir === 'desc' ? ArrowDown : ArrowUp;
    return (
      <button
        onClick={() => toggleSort(k)}
        className={`flex items-center justify-end gap-1 w-full transition-colors ${
          active ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
        <Arrow className="w-3 h-3" />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Table2 className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-800">Performance by Job</h2>
          {!loading && !error && (
            <span className="text-xs font-medium text-gray-400">({visible.length})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-300 focus:outline-none w-36 sm:w-44"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {([['Active', true], ['All', false]] as const).map(([label, val]) => (
              <button
                key={label}
                onClick={() => setActiveOnly(val)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeOnly === val
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
          <Loader className="w-8 h-8 text-gray-300" />
          <p className="text-sm">{search ? 'No jobs match your search' : 'No jobs to show'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-120">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="font-medium text-left py-2 pl-2 w-8">#</th>
                <th className="font-medium text-left py-2">Job</th>
                <th className="font-medium py-2 w-24"><SortHeader label="Views" k="views" icon={Eye} /></th>
                <th className="font-medium py-2 w-24"><SortHeader label="Clicks" k="clicks" icon={MousePointerClick} /></th>
                <th className="font-medium py-2 w-28 pr-2"><SortHeader label="Conv." k="ctr" icon={Target} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((row, i) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-2.5 pl-2 text-xs font-bold text-gray-300">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="py-2.5 pr-2 max-w-0">
                    <Link
                      href={`/jobs/${row.slug}`}
                      className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate block"
                    >
                      {row.title}
                    </Link>
                    {row.company && (
                      <span className="text-xs text-gray-400 truncate block">{row.company}</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-gray-700 font-medium">
                    {row.views.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-gray-700 font-medium">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-2 text-right">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${ctrBadge(row.ctr)}`}>
                      {row.ctr === null ? '—' : `${row.ctr.toFixed(1)}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2 text-xs text-gray-500">
              <span>
                Page <span className="font-semibold text-gray-700">{page}</span> of {totalPages} · {visible.length} jobs
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
