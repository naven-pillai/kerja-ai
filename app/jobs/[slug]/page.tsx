import { notFound } from 'next/navigation';
import Link from 'next/link';
import { after } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import dayjs from 'dayjs';

// Components
import JobHeader from '@/components/job/JobHeader';
import JobMetaBox from '@/components/job/JobMeta';
import CompanyCard from '@/components/job/CompanyCard';
import SocialShare from '@/components/job/SocialShare';
import JobDescription from '@/components/job/JobDescription';
import RelatedJobs from '@/components/job/RelatedJobs';
import OpenGraphMeta from '@/components/seo/OpenGraphMeta';
import ScrollToTopOnRouteChange from '@/components/common/ScrollToTopOnRouteChange';
import JobPostingStructuredData from '@/components/seo/JobPostingStructuredData';
import NewsletterSidebar from '@/components/common/NewsletterSidebar';
import JobSummarizeBar from '@/components/summarize/JobSummarizeBar';

type PageParams = { slug: string };

/* ------------------------------------------------
   Metadata
------------------------------------------------ */
export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;

  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('slug, seo_title, seo_description, expires_at, status, company:companies(name, logo_url)')
    .eq('slug', slug)
    .maybeSingle();

  if (!job) return {};

  const isExpired =
    job.status === 'archived' ||
    (job.expires_at != null && dayjs().isAfter(dayjs(job.expires_at)));

  const ogTitle = job.seo_title ?? `Remote Job Opening | Kerja-AI`;
  const ogDescription =
    job.seo_description ??
    `Explore remote job listings in Southeast Asia. Find verified, flexible, and high-quality remote opportunities at Kerja-AI.`;
  const ogImage = job.company?.logo_url ?? 'https://kerja-ai.com/default-og-image.png';
  const jobUrl = `https://kerja-ai.com/jobs/${slug}`;

  return {
    title: isExpired ? `[Expired] ${ogTitle}` : ogTitle,
    description: ogDescription,
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

  // Use supabaseAdmin so archived (expired) jobs are still fetchable for the
  // expired-job banner — the anon client won't return status='archived' rows.
  const { data: job, error } = await supabaseAdmin
    .from('jobs')
    .select(`
      id, title, slug, description, created_at, apply_url,
      expires_at, goes_public_at, status,
      seo_title, seo_description,
      job_type, job_category, job_location, remote_type, tags,
      min_salary, max_salary, currency,
      company:companies(name, slug, logo_url)
    `)
    .eq('slug', slug)
    .maybeSingle();

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
    await supabaseAdmin.from('job_events').insert({ job_id: job.id, event_type: 'view' })
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

      <OpenGraphMeta
        title={job.seo_title ?? `${job.title} – Remote Job | Kerja-AI`}
        description={
          job.seo_description ??
          `Apply for the ${job.title} position at ${companyName}. Explore verified remote jobs across Asia on Kerja-AI.`
        }
        url={jobUrl}
        image={companyLogo}
        twitterCardType="summary"
      />

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
                name: 'Remote Jobs',
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
                <p className="text-sm font-semibold text-amber-900">This job listing has expired</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Applications are no longer being accepted. Browse similar open roles below.
                </p>
              </div>
            </div>
            <Link
              href="/jobs"
              className="shrink-0 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
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
