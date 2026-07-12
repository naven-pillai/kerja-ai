import Link from 'next/link';

export const metadata = {
  title: 'Job Submitted — Pending Review',
  robots: { index: false, follow: false },
};

export default function PostSuccessPage() {
  return (
    <main className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg text-center py-24">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#14B8A6]/10">
          <svg className="h-8 w-8 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your job has been submitted</h1>
        <p className="text-gray-600 mb-8">
          Thanks for posting on Kerja AI. Your listing is pending a quick review and will
          go live shortly. We&apos;ll email you once it&apos;s published.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/jobs" className="rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-white font-semibold hover:bg-[#1E40AF] transition-colors">
            Browse AI jobs
          </Link>
          <Link href="/post-job" className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            Post another
          </Link>
        </div>
      </div>
    </main>
  );
}
