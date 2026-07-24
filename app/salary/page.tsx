import type { Metadata } from 'next';
import Link from 'next/link';
import {
  salaryCategories,
  salaryCountries,
  salaryData,
  formatMonthly,
  slugifyCategory,
  slugifyCountry,
} from '@/constants/salary-data';
import SalaryMeta from '@/components/salary/SalaryMeta';
import CollectionStructuredData from '@/components/seo/CollectionStructuredData';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/seo';

const title = 'AI & Data Salaries in Malaysia & Singapore';
const description =
  'What AI, machine learning and data roles pay in Malaysia and Singapore — monthly bands by experience level, built from NodeFlair, Jobstreet, Robert Walters and Michael Page data.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://kerja-ai.com/salary' },
  openGraph: {
    title,
    description,
    url: 'https://kerja-ai.com/salary',
    siteName: 'Kerja AI',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: { card: 'summary_large_image', title, description, images: TWITTER_IMAGES },
};

export default function SalaryIndexPage() {
  return (
    <>
      <CollectionStructuredData
        name={title}
        description="Monthly salary bands for AI, ML and data roles across Malaysia and Singapore."
        path="/salary"
      />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {'AI & Data Salaries in Malaysia & Singapore'}
        </h1>
        <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">
          What these roles actually pay each month, by experience level. Figures come from
          reported-pay datasets and recruiter salary guides — not from job ads on this site.
        </p>

        <div className="mt-10 space-y-4">
          {salaryCategories.map((category) => (
            <article
              key={category}
              className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm transition hover:border-[#1D4ED8]/30 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-gray-900">
                <Link
                  href={`/salary/${slugifyCategory(category)}`}
                  className="hover:text-[#1D4ED8] transition"
                >
                  {category}
                </Link>
              </h2>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {salaryCountries.map((country) => {
                  const overall = salaryData[country][category].overall;
                  return (
                    <Link
                      key={country}
                      href={`/salary/${slugifyCategory(category)}/${slugifyCountry(country)}`}
                      className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 transition hover:border-[#1D4ED8]/30 hover:bg-blue-50/50"
                    >
                      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {country}
                      </span>
                      <span className="mt-0.5 block font-bold text-gray-900">
                        {formatMonthly(overall.min, country)} – {formatMonthly(overall.max, country)}
                        <span className="ml-1 text-xs font-normal text-gray-500">/month</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        {/* Said plainly rather than quietly omitted: a reader looking for a
            category that is missing should learn why, not assume we forgot. */}
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <h2 className="text-sm font-bold text-amber-900">Why only these four roles?</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
            Malaysia and Singapore publish reliable pay data for these four. The other
            categories on Kerja AI — computer vision, NLP, prompt engineering, AI research,
            data annotation and the rest — are still too specialised for local salary surveys,
            and the only figures floating around come from modelled estimates that disagree
            wildly with observed pay. We would rather publish nothing than publish a number
            you might negotiate against.
          </p>
        </section>

        <SalaryMeta countries={[...salaryCountries]} />
      </main>
    </>
  );
}
