import RemoteCompaniesContent from '@/components/companies/RemoteCompaniesContent';
import CollectionStructuredData from '@/components/seo/CollectionStructuredData';
import { OG_IMAGES } from '@/lib/seo';

export const metadata = {
  title: 'Companies Hiring AI & Data Talent in MY & SG',
  description: 'Browse companies hiring for AI, machine learning and data roles in Malaysia and Singapore. Profiles stay live even after a role closes.',
  alternates: { canonical: 'https://kerja-ai.com/companies' },
  openGraph: {
    title: 'Companies Hiring AI & Data Talent in MY & SG',
    description: 'Browse companies hiring for AI, machine learning and data roles in Malaysia and Singapore. Profiles stay live even after a role closes.',
    url: 'https://kerja-ai.com/companies',
    siteName: 'Kerja AI',
    type: 'website',
    images: OG_IMAGES,
  },
};

export default function RemoteCompaniesPage() {
  return (
    <>
      <CollectionStructuredData
        name="Companies Hiring AI & Data Talent in Malaysia & Singapore"
        description="Companies hiring for AI, machine learning and data roles in Malaysia and Singapore."
        path="/companies"
      />
      <RemoteCompaniesContent />
    </>
  );
}
