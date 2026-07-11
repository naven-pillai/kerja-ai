import Link from 'next/link';
import HeroSearchForm from '@/components/home/HeroSearchForm';

export default function HeroSection() {
  return (
    <section className="bg-orange-50/30 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {/* Social proof badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          6,000+ job seekers across APAC finding remote &amp; hybrid work here
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5 text-slate-900">
          Find Your Next{' '}
          <span className="text-[#1D4ED8]">Remote or Hybrid Job</span>{' '}
          in APAC
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Verified remote and hybrid roles across APAC — curated, not aggregated.
          Every job is labelled, so you know what you&apos;re applying to.
        </p>

        <HeroSearchForm />

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/newsletter"
            className="bg-[#1D4ED8] text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#1E40AF] transition"
          >
            Get Jobs by Email
          </Link>
          <Link
            href="/post-job"
            className="border border-[#1D4ED8] text-[#1D4ED8] px-6 py-3 rounded-lg text-base font-semibold hover:bg-red-50 transition"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </section>
  );
}
