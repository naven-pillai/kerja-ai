// components/seo/TaxonomyMetadata.tsx
import type { Metadata } from 'next';

type TaxonomyType = 'category' | 'type' | 'location';

type Props = {
  slug: string;
  type: TaxonomyType;
  title: string;
  description: string;

  canonical?: string;

  // ✅ allow overrides (fixes your TS error)
  openGraph?: Metadata['openGraph'];
  twitter?: Metadata['twitter'];
};

function getTaxonomyPath(type: TaxonomyType) {
  if (type === 'location') return 'job-location';
  if (type === 'category') return 'job-category';
  return 'job-type';
}

export function generateTaxonomyMetadata({
  slug,
  type,
  title,
  description,
  canonical,
  openGraph,
  twitter,
}: Props): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';
  const path = getTaxonomyPath(type);
  const url = canonical ?? `${siteUrl}/${path}/${slug}`;

  // sensible defaults if you don't pass overrides
  const defaultOg: Metadata['openGraph'] = {
    title,
    description,
    url,
    type: 'website',
  };

  const defaultTwitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
  };

  return {
    title: `${title} | Kerja AI`,
    description,
    alternates: { canonical: url },
    openGraph: openGraph ?? defaultOg,
    twitter: twitter ?? defaultTwitter,
  };
}
