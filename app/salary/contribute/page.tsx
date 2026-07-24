import type { Metadata } from 'next';
import Link from 'next/link';
import SalaryContributeForm from '@/components/salary/SalaryContributeForm';
import { OG_IMAGES, TWITTER_IMAGES } from '@/lib/seo';

const title = 'Share Your Salary Anonymously';
const description =
  'Add your AI, ML or data salary to the Kerja AI dataset. Fully anonymous — no name, email or employer collected. Helps build real pay benchmarks for Malaysia and Singapore.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://kerja-ai.com/salary/contribute' },
  openGraph: {
    title,
    description,
    url: 'https://kerja-ai.com/salary/contribute',
    siteName: 'Kerja AI',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: { card: 'summary_large_image', title, description, images: TWITTER_IMAGES },
};

export default function SalaryContributePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/salary" className="hover:text-[#1D4ED8]">
          Salaries
        </Link>
        <span>/</span>
        <span className="text-gray-700">Share your salary</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
        Share your salary, anonymously
      </h1>

      <p className="mt-4 text-gray-600 leading-relaxed">
        Kerja AI publishes pay bands for four roles today. The rest — computer vision, NLP,
        prompt engineering, AI research and the others — have no reliable Malaysian or
        Singaporean data to publish, so we publish nothing rather than guess.
      </p>
      <p className="mt-3 text-gray-600 leading-relaxed">
        This is how that changes. Takes about a minute.
      </p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 md:p-7 shadow-sm">
        <SalaryContributeForm />
      </div>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          How this stays anonymous
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
          <li>
            <strong className="text-gray-900">No identifying fields exist.</strong> The form has
            no name, email or employer box, and the database has no column to store them.
          </li>
          <li>
            <strong className="text-gray-900">Company type, not company name.</strong> The AI and
            data scene here is small — a role plus an employer plus a figure can identify one
            person. &ldquo;Startup&rdquo; or &ldquo;MNC&rdquo; tells us what we need without that.
          </li>
          <li>
            <strong className="text-gray-900">Only ranges are published.</strong> Individual
            submissions are never shown, and nothing is published for a category until there are
            enough responses for a figure to be meaningful.
          </li>
        </ul>
      </section>
    </main>
  );
}
