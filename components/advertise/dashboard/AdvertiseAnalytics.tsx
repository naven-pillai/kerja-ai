'use client';

// Verbatim mirror of admin app/analytics/page.tsx.
// Uses the same Postgres RPCs (job_events_daily, top_jobs_by_event,
// get_jobs_stats, job_ctr_by_category, job_ctr_by_country) via the
// public anon browser client — so the numbers here are identical to
// /analytics in the admin dashboard.

import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import AdvertiseTopViewedJobsPanel from './AdvertiseTopViewedJobsPanel';
import AdvertiseTopClickedJobsPanel from './AdvertiseTopClickedJobsPanel';
import AdvertiseJobPerformanceTable from './AdvertiseJobPerformanceTable';
import AdvertiseCtrSegmentTable from './AdvertiseCtrSegmentTable';
import {
  Eye, MousePointerClick, Target, AlertCircle, Loader, BarChart3, Tags, Globe,
} from 'lucide-react';

type DailyRow = { day: string; views: number; clicks: number };
type SeriesPoint = { label: string; views: number; clicks: number };

const VIEW_COLOR = '#2563eb';
const CLICK_COLOR = '#7c3aed';

const PRESETS = [
  { key: 'today', short: 'Today', full: 'Today' },
  { key: 'yday',  short: 'Yday',  full: 'Yesterday' },
  { key: '7d',    short: '7D',    full: 'Last 7 days' },
  { key: '14d',   short: '14D',   full: 'Last 14 days' },
  { key: '30d',   short: '30D',   full: 'Last 30 days' },
  { key: 'mtd',   short: 'MTD',   full: 'This month' },
  { key: 'lm',    short: 'LM',    full: 'Last month' },
] as const;

type PresetKey = (typeof PRESETS)[number]['key'];

function computeRange(key: PresetKey): { start: Date; end: Date; days: number } {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysBetween = (a: Date, b: Date) =>
    Math.max(1, Math.round((b.getTime() - a.getTime()) / 86_400_000));
  const back = (n: number) => { const s = new Date(now); s.setDate(s.getDate() - n); return s; };

  switch (key) {
    case 'today': return { start: startOfToday, end: now, days: 1 };
    case 'yday': {
      const s = new Date(startOfToday); s.setDate(s.getDate() - 1);
      return { start: s, end: startOfToday, days: 1 };
    }
    case '7d':  return { start: back(7),  end: now, days: 7 };
    case '14d': return { start: back(14), end: now, days: 14 };
    case '30d': return { start: back(30), end: now, days: 30 };
    case 'mtd': {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: s, end: now, days: daysBetween(s, now) };
    }
    case 'lm': {
      const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const e = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: s, end: e, days: daysBetween(s, e) };
    }
  }
}

function formatDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { color: string; value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold capitalize">
          {p.value.toLocaleString()} {p.name}
        </p>
      ))}
    </div>
  );
}

function SummaryCard({
  label, value, sub, icon: Icon, color, bg, accent, loading,
}: {
  label: string;
  value: string;
  sub: string | null;
  icon: typeof Eye;
  color: string;
  bg: string;
  accent: string;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent} rounded-l-2xl`} />
      <div className="flex items-center justify-between pl-3">
        <div className={`p-2 rounded-xl ${bg}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        {sub && !loading && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${color}`}>
            {sub}
          </span>
        )}
      </div>
      <div className="pl-3">
        {loading ? (
          <div className="h-9 w-24 rounded bg-gray-100 animate-pulse" />
        ) : (
          <div className="text-3xl font-bold text-gray-900">{value}</div>
        )}
        <div className="text-sm text-gray-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function AdvertiseAnalytics() {
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [preset, setPreset] = useState<PresetKey>('30d');
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { startISO, endISO, days, fullLabel } = useMemo(() => {
    const r = computeRange(preset);
    return {
      startISO: r.start.toISOString(),
      endISO: r.end.toISOString(),
      days: r.days,
      fullLabel: PRESETS.find((p) => p.key === preset)!.full,
    };
  }, [preset]);

  useEffect(() => {
    const load = async () => {
      setChartLoading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error: rpcErr } = await supabase
          .rpc('job_events_daily' as never, { p_start: startISO, p_end: endISO } as never);
        if (rpcErr) throw rpcErr;

        const rows = (data ?? []) as DailyRow[];
        setSeries(
          rows.map((r) => ({
            label: formatDay(r.day),
            views: Number(r.views) || 0,
            clicks: Number(r.clicks) || 0,
          }))
        );
      } catch {
        setError('Could not load the traffic trend.');
      } finally {
        setChartLoading(false);
      }
    };
    load();
  }, [startISO, endISO]);

  const periodTotals = useMemo(() => {
    return series.reduce(
      (acc, p) => ({ views: acc.views + p.views, clicks: acc.clicks + p.clicks }),
      { views: 0, clicks: 0 }
    );
  }, [series]);

  const ctr = useMemo(() => {
    if (periodTotals.views === 0) return null;
    return (periodTotals.clicks / periodTotals.views) * 100;
  }, [periodTotals]);

  const perDay = (total: number) => Math.round(total / days);

  const tickInterval = Math.max(0, Math.floor(series.length / 8));

  return (
    <section className="bg-gray-50 px-4 sm:px-8 py-12 text-gray-900">
      <div className="w-full max-w-7xl mx-auto space-y-8">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Analytics</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-[#1D4ED8]" />
              Job Traffic
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              How many people are viewing jobs and how many click through to apply.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-center overflow-x-auto max-w-full">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                title={p.full}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  preset === p.key
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.short}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            label={`Views · ${fullLabel}`}
            value={periodTotals.views.toLocaleString()}
            sub={days > 1 && periodTotals.views > 0 ? `~${perDay(periodTotals.views).toLocaleString()} / day` : null}
            icon={Eye}
            color="text-blue-600"
            bg="bg-blue-50"
            accent="bg-blue-600"
            loading={chartLoading}
          />
          <SummaryCard
            label={`Clicks · ${fullLabel}`}
            value={periodTotals.clicks.toLocaleString()}
            sub={days > 1 && periodTotals.clicks > 0 ? `~${perDay(periodTotals.clicks).toLocaleString()} / day` : null}
            icon={MousePointerClick}
            color="text-violet-600"
            bg="bg-violet-50"
            accent="bg-violet-600"
            loading={chartLoading}
          />
          <SummaryCard
            label="Click-Through Rate"
            value={ctr === null ? '—' : `${ctr.toFixed(1)}%`}
            sub={ctr === null ? null : 'clicks ÷ views'}
            icon={Target}
            color="text-emerald-600"
            bg="bg-emerald-50"
            accent="bg-emerald-600"
            loading={chartLoading}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Views vs Clicks</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {periodTotals.views.toLocaleString()} views &middot;{' '}
              {periodTotals.clicks.toLocaleString()} clicks &middot; {fullLabel}
            </p>
          </div>

          {chartLoading ? (
            <div className="flex items-center justify-center h-75 text-gray-400 gap-2 text-sm">
              <Loader className="w-4 h-4 animate-spin" /> Loading trend…
            </div>
          ) : series.every((p) => p.views === 0 && p.clicks === 0) ? (
            <div className="flex flex-col items-center justify-center h-75 gap-2 text-gray-400">
              <BarChart3 className="w-10 h-10 text-gray-300" />
              <p className="text-sm">No view or click activity in this period yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={VIEW_COLOR} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={VIEW_COLOR} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CLICK_COLOR} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CLICK_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  interval={tickInterval}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb' }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  formatter={(v) => <span className="text-gray-500 capitalize">{v}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke={VIEW_COLOR}
                  strokeWidth={2}
                  fill="url(#viewsGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke={CLICK_COLOR}
                  strokeWidth={2}
                  fill="url(#clicksGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <AdvertiseJobPerformanceTable />

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            CTR by Segment · {fullLabel}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Jobs can carry several categories/countries, so a view or click counts toward each of its
            tags — segments overlap and won&apos;t sum to the totals above.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <AdvertiseCtrSegmentTable
              rpcName="job_ctr_by_category"
              startISO={startISO}
              endISO={endISO}
              title="By Category"
              segmentLabel="Category"
              icon={Tags}
              noun="categories"
            />
            <AdvertiseCtrSegmentTable
              rpcName="job_ctr_by_country"
              startISO={startISO}
              endISO={endISO}
              title="By Country"
              segmentLabel="Country"
              icon={Globe}
              noun="countries"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Top Performers
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <AdvertiseTopViewedJobsPanel />
            <AdvertiseTopClickedJobsPanel />
          </div>
        </div>

      </div>
    </section>
  );
}
