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

export default async function LivePlatformStats() {
  const live = await fetchLiveJobs();

  const roleCount = live.length;
  const companyCount = new Set(live.map((j) => j.company_id).filter(Boolean)).size;

  const stats = [
    { value: roleCount.toLocaleString('en-US'), label: roleCount === 1 ? 'live role' : 'live roles' },
    { value: companyCount.toLocaleString('en-US'), label: 'hiring companies' },
    { value: '2', label: 'markets — MY & SG' },
    { value: '100%', label: 'manually reviewed' },
  ];

  const trust = [
    'No scraped listings',
    'Direct company applications',
    'No pay-to-apply jobs',
    'Malaysia & Singapore only',
  ];

  return (
    <section className="border-y border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4">
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-3xl font-extrabold tracking-tight text-[#1D4ED8]">
                  {s.value}
                </span>
                <span className="mt-1 block text-sm text-gray-600">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-gray-500">
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
