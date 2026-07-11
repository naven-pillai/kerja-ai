import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dayjs from 'dayjs';
import Link from 'next/link';
import { createSupabasePublicClient } from '@/lib/supabase-public';
import JobCard from '@/components/common/JobCard';
import { JobWithCompany } from '@/types/custom';
import { jobTypes, jobCategories, jobLocations } from '@/constants/job-filters';
import { slugify } from '@/lib/slugify';
import { slugify as catSlugify } from '@/utils/slugify';

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export async function generateStaticParams() {
  return jobTypes.map((t) => ({ slug: slugify(t) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = jobTypes.find((t) => slugify(t) === slug);
  if (!name) return {};

  const title = `Remote & Hybrid ${name} Jobs`;
  const description = `Find remote and hybrid ${name.toLowerCase()} opportunities across Southeast Asia and APAC. Browse verified listings for all experience levels.`;
  const url = `${BASE_URL}/job-types/${slug}`;

  return {
    title: `${title} | Kerja-AI`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function JobTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = jobTypes.find((t) => slugify(t) === slug);
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
    .contains('job_type', [name])
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return notFound();

  const jobs = ((data ?? []) as JobWithCompany[]).filter(
    (job) => !job.expires_at || dayjs().isBefore(dayjs(job.expires_at))
  );

  // Other types for pill cloud
  const otherTypes = jobTypes.filter((t) => t !== name);

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

  const topLocations = Array.from(
    jobs
      .flatMap((j) => j.job_location ?? [])
      .reduce((acc, loc) => acc.set(loc, (acc.get(loc) ?? 0) + 1), new Map<string, number>())
      .entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([loc]) => loc)
    .filter((l) => jobLocations.includes(l));

  const uniqueCompanies = Array.from(
    new Map(
      jobs.filter((j) => j.company?.slug).map((j) => [j.company!.slug, j.company!.name])
    ).entries()
  ).slice(0, 5);

  const nameLower = name.toLowerCase();

  // Job-type specific context
  const typeContext: Record<string, { what: string; hours: string; benefit: string }> = {
    'Full-Time': {
      what: 'a full-time commitment, typically 40 hours per week',
      hours: '40 hours per week',
      benefit: 'stable income, benefits, and career progression opportunities',
    },
    'Part-Time': {
      what: 'a reduced schedule, typically 20–30 hours per week',
      hours: '20–30 hours per week',
      benefit: 'flexibility to balance other commitments alongside paid work',
    },
    Contract: {
      what: 'a fixed-term engagement with a defined scope and end date',
      hours: 'variable, defined in the contract',
      benefit: 'higher hourly rates and the ability to work across multiple clients',
    },
    Freelance: {
      what: 'project-based or ongoing work with full schedule independence',
      hours: 'entirely flexible — you set your own schedule',
      benefit: 'maximum flexibility and the ability to choose your own projects',
    },
    Internship: {
      what: 'a structured learning experience for students or recent graduates',
      hours: 'typically 20–40 hours per week for a fixed term',
      benefit: 'hands-on experience, mentorship, and a foot in the door at top companies',
    },
  };

  const ctx = typeContext[name] ?? {
    what: `a ${nameLower} engagement`,
    hours: 'defined in the listing',
    benefit: 'flexibility and competitive compensation',
  };

  // FAQs
  const faqs = [
    {
      q: `What is a remote ${name} job?`,
      a: `A remote ${name} job involves ${ctx.what}. The key difference from on-site roles is that all work is done remotely — typically from home or a co-working space. Listings on Kerja-AI include ${nameLower} roles across APAC and globally.`,
    },
    {
      q: `How many hours does a remote ${nameLower} role involve?`,
      a: `Remote ${nameLower} jobs on Kerja-AI typically require ${ctx.hours}. Always review the specific listing for exact expectations, as hours can vary by employer and project scope.`,
    },
    {
      q: `What are the benefits of remote ${nameLower} work?`,
      a: `Remote ${nameLower} roles offer ${ctx.benefit}. Combined with the flexibility of working from anywhere in APAC, they're increasingly popular among professionals across Southeast Asia.`,
    },
    {
      q: `How do I find remote ${nameLower} jobs in APAC on Kerja-AI?`,
      a: `Browse the listings on this page — all are verified remote or hybrid ${nameLower} positions. You can also filter by location or category using our jobs page, or create a free talent profile so employers in APAC can find you directly.`,
    },
  ];

  // Schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Job Types', item: `${BASE_URL}/job-types` },
      { '@type': 'ListItem', position: 3, name: name, item: `${BASE_URL}/job-types/${slug}` },
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
            <Link href="/job-types" className="hover:text-gray-600 transition">Job Types</Link>
            <span>/</span>
            <span className="text-gray-600">{name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Remote &amp; Hybrid <span className="text-[#1D4ED8]">{name}</span> Jobs
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl leading-relaxed">
            {jobs.length > 0
              ? `${jobs.length} verified remote and hybrid ${nameLower} job${jobs.length === 1 ? '' : 's'} across Southeast Asia and APAC. All listings are reviewed before going live.`
              : `Remote ${nameLower} opportunities across Southeast Asia and APAC. New roles are posted regularly — check back soon.`}
          </p>

          {jobs.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">
              <span>
                <span className="font-bold text-gray-700 text-base">{jobs.length}</span> open roles
              </span>
              {topLocations.length > 0 && (
                <span>
                  <span className="font-bold text-gray-700 text-base">{topLocations[0]}</span> top location
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
            <p className="text-gray-500">No remote {nameLower} jobs found right now.</p>
            <Link
              href="/jobs"
              className="mt-4 inline-block text-[#1D4ED8] font-semibold hover:underline"
            >
              Browse all remote & hybrid jobs →
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

      {/* Other job types pill cloud */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          Explore Other Job Types
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherTypes.map((type) => (
            <Link
              key={type}
              href={`/job-types/${slugify(type)}`}
              className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8] transition"
            >
              {type}
            </Link>
          ))}
        </div>
      </div>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
