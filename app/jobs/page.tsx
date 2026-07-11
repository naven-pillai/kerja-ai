import JobsContentPage from '@/components/jobs/JobsContentPage';

export const metadata = {
  title: 'Remote & Hybrid Jobs in APAC | Kerja-AI.com',
  description:
    'Find verified remote and hybrid jobs across APAC. Filter by work setup, category, location, salary, and skill — curated daily for APAC professionals. Every role is labelled 100% Remote or Hybrid.',
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
