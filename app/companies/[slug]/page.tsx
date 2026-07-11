import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { ElementType } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { JobWithCompany } from '@/types/custom';
import JobCard from '@/components/common/JobCard';
import CompanyLogo from '@/components/common/CompanyLogo';
import CompanyCard from '@/components/companies/CompanyCard';
import { appendUTM } from '@/utils/appendUTM';
import {
  Globe,
  MapPin, Users, Briefcase, Calendar, ExternalLink, Star, ChevronRight,
} from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

type PageParams = { slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: company } = await supabase
    .from('companies')
    .select('name, tagline, description')
    .eq('slug', slug)
    .maybeSingle();

  if (!company) {
    return {
      title: 'Company Not Found | Kerja-AI',
      description: 'Sorry, this remote company was not found on Kerja-AI.',
    };
  }

  const description =
    company.description?.slice(0, 160) ??
    company.tagline ??
    `Discover remote job opportunities from ${company.name} on Kerja-AI.com.`;

  return {
    title: `${company.name} Remote Jobs | Kerja-AI`,
    description,
  };
}

const COMPANY_SELECT = `
  id, name, slug, logo_url, website, tagline, description,
  linkedin, twitter, facebook,
  industry, company_size, hq_location, remote_policy,
  year_founded, careers_url, glassdoor_url
` as const;

const SIMILAR_SELECT = `id, name, slug, logo_url, tagline, industry` as const;

export default async function RemoteCompanyPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select(COMPANY_SELECT)
    .eq('slug', slug)
    .maybeSingle();

  if (companyError || !company) {
    console.error('❌ Company fetch error:', companyError);
    return notFound();
  }

  const now = new Date().toISOString();

  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select(`
      id, title, slug, created_at, apply_url,
      job_type, job_category, job_location, remote_type,
      min_salary, max_salary, tags, is_featured, expires_at,
      company:companies(name, slug, logo_url)
    `)
    .eq('company_id', company.id)
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false });

  if (jobsError) console.error('❌ Jobs fetch error:', jobsError);

  const typedJobs = (jobs ?? []) as JobWithCompany[];
  const hasJobs = typedJobs.length > 0;

  const { data: similarRaw } = await supabase
    .from('companies')
    .select(SIMILAR_SELECT)
    .neq('slug', slug)
    .limit(50);

  const similarCompanies = (similarRaw ?? [])
    .filter((c) => (company.industry ? c.industry === company.industry : true))
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      companySlug: c.slug,
      logoUrl: c.logo_url,
      tagline: c.tagline,
      industry: c.industry,
      isHiring: false,
      jobCount: 0,
    }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.website ?? undefined,
    logo: company.logo_url ?? undefined,
    description: company.description ?? company.tagline ?? undefined,
    foundingDate: company.year_founded ?? undefined,
    sameAs: [company.linkedin, company.twitter, company.facebook, company.glassdoor_url].filter(Boolean),
  };

  type MetaItem = { icon: ElementType; label: string; value: string };
  const metaItemsRaw: (MetaItem | null)[] = [
    company.company_size ? { icon: Users, label: 'Company Size', value: `${company.company_size} employees` } : null,
    company.year_founded ? { icon: Calendar, label: 'Founded', value: company.year_founded } : null,
  ];
  const metaItems = metaItemsRaw.filter((item): item is MetaItem => item !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1D4ED8] transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/companies" className="hover:text-[#1D4ED8] transition">Remote Companies</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">{company.name}</span>
        </nav>

        {/* ── Hero ── */}
        <div className="relative rounded-3xl border border-gray-200 bg-white overflow-hidden mb-10">
          {/* Gradient top strip */}
          <div className="h-24 bg-linear-to-r from-orange-50 via-red-50 to-amber-50" />

          <div className="px-6 sm:px-8 pb-8 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
              {/* Logo card */}
              <div className="shrink-0 bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm p-3 w-fit">
                <CompanyLogo src={company.logo_url} alt={company.name} size={96} />
              </div>

              <div className="flex-1 min-w-0 mt-4 sm:mt-0 sm:pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    {company.name}
                  </h1>

                  {hasJobs ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      Actively hiring · {typedJobs.length} {typedJobs.length === 1 ? 'role' : 'roles'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">
                      Not hiring right now
                    </span>
                  )}
                </div>

                {company.tagline && (
                  <p className="text-base text-gray-600 mt-2 max-w-2xl">{company.tagline}</p>
                )}

                {/* Quick facts row */}
                {(company.industry || company.hq_location || company.remote_policy) && (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-gray-500">
                    {company.industry && (
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {company.industry}
                      </span>
                    )}
                    {company.hq_location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {company.hq_location}
                      </span>
                    )}
                    {company.remote_policy && (
                      <span className="inline-flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {company.remote_policy}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-100">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              )}
              {company.careers_url && (
                <a
                  href={appendUTM(company.careers_url, { utm_source: 'kerja-ai', utm_medium: 'referral', utm_campaign: 'company-careers' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Careers Page
                </a>
              )}
              {company.glassdoor_url && (
                <a
                  href={company.glassdoor_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  Glassdoor
                </a>
              )}

              {/* Social icon cluster */}
              {(company.linkedin || company.twitter || company.facebook) && (
                <div className="flex items-center gap-1 ml-auto">
                  {company.linkedin && (
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition"
                    >
                      <FaLinkedinIn className="w-4 h-4" />
                    </a>
                  )}
                  {company.twitter && (
                    <a
                      href={company.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X / Twitter"
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition"
                    >
                      <FaXTwitter className="w-4 h-4" />
                    </a>
                  )}
                  {company.facebook && (
                    <a
                      href={company.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition"
                    >
                      <FaFacebookF className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* ── Main Column ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* About Section */}
            {company.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About {company.name}</h2>
                <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                  {company.description.split('\n\n').filter(Boolean).map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Jobs Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {hasJobs
                  ? `${typedJobs.length} Open Role${typedJobs.length !== 1 ? 's' : ''}`
                  : 'No Open Roles Right Now'}
              </h2>

              {hasJobs ? (
                <div className="space-y-3">
                  {typedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                /* Zero-Job Dead End Fix */
                <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6">
                  <div>
                    <p className="text-gray-700 font-medium">
                      {company.name} doesn&apos;t have any active remote roles listed right now.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Follow us for updates or explore other companies that are hiring.
                    </p>
                  </div>

                  {company.careers_url && (
                    <a
                      href={appendUTM(company.careers_url, { utm_source: 'kerja-ai', utm_medium: 'referral', utm_campaign: 'company-careers' })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c42705] transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View {company.name} Careers Page
                    </a>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Get notified when {company.name} posts a job
                    </p>
                    <Link
                      href="/#newsletter"
                      className="text-sm text-[#1D4ED8] hover:underline"
                    >
                      Subscribe to our remote jobs newsletter →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="mt-10 lg:mt-0 space-y-6">
            {metaItems.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Company Info</h3>
                {metaItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-600">
                Are you from <span className="font-semibold">{company.name}</span>?
              </p>
              <a
                href={`mailto:hello@kerja-ai.com?subject=Claim%20Company%20Profile%20-%20${encodeURIComponent(company.name)}`}
                className="mt-2 inline-block text-sm font-semibold text-[#1D4ED8] hover:underline"
              >
                Claim this profile →
              </a>
            </div>
          </div>
        </div>

        {/* Similar Companies */}
        {similarCompanies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {company.industry ? `More ${company.industry} Companies` : 'More Remote Companies'}
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {similarCompanies.map((c) => (
                <CompanyCard key={c.id} company={c} logoSize={56} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/companies"
                className="text-sm font-semibold text-[#1D4ED8] hover:underline"
              >
                Browse all remote companies →
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
