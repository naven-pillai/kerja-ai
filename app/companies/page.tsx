import RemoteCompaniesContent from '@/components/companies/RemoteCompaniesContent';

export const metadata = {
  title: 'Explore Top Remote Companies Hiring in APAC | Kerja-AI',
  description: 'Discover companies actively hiring remote and hybrid talent across APAC.',
  alternates: { canonical: 'https://kerja-ai.com/companies' },
  openGraph: {
    title: 'Explore Top Remote Companies Hiring in APAC | Kerja-AI',
    description: 'Discover companies actively hiring remote and hybrid talent across APAC.',
    url: 'https://kerja-ai.com/companies',
    siteName: 'Kerja-AI',
    type: 'website',
  },
};

export default function RemoteCompaniesPage() {
  return (
    <>
      <RemoteCompaniesContent />
    </>
  );
}
