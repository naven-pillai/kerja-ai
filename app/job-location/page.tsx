import type { Metadata } from 'next';
import Link from 'next/link';
import { jobLocations } from '@/constants/job-filters';
import { slugify } from '@/lib/slugify';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export const metadata: Metadata = {
  title: 'Remote & Hybrid Jobs by Location | Southeast Asia & APAC | Kerja-AI',
  description:
    'Browse remote and hybrid job opportunities by country across Southeast Asia and APAC — Malaysia, Singapore, Philippines, Indonesia, and more.',
  alternates: { canonical: `${BASE_URL}/job-location` },
  openGraph: {
    title: 'Remote & Hybrid Jobs by Location | Kerja-AI',
    description: 'Find remote and hybrid jobs in Malaysia, Singapore, Philippines, Indonesia, and across the APAC region.',
    url: `${BASE_URL}/job-location`,
    type: 'website',
  },
};

const locationDescriptions: Record<string, string> = {
  Malaysia: 'Tech, marketing, and finance roles for candidates based in Malaysia.',
  Singapore: 'High-paying remote roles open to Singapore-based professionals.',
  Philippines: 'Customer support, design, and software jobs for Filipino talent.',
  Indonesia: 'Growing remote opportunities for candidates across Indonesia.',
  Thailand: 'Remote roles open to professionals based in Thailand.',
  Vietnam: 'Tech and marketing jobs for candidates in Vietnam.',
  'Hong Kong': 'Finance, legal, and tech roles for Hong Kong professionals.',
  Taiwan: 'Remote positions open to talent based in Taiwan.',
  APAC: 'Roles open to candidates anywhere across the Asia-Pacific region.',
  Worldwide: 'Fully location-agnostic remote roles open globally.',
};

export default function LocationIndexPage() {
  return (
    <main className="bg-[#f8f7f4] min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Locations</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Remote &amp; Hybrid Jobs by <span className="text-[#1D4ED8]">Location</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Browse verified remote and hybrid jobs filtered by country or region across Southeast Asia and the wider APAC market.
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
              <p className="text-xs text-gray-400 leading-relaxed">
                {locationDescriptions[loc] ?? `Remote jobs open to candidates in ${loc}.`}
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
