import { Sparkles } from 'lucide-react';

export default function AdvertiseHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-orange-50/60 to-white pt-20 pb-12 md:pt-28 md:pb-16">
      {/* Subtle decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#1D4ED8]/8 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1D4ED8]/20 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm">
          <Sparkles className="w-3 h-3" />
          Advertise with us
        </span>

        <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Reach the AI and data crowd
          <br className="hidden sm:block" />
          <span className="text-[#1D4ED8]"> in Malaysia &amp; Singapore</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Kerja-AI is read weekly by AI engineers, data scientists, ML practitioners and the
          people hiring them across Malaysia and Singapore. One niche audience, high intent, no
          spray-and-pray.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#slots"
            className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            See ad slots & pricing
          </a>
          <a
            href="#dashboard"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            View live dashboard
          </a>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Reply within 1 business day · invoiced after approval · MYR or USD
        </p>
      </div>
    </section>
  );
}
