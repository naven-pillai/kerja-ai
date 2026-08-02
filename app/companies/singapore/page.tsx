import RemoteCompaniesContent from '@/components/companies/RemoteCompaniesContent';
import CollectionStructuredData from '@/components/seo/CollectionStructuredData';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/seo';

// A static segment, so Next serves this before /companies/[slug] — no company
// is slugged "singapore", so nothing is shadowed.
const title = 'Companies Hiring AI & Data Talent in Singapore';
const description =
  'Companies with open AI, machine learning and data roles in Singapore right now. HQ anywhere — what counts is where they are hiring.';

export const metadata = {
  title,
  description,
  alternates: { canonical: 'https://kerja-ai.com/companies/singapore' },
  openGraph: {
    title,
    description,
    url: 'https://kerja-ai.com/companies/singapore',
    siteName: 'Kerja AI',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: { card: 'summary_large_image', title, description, images: TWITTER_IMAGES },
};

export default function CompaniesSingaporePage() {
  return (
    <>
      <CollectionStructuredData
        name={title}
        description="Companies hiring for AI, machine learning and data roles in Singapore."
        path="/companies/singapore"
      />
      <RemoteCompaniesContent country="Singapore" />
    </>
  );
}
