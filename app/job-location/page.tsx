import type { Metadata } from 'next';
import Link from 'next/link';
import { jobLocations } from '@/constants/job-filters';
import { slugify } from '@/lib/slugify';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export const metadata: Metadata = {
  title: 'AI & Data Jobs by Location: Malaysia & Singapore | Kerja-AI',
  description:
    'Compare AI, machine learning and data jobs in Malaysia and Singapore — the KL–Singapore corridor — and weigh RM against SGD offers on Kerja-AI.',
  alternates: { canonical: `${BASE_URL}/job-location` },
  openGraph: {
    title: 'AI & Data Jobs by Location | Kerja-AI',
    description: 'AI, machine learning and data jobs in Malaysia and Singapore — compare RM and SGD offers on Kerja-AI.',
    url: `${BASE_URL}/job-location`,
    type: 'website',
  },
};

const locationDescriptions: Record<string, string> = {
  Malaysia: 'AI, ML and data roles for candidates based in Malaysia — RM salaries, KL and beyond.',
  Singapore: 'AI and data roles in Singapore — strong SGD pay, written for Malaysians weighing the move.',
};

export default function LocationIndexPage() {
  return (
    <main className="bg-[#f8f7f4] min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Locations</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            AI &amp; Data Jobs by <span className="text-[#1D4ED8]">Location</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Two markets, one corridor. Browse AI, machine learning and data roles in Malaysia and Singapore, and compare what each pays.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobLocations.map((loc) => (
            <Link
              key={loc}
              href={`/job-location/${slugify(loc)}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-[#1D4ED8]/30 hover:shadow-sm transition"
            >
              <h2 className="font-bold text-gray-900 group-hover:text-[#1D4ED8] transition mb-1">
                {loc}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                {locationDescriptions[loc] ?? `AI and data roles open to candidates in ${loc}.`}
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
              { '@type': 'ListItem', position: 2, name: 'Job Locations', item: `${BASE_URL}/job-location` },
            ],
          }),
        }}
      />
    </main>
  );
}
