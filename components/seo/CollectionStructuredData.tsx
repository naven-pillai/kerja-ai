import { SITE_URL } from '@/lib/seo';

/**
 * BreadcrumbList + CollectionPage for the three listing pages (/jobs,
 * /companies, /blog), which shipped with no structured data at all while the
 * taxonomy pages under them already had breadcrumbs.
 *
 * Breadcrumbs are the part that earns its keep: Google renders them in place of
 * the raw URL in the result, so the listing shows "Kerja AI › AI & Data Jobs"
 * instead of a bare link.
 */
export default function CollectionStructuredData({
  name,
  description,
  path,
  type = 'CollectionPage',
}: {
  name: string;
  description: string;
  /** Leading slash, e.g. "/jobs". */
  path: string;
  /** CollectionPage for listings; WebPage/AboutPage/ContactPage for the rest. */
  type?: 'CollectionPage' | 'WebPage' | 'AboutPage' | 'ContactPage';
}) {
  const url = `${SITE_URL}${path}`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': type,
      name,
      description,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Kerja AI',
        url: SITE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Kerja AI', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
