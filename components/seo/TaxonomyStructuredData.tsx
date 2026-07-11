// components/seo/TaxonomyStructuredData.tsx
'use client';

import { JobWithCompany } from '@/types/custom';

type TaxonomyType = 'category' | 'type' | 'location';

type Props = {
  jobs: JobWithCompany[];

  // ✅ optional (so old usage doesn't break)
  type?: TaxonomyType;
  name?: string;
  slug?: string;
};

export default function TaxonomyStructuredData({ jobs, type, name, slug }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

  // ✅ Always output ItemList (useful for taxonomy listings)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: jobs?.length ?? 0,
    itemListElement: (jobs ?? []).slice(0, 50).map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/jobs/${job.slug}`,
      name: job.title,
    })),
  };

  // ✅ Breadcrumbs only if you pass the extra props
  const shouldRenderBreadcrumbs = Boolean(type && name && slug);

  const breadcrumbLabel =
    type === 'location' ? 'Job Locations' : type === 'category' ? 'Job Categories' : 'Job Types';

  const breadcrumbPath =
    type === 'location' ? '/job-location' : type === 'category' ? '/job-category' : '/job-type';

  const breadcrumbSchema = shouldRenderBreadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: breadcrumbLabel,
            item: `${siteUrl}${breadcrumbPath}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: `${siteUrl}${breadcrumbPath}/${slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {shouldRenderBreadcrumbs && breadcrumbSchema && (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(itemListSchema)}
      </script>
    </>
  );
}
