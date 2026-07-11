'use client';

// Verbatim mirror of admin's CtrSegmentTable — same RPCs
// (job_ctr_by_category / job_ctr_by_country), same date-window params.
// Two adjustments only:
// - createSupabaseBrowserClient (public anon client, same RPC surface)
// - inline pagination footer (public site has no JobPagination component)

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from 'recharts';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
  Eye, MousePointerClick, Target, ArrowUpDown, ArrowUp, ArrowDown,
  AlertCircle, Loader,
} from 'lucide-react';

const MIN_CONFIDENT_VIEWS = 20;
const CHART_TOP_N = 8;
const CTR_COLOR = '#059669';

type Row = { segment: string; views: number; clicks: number; ctr: number | null };
type SortKey = 'views' | 'clicks' | 'ctr';

type Props = {
  rpcName: 'job_ctr_by_category' | 'job_ctr_by_country';
  startISO: string;
  endISO: string;
  title: string;
  segmentLabel: string;
  icon: typeof Target;
  noun: string;
};

const PAGE_SIZE = 10;

function ChartTooltip({ active, payload }: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{r.segment}</p>
      <p className="text-gray-500">{r.views.toLocaleString()} views · {r.clicks.toLocaleString()} clicks</p>
      <p className="font-semibold text-emerald-700">{r.ctr === null ? '—' : `${r.ctr.toFixed(1)}% CTR`}</p>
    </div>
  );
}

function ctrBadge(ctr: number | null, confident: boolean) {
  if (ctr === null) return 'bg-gray-50 text-gray-400';
  if (!confident) return 'bg-gray-50 text-gray-400';
  if (ctr >= 10) return 'bg-emerald-50 text-emerald-700';
  if (ctr >= 4) return 'bg-amber-50 text-amber-700';
  return 'bg-gray-50 text-gray-500';
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <div className="h-4 flex-1 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function AdvertiseCtrSegmentTable({
  rpcName, startISO, endISO, title, segmentLabel, icon: Icon, noun,
}: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('views');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error: rpcErr } = await supabase
          .rpc(rpcName as never, { p_start: startISO, p_end: endISO } as never);
        if (rpcErr) throw rpcErr;

        const raw = (data ?? []) as { segment: string; views: number; clicks: number }[];
        setRows(
          raw.map((r) => {
            const views = Number(r.views) || 0;
            const clicks = Number(r.clicks) || 0;
            return { segment: r.segment, views, clicks, ctr: views > 0 ? (clicks / views) * 100 : null };
          })
        );
      } catch {
        setError('Could not load this breakdown.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [rpcName, startISO, endISO]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sorted = useMemo(() => {
    const dir = sortDir === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      const av = a[sortKey] ?? -1;
      const bv = b[sortKey] ?? -1;
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
  }, [rows, sortKey, sortDir]);

  const chartData = useMemo(() => {
    return rows
      .filter((r) => r.views >= MIN_CONFIDENT_VIEWS && r.ctr !== null)
      .sort((a, b) => (a.ctr as number) - (b.ctr as number))
      .slice(-CHART_TOP_N);
  }, [rows]);

  useEffect(() => { setPage(1); }, [startISO, endISO, sortKey, sortDir]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortHeader = ({ label, k, icon: I }: { label: string; k: SortKey; icon: typeof Eye }) => {
    const active = sortKey === k;
    const Arrow = !active ? ArrowUpDown : sortDir === 'desc' ? ArrowDown : ArrowUp;
    return (
      <button
        onClick={() => toggleSort(k)}
        className={`flex items-center justify-end gap-1 w-full transition-colors ${
          active ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <I className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
        <Arrow className="w-3 h-3" />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {!loading && !error && <span className="text-xs font-medium text-gray-400">({sorted.length})</span>}
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
          <Loader className="w-7 h-7 text-gray-300" />
          <p className="text-sm">No data in this period</p>
        </div>
      ) : (
        <>
          {chartData.length > 0 && (
            <div className="pb-4 mb-1 border-b border-gray-50">
              <p className="text-xs text-gray-400 mb-2">
                Top {chartData.length} by CTR · {MIN_CONFIDENT_VIEWS}+ views only
              </p>
              <ResponsiveContainer width="100%" height={Math.max(140, chartData.length * 30 + 20)}>
                <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 46, left: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis
                    type="category"
                    dataKey="segment"
                    width={130}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f9fafb' }} />
                  <Bar dataKey="ctr" fill={CTR_COLOR} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList
                      dataKey="ctr"
                      position="right"
                      formatter={(v) => `${Number(v).toFixed(1)}%`}
                      style={{ fontSize: 11, fill: '#374151', fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-105">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="font-medium text-left py-2 pl-2">{segmentLabel}</th>
                  <th className="font-medium py-2 w-24"><SortHeader label="Views" k="views" icon={Eye} /></th>
                  <th className="font-medium py-2 w-24"><SortHeader label="Clicks" k="clicks" icon={MousePointerClick} /></th>
                  <th className="font-medium py-2 w-28 pr-2"><SortHeader label="CTR" k="ctr" icon={Target} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((row) => {
                  const confident = row.views >= MIN_CONFIDENT_VIEWS;
                  return (
                    <tr key={row.segment} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 pl-2 pr-2 font-medium text-gray-800 truncate max-w-0">{row.segment}</td>
                      <td className="py-2.5 text-right tabular-nums text-gray-700 font-medium">{row.views.toLocaleString()}</td>
                      <td className="py-2.5 text-right tabular-nums text-gray-700 font-medium">{row.clicks.toLocaleString()}</td>
                      <td className="py-2.5 pr-2 text-right">
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${ctrBadge(row.ctr, confident)}`}
                          title={confident ? undefined : `Low confidence — under ${MIN_CONFIDENT_VIEWS} views`}
                        >
                          {row.ctr === null ? '—' : `${row.ctr.toFixed(1)}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-2 px-2 text-xs text-gray-500">
              <span>
                Page <span className="font-semibold text-gray-700">{page}</span> of {totalPages} · {sorted.length} {noun}
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
        </>
      )}
    </div>
  );
}
