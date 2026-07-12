import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dayjs from 'dayjs';
import Link from 'next/link';
import { createSupabasePublicClient } from '@/lib/supabase-public';
import JobCard from '@/components/common/JobCard';
import { JobWithCompany } from '@/types/custom';
import { jobCategories, jobLocations, jobTypes } from '@/constants/job-filters';
import { slugify } from '@/utils/slugify';
import { slugify as locSlugify } from '@/lib/slugify';

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export async function generateStaticParams() {
  return jobCategories.map((cat) => ({ slug: slugify(cat) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = jobCategories.find((c) => slugify(c) === slug);
  if (!name) return {};

  // The root layout appends " - Kerja AI" (11 chars), leaving 49 for the page
  // title. Long category names ("Machine Learning Engineering" = 28) can't also
  // carry the full country names, so they fall back to MY & SG.
  const title =
    name.length > 19
      ? `${name} Jobs in MY & SG`
      : `${name} Jobs in Malaysia & Singapore`;
  const description = `${name} jobs across Malaysia and Singapore. Kerja AI is the board built only for AI and data careers, with new roles added every week.`;
  const url = `${BASE_URL}/job-categories/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = jobCategories.find((c) => slugify(c) === slug);
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
    .contains('job_category', [name])
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return notFound();

  const jobs = ((data ?? []) as JobWithCompany[]).filter(
    (job) => !job.expires_at || dayjs().isBefore(dayjs(job.expires_at))
  );

  // Derived stats
  const topLocations = Array.from(
    jobs
      .flatMap((j) => j.job_location ?? [])
      .reduce((acc, loc) => acc.set(loc, (acc.get(loc) ?? 0) + 1), new Map<string, number>())
      .entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([loc]) => loc)
    .filter((l) => jobLocations.includes(l));

  const topTypes = Array.from(
    jobs
      .flatMap((j) => j.job_type ?? [])
      .reduce((acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1), new Map<string, number>())
      .entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t)
    .filter((t) => jobTypes.includes(t));

  const uniqueCompanies = Array.from(
    new Map(
      jobs.filter((j) => j.company?.slug).map((j) => [j.company!.slug, j.company!.name])
    ).entries()
  ).slice(0, 5);

  // Other categories for pill cloud
  const otherCategories = jobCategories.filter((c) => c !== name);

  const nameLower = name.toLowerCase();

  // FAQs
  const faqs = [
    {
      q: `What does a ${name} role in Malaysia or Singapore involve?`,
      a: `A ${name} role covers the build-and-ship side of AI: shaping data, training or wiring up models, and getting them into production. Employers on Kerja AI hire for real AI, machine learning and data teams across Malaysia and Singapore, not generic tech work.`,
    },
    {
      q: `Which skills get you hired for ${nameLower} jobs in MY and SG?`,
      a:
        topTypes.length > 0
          ? `Most ${nameLower} openings on Kerja AI are ${topTypes.join(', ')} positions. Employers weigh real project work — models shipped, data problems solved — over titles alone. Each listing spells out the exact stack it wants.`
          : `Employers hiring ${nameLower} talent weigh shipped project work — models, pipelines, real data problems — over titles alone. Each listing spells out the exact stack and level it wants.`,
    },
    {
      q: `Where are most ${nameLower} jobs — Malaysia or Singapore?`,
      a:
        topLocations.length > 0
          ? `Right now ${nameLower} roles on Kerja AI concentrate in ${topLocations.slice(0, 3).join(', ')}. The KL–Singapore corridor is where most AI and data hiring happens, and comparing RM against SGD offers is worth the effort.`
          : `${name} roles on Kerja AI run across Malaysia and Singapore — the KL–Singapore corridor, where most AI and data hiring sits. Comparing RM against SGD offers is worth the effort.`,
    },
    {
      q: `How do I apply for ${nameLower} jobs on Kerja AI?`,
      a: `Click any role on this page that fits, and you go straight to the employer's own application — no account, no middleman. New ${nameLower} roles land regularly, so it is worth bookmarking this page and checking back.`,
    },
  ];

  // Schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Job Categories', item: `${BASE_URL}/job-categories` },
      { '@type': 'ListItem', position: 3, name: name, item: `${BASE_URL}/job-categories/${slug}` },
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
            <Link href="/job-categories" className="hover:text-gray-600 transition">Categories</Link>
            <span>/</span>
            <span className="text-gray-600">{name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-[#1D4ED8]">{name}</span> Jobs in Malaysia &amp; Singapore
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl leading-relaxed">
            {jobs.length > 0
              ? `${jobs.length} ${nameLower} role${jobs.length === 1 ? '' : 's'} open across Malaysia and Singapore right now. Kerja AI lists only AI, machine learning and data work — the jobs AI is creating, not the whole board.`
              : `${name} roles across Malaysia and Singapore. New listings go up as AI reshapes hiring here — check back soon.`}
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

          {topLocations.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {topLocations.map((loc) => (
                <Link
                  key={loc}
                  href={`/job-location/${locSlugify(loc)}`}
                  className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                >
                  {loc}
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
            <p className="text-gray-500">No {nameLower} roles open right now.</p>
            <Link href="/jobs" className="mt-4 inline-block text-[#1D4ED8] font-semibold hover:underline">
              Browse all AI &amp; data jobs →
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

      {/* Other categories pill cloud */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
          Explore Other Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((cat) => (
            <Link
              key={cat}
              href={`/job-categories/${slugify(cat)}`}
              className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8] transition"
            >
              {cat}
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
