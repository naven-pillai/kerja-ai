import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  salaryRoles,
  salaryCountries,
  salaryData,
  roleFromSlug,
  countryFromSlug,
  slugifyCountry,
  formatMonthly,
  currencyByCountry,
} from '@/constants/salary-data';
import SalaryTable from '@/components/salary/SalaryTable';
import SalaryMeta from '@/components/salary/SalaryMeta';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/seo';

export const revalidate = 86400;

export function generateStaticParams() {
  return salaryRoles.flatMap((r) =>
    salaryCountries.map((country) => ({
      role: r.slug,
      country: slugifyCountry(country),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string; country: string }>;
}): Promise<Metadata> {
  const { role: rSlug, country: nSlug } = await params;
  const role = roleFromSlug(rSlug);
  const country = countryFromSlug(nSlug);
  if (!role || !country) return { title: 'Salary Not Found' };

  const bands = salaryData[country][role.slug];
  const title = `${role.name} Salary in ${country}`;
  const description = `${role.name} pay in ${country}: ${formatMonthly(bands.overall.min, country)}–${formatMonthly(bands.overall.max, country)} a month, broken down by entry, mid and senior level.`;
  const url = `https://kerja-ai.com/salary/${rSlug}/${nSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Kerja AI', type: 'website', images: OG_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: TWITTER_IMAGES },
  };
}

export default async function SalaryRoleCountryPage({
  params,
}: {
  params: Promise<{ role: string; country: string }>;
}) {
  const { role: rSlug, country: nSlug } = await params;
  const role = roleFromSlug(rSlug);
  const country = countryFromSlug(nSlug);
  if (!role || !country) notFound();

  const bands = salaryData[country][role.slug];
  const other = salaryCountries.find((c) => c !== country)!;
  const { code } = currencyByCountry[country];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Kerja AI', item: 'https://kerja-ai.com' },
        { '@type': 'ListItem', position: 2, name: 'Salaries', item: 'https://kerja-ai.com/salary' },
        {
          '@type': 'ListItem',
          position: 3,
          name: role.name,
          item: `https://kerja-ai.com/salary/${rSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: country,
          item: `https://kerja-ai.com/salary/${rSlug}/${nSlug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'OccupationAggregationByEmployer',
      name: role.name,
      description: `${role.name} salary benchmarks in ${country}.`,
      occupationLocation: [{ '@type': 'Country', name: country }],
      estimatedSalary: {
        '@type': 'MonetaryAmountDistribution',
        name: 'base',
        currency: code,
        duration: 'P1M',
        percentile10: bands.entry.min,
        median: Math.round((bands.mid.min + bands.mid.max) / 2),
        percentile90: bands.senior.max,
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500"
        >
          <Link href="/salary" className="hover:text-[#1D4ED8]">
            Salaries
          </Link>
          <span>/</span>
          <Link href={`/salary/${rSlug}`} className="hover:text-[#1D4ED8]">
            {role.name}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{country}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {`${role.name} Salary in ${country}`}
        </h1>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1D4ED8]">Market range</p>
          <p className="mt-1.5 text-2xl md:text-3xl font-bold text-gray-900">
            {formatMonthly(bands.overall.min, country)} –{' '}
            {formatMonthly(bands.overall.max, country)}
            <span className="ml-1.5 text-base font-normal text-gray-500">per month</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {formatMonthly(bands.overall.min * 12, country)} –{' '}
            {formatMonthly(bands.overall.max * 12, country)} a year
          </p>
        </div>

        <h2 className="mt-10 mb-3 text-xl font-bold text-gray-900">By experience level</h2>
        <SalaryTable bands={bands} country={country} />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/salary/${rSlug}/${slugifyCountry(other)}`}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8]"
          >
            {`Compare with ${other} →`}
          </Link>
          <Link
            href={`/job-categories/${role.jobCategorySlug}`}
            className="rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E40AF]"
          >
            {`Browse ${role.jobCategory} jobs`}
          </Link>
        </div>

        <SalaryMeta countries={[country]} />
      </main>
    </>
  );
}
