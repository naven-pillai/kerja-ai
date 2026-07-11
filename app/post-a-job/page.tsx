import Link from 'next/link';
import WhyPostHere from '@/components/post-a-job/WhyPostHere';
import { SITE } from '@/config/site';

export const metadata = {
  title: `Post an AI or Data Job in Malaysia & Singapore — Free | ${SITE.name}`,
  description:
    'Reach candidates who are actively looking for AI, machine learning and data roles across Malaysia and Singapore. Posting is free at launch.',
  alternates: { canonical: `${SITE.url}/post-a-job` },
};

export default function PostAJobPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-12 text-center">
        <span className="inline-block rounded-full bg-[#14B8A6]/10 px-3 py-1 text-sm font-medium text-[#0D9488] mb-4">
          Free at launch
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Hire AI &amp; data talent in Malaysia and Singapore
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Kerja-AI is the dedicated board for artificial intelligence, machine learning
          and data careers. Post your role in minutes and reach candidates who are
          looking specifically for AI work — no low-intent noise.
        </p>
        <Link
          href="/post-job"
          className="inline-flex items-center justify-center rounded-lg bg-[#1D4ED8] px-6 py-3 text-white font-semibold hover:bg-[#1E40AF] transition-colors"
        >
          Post a job for free
        </Link>
      </section>
      <WhyPostHere />
    </main>
  );
}
