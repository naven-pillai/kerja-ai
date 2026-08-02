import { createSupabaseServerClient } from '@/lib/supabase-server';
import NewsletterCard from '@/components/common/NewsletterCard';
import CompaniesDirectoryClient from '@/components/companies/CompaniesDirectoryClient';
import CompaniesSubNav from '@/components/companies/CompaniesSubNav';
import { hqCountry, type CompanyCountry } from '@/lib/companyLocation';

export const dynamic = 'force-dynamic';

interface Job {
  id: string;
  status: string | null;
  expires_at: string | null;
}

interface CompanyRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  tagline: string | null;
  industry: string | null;
  company_size: string | null;
  hq_location: string | null;
  remote_policy: string | null;
  jobs: Job[];
}

export type CompanyForDirectory = {
  id: string;
  name: string;
  logoUrl: string;
  companySlug: string;
  isHiring: boolean;
  jobCount: number;
  tagline: string | null;
  industry: string | null;
  company_size: string | null;
  hq_location: string | null;
  remote_policy: string | null;
};

export default async function RemoteCompaniesPage({
  country,
}: {
  /** When set, the page shows only companies in this market. */
  country?: CompanyCountry;
} = {}) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('companies')
    .select(
      `
      id,
      name,
      slug,
      logo_url,
      tagline,
      industry,
      company_size,
      hq_location,
      remote_policy,
      jobs (
        id,
        status,
        expires_at
      )
    `
    )
    .order('name', { ascending: true });

  if (error || !data) {
    console.error('Error fetching companies:', error?.message);
    return (
      <div className="text-center text-red-500 py-16">
        Failed to load companies.
      </div>
    );
  }

  const now = new Date();

  const companies: CompanyForDirectory[] = (data as CompanyRow[]).map((company) => {
    const activeJobs = (company.jobs ?? []).filter((job) => {
      const notExpired = !job.expires_at || new Date(job.expires_at) > now;
      return job.status === 'published' && notExpired;
    });

    return {
      id: company.id,
      name: company.name,
      logoUrl: company.logo_url || '/default-company-logo.png',
      companySlug: company.slug,
      jobCount: activeJobs.length,
      isHiring: activeJobs.length > 0,
      tagline: company.tagline,
      industry: company.industry,
      company_size: company.company_size,
      hq_location: company.hq_location,
      remote_policy: company.remote_policy,
    };
  });

  // Country pages show only companies in that market. Filtering here rather
  // than in the client keeps the stats and the list in agreement.
  const visibleCompanies = country
    ? companies.filter((c) => hqCountry(c.hq_location) === country)
    : companies;

  const hiringCount = visibleCompanies.filter((c) => c.isHiring).length;
  const totalJobs = visibleCompanies.reduce((sum, c) => sum + c.jobCount, 0);

  const heading = country
    ? `AI & Data Companies in ${country}`
    : 'Companies hiring AI and data talent in Malaysia and Singapore';
  const subtitle = country
    ? `The teams building AI, ML and data functions in ${country}. Profiles stay up even after a role closes, so you can keep tracking a company you want to work for.`
    : 'The teams building AI, ML and data functions across Malaysia and Singapore, in one place. Profiles stay up even after a role closes, so you can keep tracking a company you want to work for.';

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{subtitle}</p>
        </div>

        <CompaniesSubNav active={country ?? 'all'} />

        {/* Stats banner */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{visibleCompanies.length}</span>
            <span>companies</span>
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-600">{hiringCount}</span>
            <span>actively hiring</span>
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#1D4ED8]">{totalJobs}</span>
            <span>open roles</span>
          </div>
        </div>

        <div className="mb-16">
          <NewsletterCard />
        </div>

        <CompaniesDirectoryClient
          companies={visibleCompanies}
          defaultFilter="all"
          enableSearch
          maxSuggestions={8}
          showLocationFilter={!country}
        />
      </div>
    </section>
  );
}
