import type { Metadata } from 'next';
import Link from 'next/link';
import { jobTypes } from '@/constants/job-filters';
import { slugify } from '@/lib/slugify';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export const metadata: Metadata = {
  title: 'AI & Data Jobs by Type in Malaysia & Singapore',
  description:
    'Filter AI, machine learning and data jobs in Malaysia and Singapore by type — full-time, part-time, contract, freelance, or internship.',
  alternates: { canonical: `${BASE_URL}/job-types` },
  openGraph: {
    title: 'AI & Data Jobs by Type - Kerja AI',
    description: 'Full-time, part-time, contract, freelance, and internship AI and data roles in Malaysia and Singapore.',
    url: `${BASE_URL}/job-types`,
    type: 'website',
  },
};

const typeDescriptions: Record<string, string> = {
  'Full-Time': 'Salaried AI and data roles with benefits — usually around 40 hours a week.',
  'Part-Time': 'Reduced-hours AI and data work. Good for study, side income, or caregiving.',
  Contract: 'Fixed-term AI and data engagements with defined scope and higher rates.',
  Freelance: 'Project-based AI and data work — you pick the clients and the schedule.',
  Internship: 'Structured entry roles to break into AI and data as a student or grad.',
};

export default function JobTypesIndexPage() {
  return (
    <main className="bg-[#f8f7f4] min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Job Types</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            AI &amp; Data Jobs by <span className="text-[#1D4ED8]">Type</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Full-time stability, freelance flexibility, or an internship to break into AI — filter AI, machine learning and data roles by how you want to work.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobTypes.map((type) => (
            <Link
              key={type}
              href={`/job-types/${slugify(type)}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-[#1D4ED8]/30 hover:shadow-sm transition"
            >
              <h2 className="font-bold text-gray-900 group-hover:text-[#1D4ED8] transition mb-1">
                {type}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                {typeDescriptions[type] ?? `${type} AI and data roles in Malaysia and Singapore.`}
              </p>
              <span className="mt-3 inline-block text-xs font-semibold text-[#1D4ED8]">
                View jobs →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: 'Job Types', item: `${BASE_URL}/job-types` },
            ],
          }),
        }}
      />
    </main>
  );
}
