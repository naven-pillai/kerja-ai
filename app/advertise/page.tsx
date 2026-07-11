import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import AdvertiseHero from '@/components/advertise/AdvertiseHero';
import AdvertiseAudience from '@/components/advertise/AdvertiseAudience';
import AdvertiseSlotGrid from '@/components/advertise/AdvertiseSlotGrid';
import AdvertiseWhy from '@/components/advertise/AdvertiseWhy';
import AdvertiseFAQ from '@/components/advertise/AdvertiseFAQ';
import AdvertiseFooterCTA from '@/components/advertise/AdvertiseFooterCTA';
import AdvertiseAnalytics from '@/components/advertise/dashboard/AdvertiseAnalytics';

export const revalidate = 1800; // refresh audience data every 30 min

export const metadata: Metadata = {
  title: 'Advertise with Kerja-AI · AI & Data talent in Malaysia & Singapore',
  description:
    "Reach AI, machine learning and data professionals in Malaysia and Singapore via Kerja-AI's newsletter, sidebar banners and sponsored content. Niche, intent-matched audience.",
  alternates: { canonical: 'https://kerja-ai.com/advertise' },
  openGraph: {
    title: 'Advertise with Kerja-AI',
    description:
      "Reach Malaysia and Singapore's most-engaged AI & data audience. Newsletter, sidebar, sponsored posts — niche reach, intent signal, no fluff.",
    url: 'https://kerja-ai.com/advertise',
    siteName: 'Kerja-AI',
    type: 'website',
  },
};

export default async function AdvertisePage() {
  const supabase = await createSupabaseServerClient();
  const nowIso = new Date().toISOString();

  // Audience snapshot data — derived from published jobs (location + category).
  const jobsRes = await supabase
    .from('jobs')
    .select('job_location, job_category')
    .eq('status', 'published')
    .lte('goes_public_at', nowIso);

  // Top countries — derived from job locations
  const countryCounts: Record<string, number> = {};
  for (const j of jobsRes.data ?? []) {
    const locs = Array.isArray(j.job_location) ? j.job_location : j.job_location ? [j.job_location] : [];
    for (const l of locs as string[]) {
      if (l) countryCounts[l] = (countryCounts[l] ?? 0) + 1;
    }
  }
  const flagMap: Record<string, string> = {
    Malaysia: '🇲🇾',
    Singapore: '🇸🇬',
  };
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, flag: flagMap[name] }));

  // Top roles — derived from job categories
  const roleCounts: Record<string, number> = {};
  for (const j of jobsRes.data ?? []) {
    const cats = Array.isArray(j.job_category) ? j.job_category : j.job_category ? [j.job_category] : [];
    for (const c of cats as string[]) {
      if (c) roleCounts[c] = (roleCounts[c] ?? 0) + 1;
    }
  }
  const topRoles = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  // Channel reach (manually maintained)
  const reach = [
    { channel: 'Newsletter', size: '6,000+', note: 'Weekly · 35%+ open rate' },
    { channel: 'LinkedIn', size: '3,000+', note: 'Founders + remote talent' },
    { channel: 'X (Twitter)', size: '4,500+', note: 'APAC remote community' },
    { channel: 'Site traffic', size: '~12,000', note: 'Monthly pageviews' },
  ];

  return (
    <main className="bg-white">
      <AdvertiseHero />
      <AdvertiseAnalytics />
      <AdvertiseAudience topCountries={topCountries} topRoles={topRoles} reach={reach} />
      <AdvertiseSlotGrid />
      <AdvertiseWhy />
      <AdvertiseFAQ />
      <AdvertiseFooterCTA />
    </main>
  );
}
