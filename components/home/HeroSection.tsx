import Link from 'next/link';
import HeroSearchForm from '@/components/home/HeroSearchForm';

export default function HeroSection() {
  return (
    <section className="bg-blue-50/30 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {/* Social proof badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1D4ED8] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
          Malaysia&apos;s first job board built only for AI &amp; data roles
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5 text-slate-900">
          AI is reshaping careers in{' '}
          <span className="text-[#1D4ED8]">Malaysia and Singapore</span>{' '}
          — here are the roles.
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          TalentCorp expects ~697,000 Malaysian jobs to be reshaped by AI within
          three to five years. Kerja-AI is where you find the AI, machine learning
          and data roles that come out of it — across Malaysia and Singapore.
        </p>

        <HeroSearchForm />

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/newsletter"
            className="bg-[#1D4ED8] text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#1E40AF] transition"
          >
            Get AI Job Alerts
          </Link>
          <Link
            href="/post-job"
            className="border border-[#1D4ED8] text-[#1D4ED8] px-6 py-3 rounded-lg text-base font-semibold hover:bg-blue-50 transition"
          >
            Post a Job — Free
          </Link>
        </div>
      </div>
    </section>
  );
}
