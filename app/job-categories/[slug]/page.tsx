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

  const title = `Remote & Hybrid ${name} Jobs`;
  const description = `Browse verified remote and hybrid ${name.toLowerCase()} jobs across Southeast Asia and APAC. New roles added weekly for all experience levels.`;
  const url = `${BASE_URL}/job-categories/${slug}`;

  return {
    title: `${title} | Kerja-AI`,
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
      job_type, job_category, job_location, remote_type,
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
      q: `What does a remote ${name} role typically involve?`,
      a: `Remote ${name} roles cover the same responsibilities as on-site positions — done asynchronously and online. Communication tools like Slack, Notion, and Zoom are standard. Employers on Kerja-AI look for self-directed candidates comfortable working across timezones.`,
    },
    {
      q: `What skills are most in-demand for remote ${nameLower} jobs in APAC?`,
      a:
        topTypes.length > 0
          ? `Remote ${nameLower} jobs in APAC often require strong communication, adaptability, and domain expertise. Most openings on Kerja-AI are ${topTypes.join(', ')} positions. Check individual listings for specific skill requirements.`
          : `Strong communication, domain expertise, and the ability to work independently are the most valued skills for remote ${nameLower} roles. Each listing specifies exact requirements.`,
    },
    {
      q: `Which locations have the most remote ${nameLower} jobs?`,
      a:
        topLocations.length > 0
          ? `Remote ${nameLower} jobs on Kerja-AI are most commonly open to candidates in ${topLocations.slice(0, 3).join(', ')}. Many roles are also open Worldwide or across APAC.`
          : `Remote ${nameLower} jobs on Kerja-AI are open across Malaysia, Singapore, Philippines, and the broader APAC region. Many are also open Worldwide.`,
    },
    {
      q: `How do I apply for remote ${nameLower} jobs on Kerja-AI?`,
      a: `Browse the listings on this page and click any role that matches your profile. Each listing links directly to the employer's application — no account needed. You can also create a free talent profile so employers can find you directly.`,
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
          <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <Link href="/job-categories" className="hover:text-gray-600 transition">Categories</Link>
            <span>/</span>
            <span className="text-gray-600">{name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Remote &amp; Hybrid <span className="text-[#1D4ED8]">{name}</span> Jobs
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl leading-relaxed">
            {jobs.length > 0
              ? `${jobs.length} verified remote and hybrid ${nameLower} job${jobs.length === 1 ? '' : 's'} in Southeast Asia and APAC. Roles range from entry-level to senior across various companies and industries.`
              : `Remote ${nameLower} opportunities across Southeast Asia and APAC. New roles are posted regularly — check back soon.`}
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
            <p className="text-gray-500">No remote {nameLower} jobs found right now.</p>
            <Link href="/jobs" className="mt-4 inline-block text-[#1D4ED8] font-semibold hover:underline">
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

      {/* Other categories pill cloud */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
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
