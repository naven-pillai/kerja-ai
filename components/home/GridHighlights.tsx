import Image from 'next/image';
import Link from 'next/link';
import { BriefcaseIcon, UsersIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function GridHighlights() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background image (Next/Image for responsiveness) */}
      <div className="absolute inset-0 -z-10">
        {/* Single 29KB image — behind 70% black overlay, quality difference is invisible */}
        <Image
          src="/kerja-ai-background-mobile.webp"
          alt="Kerja-AI background"
          fill
          priority
          className="object-cover object-[center_25%] md:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70 md:bg-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Headline */}
        <h2 className="text-xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
          Join 6,000+ remote &amp; hybrid job seekers across APAC.
        </h2>
        <p className="text-gray-200 text-base md:text-lg mb-10 md:mb-16 max-w-xl mx-auto">
          Real remote and hybrid roles. Less noise. Curated for Malaysia, Singapore, Indonesia — and the rest of APAC.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-10 md:mb-12">
          <HighlightCard
            icon={<BriefcaseIcon className="w-8 h-8" />}
            title="Jobs worth your time"
            description="Only verified, quality remote and hybrid roles — hand-picked for APAC professionals."
          />
          <HighlightCard
            icon={<UsersIcon className="w-8 h-8" />}
            title="Where remote &amp; hybrid teams hire"
            description="Startups, agencies, and digital teams across APAC post here."
          />
          <HighlightCard
            icon={<GlobeAltIcon className="w-8 h-8" />}
            title="Work from anywhere in APAC"
            description="Kuala Lumpur to Singapore to Bali — pick your base. Keep your career."
          />
        </div>

        {/* CTA Button → jobs page */}
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-xl bg-[#1D4ED8] px-6 py-4 font-semibold text-white shadow-md transition hover:bg-[#1E40AF] hover:-translate-y-0.5"
        >
          Browse Remote &amp; Hybrid Jobs
        </Link>
      </div>
    </section>
  );
}

type HighlightCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function HighlightCard({ icon, title, description }: HighlightCardProps) {
  return (
    <div className="group bg-white/95 backdrop-blur-[1px] border border-white/40 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 text-[#1D4ED8] bg-[#fff5f2] rounded-full shadow-sm group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
