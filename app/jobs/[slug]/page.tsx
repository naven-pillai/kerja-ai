import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { after } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import dayjs from 'dayjs';
import { formatJobLocation } from '@/lib/formatLocation';

// Components
import JobHeader from '@/components/job/JobHeader';
import JobMetaBox from '@/components/job/JobMeta';
import CompanyCard from '@/components/job/CompanyCard';
import SocialShare from '@/components/job/SocialShare';
import JobDescription from '@/components/job/JobDescription';
import RelatedJobs from '@/components/job/RelatedJobs';
import ScrollToTopOnRouteChange from '@/components/common/ScrollToTopOnRouteChange';
import JobPostingStructuredData from '@/components/seo/JobPostingStructuredData';
import NewsletterSidebar from '@/components/common/NewsletterSidebar';
import JobSummarizeBar from '@/components/summarize/JobSummarizeBar';

type PageParams = { slug: string };

/* ------------------------------------------------
   Fetch — shared by generateMetadata and the page.

   Both run in the same request, so React's cache() collapses them into a single
   round-trip. Previously each issued its own query for the same slug.

   Use the service-role client so archived (expired) jobs are still fetchable for the
   expired-job banner — the anon client won't return status='archived' rows.
------------------------------------------------ */
const getJob = cache(async (slug: string) => {
  const { data, error } = await getSupabaseAdmin()
    .from('jobs')
    .select(`
      id, title, slug, description, created_at, apply_url,
      expires_at, goes_public_at, status,
      seo_title, seo_description,
      job_type, job_category, job_location, city, remote_type, tags,
      min_salary, max_salary, currency,
      company:companies(name, slug, logo_url)
    `)
    .eq('slug', slug)
    .maybeSingle();

  return { job: data, error };
});

/* ------------------------------------------------
   Metadata
------------------------------------------------ */
export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;

  const { job } = await getJob(slug);

  if (!job) return {};

  const isExpired =
    job.status === 'archived' ||
    (job.expires_at != null && dayjs().isAfter(dayjs(job.expires_at)));

  const companyName = job.company?.name ?? 'a company hiring in Malaysia or Singapore';
  const country = Array.isArray(job.job_location) ? job.job_location[0] : job.job_location;
  const where = formatJobLocation(country, job.city);

  // "<job title> <company> - Kerja AI". The layout appends the 11-char suffix,
  // leaving 49 for the page title — a long job title plus a long company name
  // overruns that, so degrade gracefully:
  //   job + company  ->  job alone  ->  truncated job
  const ogTitle = (() => {
    // seo_title is the SEO-tuned job NAME (it duplicates `title` on most rows,
    // but differs on some) — it is not a full title override, so the company is
    // still appended. Some titles carry stray whitespace, hence the trim.
    const jobName = (job.seo_title?.trim() || job.title).trim();
    const company = job.company?.name?.trim();

    // "<job> [<company>]" — the brackets separate the two, which a bare space
    // ran together ("Applied AI Engineer Bjak").
    const withCompany = company ? `${jobName} [${company}]` : jobName;
    if (withCompany.length <= 49) return withCompany;
    if (jobName.length <= 49) return jobName;
    return `${jobName.slice(0, 48).trimEnd()}…`;
  })();

  // Google wants roughly 120-160 chars. Admin/AI-written seo_description is
  // often far shorter than that (Bjak's is 73), which ships a thin snippet and
  // invites Google to rewrite it. Top it up from the job's own fields rather
  // than trusting whatever is in the column.

  const ogDescription = (() => {
    const base = job.seo_description?.trim();
    if (base && base.length >= 120) return base.length > 158 ? `${base.slice(0, 155).trimEnd()}…` : base;

    const context =
      `${job.title} at ${companyName}${where ? ` in ${where}` : ''}. ` +
      `Read the full brief, salary context and how to apply on Kerja AI — the job board built only for AI and data roles.`;
    const text = base ? `${base} ${context}` : context;
    return text.length > 158 ? `${text.slice(0, 155).trimEnd()}…` : text;
  })();
  const ogImage = job.company?.logo_url ?? 'https://kerja-ai.com/default-og-image.png';
  const jobUrl = `https://kerja-ai.com/jobs/${slug}`;

  return {
    title: isExpired ? `[Expired] ${ogTitle}` : ogTitle,
    description: ogDescription,
    alternates: { canonical: jobUrl },
    // Tell search engines to drop expired job pages — no 404 penalty
    ...(isExpired && { robots: { index: false, follow: false } }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: jobUrl,
      images: [{ url: ogImage, width: 800, height: 400 }],
    },
    twitter: {
      card: 'summary',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

/* ------------------------------------------------
   Page
------------------------------------------------ */
export default async function JobSlugPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;

  // Deduped against generateMetadata's call above — one query, not two.
  const { job, error } = await getJob(slug);

  if (error || !job) return notFound();

  const now = dayjs();
  const isExpired =
    job.status === 'archived' ||
    (job.expires_at != null && now.isAfter(dayjs(job.expires_at)));

  const isPublic =
    job.status === 'published' &&
    job.goes_public_at != null &&
    now.isAfter(dayjs(job.goes_public_at));

  // ❌ Hard block — drafts, pending, and anything that isn't published/archived
  if (job.status !== 'published' && job.status !== 'archived') return notFound();

  // Not yet public (goes_public_at in the future) — hide until the time arrives
  if (!isExpired && !isPublic) return notFound();

  // Track view — fires after response, doesn't slow down page render
  after(async () => {
    await getSupabaseAdmin().from('job_events').insert({ job_id: job.id, event_type: 'view' })
  })

  /* ------------------------------------------------
     Normalised values (schema-safe)
  ------------------------------------------------ */
  const companyName = job.company?.name ?? 'Unknown';
  const companySlug = job.company?.slug ?? 'unknown';
  const companyLogo = job.company?.logo_url ?? 'https://kerja-ai.com/default-logo.png';
  const jobUrl = `https://kerja-ai.com/jobs/${slug}`;

  // ✅ MUST be string for schema
  const datePosted = job.created_at ?? new Date().toISOString();
  const validThrough =
    job.expires_at ??
    job.created_at ??
    new Date().toISOString();

  const jobType = Array.isArray(job.job_type) ? job.job_type[0] : job.job_type;
  const jobCategory = Array.isArray(job.job_category) ? job.job_category[0] : job.job_category;
  const jobLocationArray = job.job_location ?? [];
  const jobLocation = Array.isArray(jobLocationArray) ? jobLocationArray.join(', ') : jobLocationArray;

  const hasSalary =
    (typeof job.min_salary === 'number' && job.min_salary > 0) ||
    (typeof job.max_salary === 'number' && job.max_salary > 0);

  return (
    <>
      <ScrollToTopOnRouteChange />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://kerja-ai.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'AI & Data Jobs',
                item: 'https://kerja-ai.com/jobs',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: job.title,
                item: jobUrl,
              },
            ],
          }),
        }}
      />

      {!isExpired && (
      <JobPostingStructuredData
        title={job.title}
        description={job.description}
        datePosted={datePosted}        // ✅ string
        validThrough={validThrough}    // ✅ string
        employmentType={jobType}
        hiringOrganization={{
          name: companyName,
          logo: companyLogo,
          url: `https://kerja-ai.com/companies/${companySlug}`,
        }}
        jobLocation={jobLocationArray}
        city={job.city}
        remoteType={job.remote_type}
        applyUrl={job.apply_url ?? ''}
        salary={
          hasSalary && job.currency
            ? {
                min: job.min_salary ?? 0,
                max: job.max_salary ?? 0,
                currency: job.currency,
              }
            : undefined
        }
      />
      )}

      {isExpired && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-amber-500 text-lg">⚠</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">This role has closed</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  The team is no longer taking applications. Similar AI and data roles are open below.
                </p>
              </div>
            </div>
            <Link
              href="/jobs"
              className="shrink-0 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition"
            >
              Browse open jobs →
            </Link>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main */}
        <div className="space-y-10 lg:col-span-3">
          <JobHeader title={job.title} />
          <JobSummarizeBar slug={job.slug} title={job.title} />

          <JobDescription
            description={job.description}
            applyUrl={job.apply_url ?? ''}
            expiresAt={job.expires_at ?? undefined}
            jobTitle={job.title}
            slug={job.slug}
          />
        </div>

        {/* Sidebar mobile */}
        <div className="space-y-6 lg:hidden">
          <CompanyCard companyName={companyName} logoUrl={companyLogo} companySlug={companySlug} />
          <JobMetaBox
            job={{
              postedOn: job.created_at || undefined,
              applyBefore: job.expires_at || undefined,
              jobType,
              remoteType: job.remote_type,
              category: jobCategory,
              location: jobLocation,
              city: job.city,
              tags: job.tags ?? [],
              applyUrl: job.apply_url ?? '',
              title: job.title,
              slug: job.slug,
              minSalary: job.min_salary ?? null,
              maxSalary: job.max_salary ?? null,
              currency: job.currency ?? null,
            }}
          />
          <SocialShare job={{ title: job.title, slug: job.slug, companyName }} />
          <NewsletterSidebar />
        </div>

        {/* Sidebar desktop */}
        <aside className="hidden lg:flex lg:flex-col space-y-6">
          <CompanyCard companyName={companyName} logoUrl={companyLogo} companySlug={companySlug} />
          <JobMetaBox
            job={{
              postedOn: job.created_at || undefined,
              applyBefore: job.expires_at || undefined,
              jobType,
              remoteType: job.remote_type,
              category: jobCategory,
              location: jobLocation,
              city: job.city,
              tags: job.tags ?? [],
              applyUrl: job.apply_url ?? '',
              title: job.title,
              slug: job.slug,
              minSalary: job.min_salary ?? null,
              maxSalary: job.max_salary ?? null,
              currency: job.currency ?? null,
            }}
          />
          <SocialShare job={{ title: job.title, slug: job.slug, companyName }} />
          <NewsletterSidebar />
        </aside>

        {/* Related */}
        <div className="lg:col-span-3">
          <RelatedJobs category={jobCategory} tags={job.tags ?? []} excludeJobId={job.id} />
        </div>
      </section>
    </>
  );
}
