import JobsContentPage from '@/components/jobs/JobsContentPage';

export const metadata = {
  title: 'AI, ML & Data Jobs in Malaysia & Singapore 2026 | Kerja-AI',
  description:
    'AI, machine learning and data jobs across Malaysia and Singapore. One board built for these roles — filter by category, salary and location, and post free.',
  alternates: {
    canonical: 'https://kerja-ai.com/jobs',
  },
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <JobsContentPage initialKeyword={q ?? ''} />;
}
