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

  const title = `Remote & Hybrid Jobs in ${name}`;
  const description = `Browse verified remote and hybrid jobs open to candidates in ${name}. New roles added weekly across tech, marketing, design, and more.`;
  const url = `${BASE_URL}/job-location/${slug}`;

  return {
    title: `${title} | Kerja-AI`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
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
      job_type, job_category, job_location, remote_type,
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
      q: `Are the remote jobs in ${name} fully remote or hybrid?`,
      a: `Every listing on Kerja-AI for ${name} is labelled either 100% Remote or Hybrid, so you know before you apply. Fully remote roles let you work from anywhere within ${name} or the broader APAC region; hybrid roles note their office requirements on the listing.`,
    },
    {
      q: `What industries have the most remote and hybrid jobs in ${name}?`,
      a:
        topCategories.length > 0
          ? `The top categories for remote and hybrid jobs in ${name} currently include ${topCategories.slice(0, 3).join(', ')}. Tech, marketing, and design roles consistently see the most remote hiring across the region.`
          : `Tech, marketing, design, and customer support tend to have the most remote and hybrid openings in ${name}. Kerja-AI features verified roles across all these industries.`,
    },
    {
      q: `Do I need to be physically based in ${name} to apply?`,
      a: `It depends on the employer. Some roles require candidates to reside in ${name} for tax, timezone, or compliance reasons. Others are open to anyone in APAC. Each listing clearly states its location requirements.`,
    },
    {
      q: `How do I apply for remote jobs in ${name} on Kerja-AI?`,
      a: `Browse the listings on this page, click any job that interests you, and follow the direct application link. Kerja-AI links you straight to the employer's application — no account required to apply.`,
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
          <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <Link href="/job-location" className="hover:text-gray-600 transition">Locations</Link>
            <span>/</span>
            <span className="text-gray-600">{name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Remote &amp; Hybrid Jobs in <span className="text-[#1D4ED8]">{name}</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl leading-relaxed">
            {jobs.length > 0
              ? `Browse ${jobs.length} verified remote and hybrid job${jobs.length === 1 ? '' : 's'} open to candidates in ${name}. New roles added weekly across tech, marketing, design, and more.`
              : `Remote and hybrid job opportunities for candidates based in ${name}. New roles are added weekly — check back soon.`}
          </p>

          {jobs.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">
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
                  className="text-xs font-medium bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-100 transition"
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
            <p className="text-gray-500">No remote jobs found for {name} right now.</p>
            <Link href="/jobs" className="mt-4 inline-block text-[#1D4ED8] font-semibold hover:underline">
              Browse all remote jobs →
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
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
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
