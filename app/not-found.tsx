import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Kerja AI',
  description: "This page doesn't exist. But real remote jobs in APAC do.",
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <p className="text-8xl font-extrabold text-[#1D4ED8] mb-4">404</p>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          This page went fully remote.
        </h1>

        <p className="text-gray-500 text-base mb-8">
          We looked everywhere — Malaysia, Singapore, the Philippines — but
          this page doesn&apos;t exist. The good news? Real remote jobs do.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/jobs"
            className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-lg text-sm font-semibold transition"
          >
            Browse Remote Jobs
          </Link>
          <Link
            href="/blog"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg text-sm font-semibold transition"
          >
            Read the Blog
          </Link>
        </div>
      </div>
    </section>
  );
}
