import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dayjs from 'dayjs';
import Link from 'next/link';
import { createSupabasePublicClient } from '@/lib/supabase-public';
import JobCard from '@/components/common/JobCard';
import { JobWithCompany } from '@/types/custom';
import { jobLocations, jobCategories, jobTypes } from '@/constants/job-filters';
import { slugify } from '@/lib/slugify';
import { slugify as catSlugify } from '@/utils/slugify';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/seo';

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export async function generateStaticParams() {
  return jobLocations.map((loc) => ({ slug: slugify(loc) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = jobLocations.find((l) => slugify(l) === slug);
  if (!name) return {};

  // Dropped the year: the layout now appends " - Kerja AI" (11 chars).
  const title = `AI, Machine Learning & Data Jobs in ${name}`;
  const description = `${name} AI, machine learning and data roles on Kerja AI — the niche board for the KL–Singapore corridor. Compare RM and SGD offers, updated weekly.`;
  const url = `${BASE_URL}/job-location/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: OG_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: TWITTER_IMAGES },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = jobLocations.find((l) => slugify(l) === slug);
  if (!name) return notFound();

  const supabase = createSupabasePublicClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      id, title, slug, created_at, is_featured,
      expires_at, goes_public_at,
      job_type, job_category, job_location, city, remote_type,
      min_salary, max_salary, currency, tags, apply_url,
      company:companies(name, slug, logo_url)
    `)
    .eq('status', 'published')
    .lte('goes_public_at', now)
    .not('goes_public_at', 'is', null)
    .contains('job_location', [name])
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return notFound();

  const jobs = ((data ?? []) as JobWithCompany[]).filter(
    (job) => !job.expires_at || dayjs().isBefore(dayjs(job.expires_at))
  );

  // Derived stats
  const topCategories = Array.from(
    jobs
      .flatMap((j) => j.job_category ?? [])
      .reduce((acc, cat) => acc.set(cat, (acc.get(cat) ?? 0) + 1), new Map<string, number>())
      .entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat]) => cat)
    .filter((c) => jobCategories.includes(c));

  const topTypes = Array.from(
    jobs
      .flatMap((j) => j.job_type ?? [])
      .reduce((acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1), new Map<string, number>())
      .entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([t]) => t)
    .filter((t) => jobTypes.includes(t));

  const uniqueCompanies = Array.from(
    new Map(
      jobs.filter((j) => j.company?.slug).map((j) => [j.company!.slug, j.company!.name])
    ).entries()
  ).slice(0, 5);

  // Other locations (for pills cloud)
  const otherLocations = jobLocations.filter((l) => l !== name);

  // FAQs
  const faqs = [
    {
      q: `What do AI and data jobs in ${name} pay?`,
      a: `Pay depends on the role and your level, and it is quoted in ${name}'s local currency — RM in Malaysia, SGD in Singapore. Because Kerja AI covers both sides of the KL–Singapore corridor, you can line up ${name} offers against the other market before you decide.`,
    },
    {
      q: `Which AI and data roles are hiring most in ${name}?`,
      a:
        topCategories.length > 0
          ? `Right now the most active ${name} categories on Kerja AI are ${topCategories.slice(0, 3).join(', ')}. Demand tracks what companies are actually building — model work, data pipelines, and applied AI.`
          : `AI Engineering, Machine Learning Engineering, and Data Science tend to lead hiring in ${name}. Kerja AI lists roles across all eleven AI and data categories.`,
    },
    {
      q: `Do I need to be based in ${name} to apply?`,
      a: `It depends on the employer. Some ${name} roles need you on the ground for tax or work-pass reasons; others hire across the KL–Singapore corridor. Each listing states its requirement, so you know before you apply.`,
    },
    {
      q: `How do I apply for ${name} AI jobs on Kerja AI?`,
      a: `Pick any role on this page and follow the link straight to the employer's own application. Kerja AI sends you direct — no account, no middleman. Posting a role is free for employers, so new ${name} listings arrive often.`,
    },
  ];

  // Schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Job Locations', item: `${BASE_URL}/job-location` },
      { '@type': 'ListItem', position: 3, name: name, item: `${BASE_URL}/job-location/${slug}` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 50).map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/jobs/${job.slug}`,
      name: job.title,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <main className="bg-[#f8f7f4] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <Link href="/job-location" className="hover:text-gray-600 transition">Locations</Link>
            <span>/</span>
            <span className="text-gray-600">{name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            AI &amp; Data Jobs in <span className="text-[#1D4ED8]">{name}</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl leading-relaxed">
            {jobs.length > 0
              ? `${jobs.length} AI, machine learning and data role${jobs.length === 1 ? '' : 's'} open in ${name} right now. Kerja AI tracks only this work — the roles AI is creating, on one board built for it.`
              : `AI, machine learning and data roles in ${name}. New listings go up every week as AI reshapes hiring here — check back soon.`}
          </p>

          {jobs.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
              <span>
                <span className="font-bold text-gray-700 text-base">{jobs.length}</span> open roles
              </span>
              {topTypes.length > 0 && (
                <span>
                  <span className="font-bold text-gray-700 text-base">{topTypes[0]}</span> most common type
                </span>
              )}
              {uniqueCompanies.length > 0 && (
                <span>
                  <span className="font-bold text-gray-700 text-base">{uniqueCompanies.length}+</span> companies hiring
                </span>
              )}
            </div>
          )}

          {topCategories.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {topCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/job-categories/${catSlugify(cat)}`}
                  className="text-xs font-medium bg-blue-50 text-[#1D4ED8] px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job listings */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No AI or data roles open in {name} right now.</p>
            <Link href="/jobs" className="mt-4 inline-block text-[#1D4ED8] font-semibold hover:underline">
              Browse all open roles →
            </Link>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other locations */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
          Explore Other Locations
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherLocations.map((loc) => (
            <Link
              key={loc}
              href={`/job-location/${slugify(loc)}`}
              className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8] transition"
            >
              {loc}
            </Link>
          ))}
        </div>
      </div>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
