import RemoteCompaniesContent from '@/components/companies/RemoteCompaniesContent';

export const metadata = {
  title: 'Companies Hiring AI & Data Talent in MY & SG | Kerja-AI',
  description: 'Browse companies hiring for AI, machine learning and data roles in Malaysia and Singapore. Profiles stay live even after a role closes.',
  alternates: { canonical: 'https://kerja-ai.com/companies' },
  openGraph: {
    title: 'Companies Hiring AI & Data Talent in MY & SG | Kerja-AI',
    description: 'Browse companies hiring for AI, machine learning and data roles in Malaysia and Singapore. Profiles stay live even after a role closes.',
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
