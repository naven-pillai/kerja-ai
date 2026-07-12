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
          alt="Kerja AI background"
          fill
          priority
          quality={70}
          className="object-cover object-[center_25%] md:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70 md:bg-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Headline */}
        <h2 className="text-xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
          One board, built only for AI and data roles in Malaysia and Singapore.
        </h2>
        <p className="text-gray-200 text-base md:text-lg mb-10 md:mb-16 max-w-xl mx-auto">
          Real AI, machine learning and data roles. Less noise, no general-board clutter. Built for Malaysia and Singapore.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-10 md:mb-12">
          <HighlightCard
            icon={<BriefcaseIcon className="w-8 h-8" />}
            title="Roles, not noise"
            description="Every listing is an AI, ML or data job — not a general board with a few tech roles mixed in."
          />
          <HighlightCard
            icon={<UsersIcon className="w-8 h-8" />}
            title="Where AI teams hire"
            description="Startups, labs and data teams across Malaysia and Singapore post their openings here."
          />
          <HighlightCard
            icon={<GlobeAltIcon className="w-8 h-8" />}
            title="KL to Singapore, one board"
            description="Compare RM and SGD offers across the corridor without switching between five job sites."
          />
        </div>

        {/* CTA Button → jobs page */}
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-xl bg-[#1D4ED8] px-6 py-4 font-semibold text-white shadow-md transition hover:bg-[#1E40AF] hover:-translate-y-0.5"
        >
          Browse AI &amp; Data Jobs
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
