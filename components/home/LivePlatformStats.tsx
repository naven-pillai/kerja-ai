/**
 * Live proof, straight under the hero. The numbers are real — counted from the
 * same published/public/unexpired rules the /jobs board uses — so they can't
 * drift from what a visitor sees when they click through. Hard-coded "70+"
 * figures are the thing this deliberately avoids.
 *
 * The counts are fetched through Next's data cache with the same 60s window as
 * the page (revalidate below), so the number baked into the ISR HTML and the
 * number the client hydrates against are always the same snapshot. Fetching an
 * uncached count inside a Suspense boundary is what caused a hydration mismatch
 * — the cached shell and the streamed count disagreed.
 *
 * Paired with the trust line, because the evaluation's point stands: the
 * "manually reviewed, no scraped noise" promise is Kerja AI's strongest
 * differentiator and it should be shown, not buried in prose.
 */

import Link from 'next/link';
import { Briefcase, Building2, Globe2, BadgeCheck } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type LiveJob = { company_id: string | null };

async function fetchLiveJobs(): Promise<LiveJob[]> {
  // The clock lives here, in a plain async helper, not in the component render —
  // and every "live job" rule (published, public, unexpired) is pushed into the
  // query so the component itself does no filtering.
  const now = new Date().toISOString();
  const query =
    `select=company_id` +
    `&status=eq.published` +
    `&goes_public_at=lte.${encodeURIComponent(now)}` +
    `&goes_public_at=not.is.null` +
    `&or=(expires_at.is.null,expires_at.gt.${encodeURIComponent(now)})`;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?${query}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      // Cached and revalidated on the page's cadence, so the count is one stable
      // snapshot per ISR window rather than a fresh read per render.
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as LiveJob[];
  } catch {
    return [];
  }
}

type Stat = {
  value: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
};

export default async function LivePlatformStats() {
  const live = await fetchLiveJobs();

  const roleCount = live.length;
  const companyCount = new Set(live.map((j) => j.company_id).filter(Boolean)).size;

  const stats: Stat[] = [
    {
      value: roleCount.toLocaleString('en-US'),
      label: roleCount === 1 ? 'live role' : 'live roles',
      href: '/jobs',
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      value: companyCount.toLocaleString('en-US'),
      label: 'hiring companies',
      href: '/companies',
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      // Flags rather than a bare "2" — it names the markets instead of counting
      // them, which reads as substance, not filler.
      value: '🇲🇾 🇸🇬',
      label: 'Malaysia & Singapore',
      icon: <Globe2 className="h-4 w-4" />,
    },
    {
      value: '100%',
      label: 'manually reviewed',
      icon: <BadgeCheck className="h-4 w-4" />,
    },
  ];

  const trust = [
    'No scraped listings',
    'Direct company applications',
    'No pay-to-apply jobs',
    'Malaysia & Singapore only',
  ];

  return (
    <section className="border-b border-gray-100 bg-linear-to-b from-slate-50/80 to-white py-9">
      <div className="mx-auto max-w-5xl px-4">
        <dl className="grid grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-gray-200/70">
          {stats.map((stat) => {
            // The two live counts double as navigation — they are the proof and
            // the thing a visitor most wants to click.
            const inner = (
              <>
                <dt className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="text-gray-300">{stat.icon}</span>
                  {stat.label}
                </dt>
                <dd className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#1D4ED8]">
                  {stat.value}
                </dd>
              </>
            );
            return (
              <div key={stat.label} className="px-2 py-1 text-center">
                {stat.href ? (
                  <Link
                    href={stat.href}
                    className="block rounded-lg transition hover:text-[#1E40AF] [&_dd]:transition-colors [&:hover_dd]:text-[#1E40AF]"
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </dl>

        <ul className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-gray-100 pt-5 text-xs font-medium text-gray-500">
          {trust.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5 shrink-0 text-[#14B8A6]"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
