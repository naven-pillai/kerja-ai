import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  salaryRoles,
  salaryCountries,
  salaryData,
  roleFromSlug,
  slugifyCountry,
  formatMonthly,
} from '@/constants/salary-data';
import SalaryTable from '@/components/salary/SalaryTable';
import SalaryMeta from '@/components/salary/SalaryMeta';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/seo';

export const revalidate = 86400;

export function generateStaticParams() {
  return salaryRoles.map((r) => ({ role: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role: slug } = await params;
  const role = roleFromSlug(slug);
  if (!role) return { title: 'Salary Not Found' };

  const title = `${role.name} Salary in Malaysia & Singapore`;
  const description = `What a ${role.name.toLowerCase()} earns each month in Malaysia and Singapore, by experience level. Built from NodeFlair, Jobstreet, Robert Walters and Michael Page data.`;
  const url = `https://kerja-ai.com/salary/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Kerja AI', type: 'website', images: OG_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: TWITTER_IMAGES },
  };
}

export default async function SalaryRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: slug } = await params;
  const role = roleFromSlug(slug);
  if (!role) notFound();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kerja AI', item: 'https://kerja-ai.com' },
      { '@type': 'ListItem', position: 2, name: 'Salaries', item: 'https://kerja-ai.com/salary' },
      {
        '@type': 'ListItem',
        position: 3,
        name: role.name,
        item: `https://kerja-ai.com/salary/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/salary" className="hover:text-[#1D4ED8]">
            Salaries
          </Link>
          <span>/</span>
          <span className="text-gray-700">{role.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {`${role.name} Salary in Malaysia & Singapore`}
        </h1>
        <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">
          {`Gross monthly pay for a ${role.name.toLowerCase()}, by experience level, in both markets.`}
        </p>

        <div className="mt-10 space-y-10">
          {salaryCountries.map((country) => {
            const bands = salaryData[country][role.slug];
            return (
              <section key={country}>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{country}</h2>
                  <Link
                    href={`/salary/${slug}/${slugifyCountry(country)}`}
                    className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                  >
                    {`Full ${country} breakdown →`}
                  </Link>
                </div>

                <p className="mb-3 text-sm text-gray-600">
                  Market range{' '}
                  <span className="font-semibold text-gray-900">
                    {formatMonthly(bands.overall.min, country)} –{' '}
                    {formatMonthly(bands.overall.max, country)}
                  </span>{' '}
                  per month.
                </p>

                <SalaryTable bands={bands} country={country} />
              </section>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-600">
            Hiring or job hunting in this field?{' '}
            <Link href="/jobs" className="font-semibold text-[#1D4ED8] hover:text-[#1E40AF]">
              {`Browse open ${role.jobCategory.toLowerCase()} roles`}
            </Link>
            .
          </p>
        </div>

        <SalaryMeta countries={[...salaryCountries]} />
      </main>
    </>
  );
}
