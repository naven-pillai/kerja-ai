import { Target, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const POINTS = [
  {
    icon: Target,
    title: 'Intent-matched audience',
    body: "Everyone here is looking at AI, ML and data work in Malaysia and Singapore. That's a different signal from LinkedIn or a generic banner network.",
    tone: 'red',
  },
  {
    icon: ShieldCheck,
    title: 'No spammy noise',
    body: 'We review every job listing by hand, and ads get the same treatment. Your message runs in a place people already trust, not a wall of noise.',
    tone: 'emerald',
  },
  {
    icon: Zap,
    title: 'Fast turnaround',
    body: "Reply within 1 business day. Newsletter slots ship on the next Friday send. Banner goes live within 24 hours of approval.",
    tone: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Honest numbers',
    body: 'Real subscriber counts, real open rates. No bot inflation. We share post-campaign analytics if you ask.',
    tone: 'blue',
  },
] as const;

const toneClasses = {
  red: { bg: 'bg-[#1D4ED8]/10', text: 'text-[#1D4ED8]' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
};

export default function AdvertiseWhy() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest mb-2">
            Why it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Niche reach beats broad noise
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
            We&apos;re not the biggest job board. We&apos;re the one AI and data people in
            Malaysia and Singapore actually open — which is what you want when you&apos;re paying
            for attention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {POINTS.map(({ icon: Icon, title, body, tone }) => {
            const t = toneClasses[tone];
            return (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4"
              >
                <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${t.text}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
