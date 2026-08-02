import RemoteCompaniesContent from '@/components/companies/RemoteCompaniesContent';
import CollectionStructuredData from '@/components/seo/CollectionStructuredData';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/seo';

// A static segment, so Next serves this before /companies/[slug] — no company
// is slugged "malaysia", so nothing is shadowed.
const title = 'AI & Data Companies in Malaysia';
const description =
  'Companies building AI, machine learning and data teams in Malaysia. Profiles stay live even after a role closes.';

export const metadata = {
  title,
  description,
  alternates: { canonical: 'https://kerja-ai.com/companies/malaysia' },
  openGraph: {
    title,
    description,
    url: 'https://kerja-ai.com/companies/malaysia',
    siteName: 'Kerja AI',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: { card: 'summary_large_image', title, description, images: TWITTER_IMAGES },
};

export default function CompaniesMalaysiaPage() {
  return (
    <>
      <CollectionStructuredData
        name={title}
        description="Companies hiring for AI, machine learning and data roles in Malaysia."
        path="/companies/malaysia"
      />
      <RemoteCompaniesContent country="Malaysia" />
    </>
  );
}
