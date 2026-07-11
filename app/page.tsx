import type { Metadata } from 'next';
import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import GridHighlights from '@/components/home/GridHighlights';
import FeaturedJobsSection from '@/components/home/FeaturedJobsSection';
import LatestBlogSection from '@/components/home/LatestBlogSection';
import NewsletterCTA from '@/components/common/NewsletterCTA';
import HomeScrollFix from '@/components/home/HomeScrollFix';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kerja AI: Remote & Hybrid Jobs in APAC',
  description: 'Discover verified remote and hybrid jobs across Malaysia, Singapore, Philippines, Indonesia and the wider APAC region. Every role is labelled 100% Remote or Hybrid. New roles added daily.',
  alternates: {
    canonical: 'https://kerja-ai.com',
  },
  openGraph: {
    title: 'Kerja AI: Remote & Hybrid Jobs in APAC',
    description: 'Discover verified remote and hybrid jobs across Malaysia, Singapore, Philippines, Indonesia and the wider APAC region. Every role is labelled 100% Remote or Hybrid.',
    url: 'https://kerja-ai.com',
    siteName: 'Kerja-AI',
    type: 'website',
    images: [
      {
        url: 'https://kerja-ai.com/default-og-image-1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Kerja-AI — Remote & Hybrid Jobs in APAC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerja AI: Remote & Hybrid Jobs in APAC',
    description: 'Discover verified remote and hybrid jobs across Malaysia, Singapore, Philippines, Indonesia and the wider APAC region.',
    images: ['https://kerja-ai.com/default-og-image-1200x630.png'],
  },
};

function FeaturedJobsSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="h-7 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-80 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-gray-200 animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestBlogSkeleton() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="h-9 w-56 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const homeStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kerja AI',
    url: 'https://kerja-ai.com',
    logo: 'https://kerja-ai.com/logo.png',
    description:
      'Curated remote and hybrid job board for APAC. Verified roles across Malaysia, Singapore, Indonesia, Philippines, and the wider APAC region, each labelled 100% Remote or Hybrid.',
    sameAs: [
      'https://www.linkedin.com/company/kerjaai',
      'https://x.com/KerjaAI_',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kerja AI',
    url: 'https://kerja-ai.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kerja-ai.com/jobs?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      <HomeScrollFix />
      <HeroSection />
      <GridHighlights />
      <Suspense fallback={<FeaturedJobsSkeleton />}>
        <FeaturedJobsSection />
      </Suspense>
      <Suspense fallback={<LatestBlogSkeleton />}>
        <LatestBlogSection />
      </Suspense>
      <NewsletterCTA />
    </main>
  );
}
