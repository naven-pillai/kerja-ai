'use client';

import { useState } from 'react';
import { Mail, Image as ImageIcon, FileText, Layers, Rocket, Star, ArrowRight } from 'lucide-react';
import AdvertiseBookingModal from '@/components/advertise/AdvertiseBookingModal';

export type AdSlot = {
  id: string;
  name: string;
  price: number; // in MYR
  cadence: string;
  description: string;
  best_for: string;
  reach: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

const SLOTS: AdSlot[] = [
  {
    id: 'newsletter-inline',
    name: 'Newsletter Inline Mention',
    price: 249,
    cadence: 'per issue',
    description: 'Short mid-email mention with link. Great for soft launches and ongoing presence.',
    best_for: 'Tool launches · Community shoutouts · Side projects',
    reach: 'AI & data pros in MY & SG',
    icon: Mail,
    features: ['1 paragraph + link', '35%+ open rate', 'Delivered next Friday'],
  },
  {
    id: 'newsletter-top',
    name: 'Newsletter Top Sponsor',
    price: 399,
    cadence: 'per issue',
    description: 'First placement in the weekly email, above all jobs. Maximum attention.',
    best_for: 'Product launches · Hiring drives · Premium plays',
    reach: 'AI & data pros in MY & SG',
    icon: Star,
    badge: 'Most popular',
    highlight: true,
    features: ['Logo + 100-word pitch + CTA', 'Top placement, above jobs', 'Pre-flight preview before send'],
  },
  {
    id: 'sidebar-banner',
    name: 'Sidebar Banner',
    price: 349,
    cadence: '30 days · sitewide',
    description: 'Persistent banner across jobs and blog pages. Long-tail brand exposure.',
    best_for: 'Brand awareness · Cohort signups · Always-on offers',
    reach: '~12,000+ monthly pageviews',
    icon: ImageIcon,
    features: ['Image + headline + CTA', 'Visible across high-traffic pages', 'Refresh creative anytime'],
  },
  {
    id: 'sponsored-blog',
    name: 'Sponsored Blog Post',
    price: 499,
    cadence: 'one-time',
    description: 'Editorial-style article published on the blog. Stays forever for SEO compounding.',
    best_for: 'Thought leadership · Long-tail SEO · Case studies',
    reach: 'Indexed for years',
    icon: FileText,
    features: ['Up to 1,500 words', 'Disclosed as sponsored', 'Shared in newsletter + social once'],
  },
  {
    id: 'bundle-visibility',
    name: 'Visibility Bundle',
    price: 649,
    cadence: '30-day campaign',
    description: 'Newsletter top sponsor + 30 days of sidebar banner. Save RM99.',
    best_for: 'Launches that need both spike and sustain',
    reach: '6,000+ subscribers + 12,000+ pageviews',
    icon: Layers,
    features: ['1 newsletter top placement', '30 days sidebar banner', 'Single onboarding call'],
  },
  {
    id: 'bundle-launch',
    name: 'Launch Pack',
    price: 999,
    cadence: '30-day campaign',
    description: 'Newsletter top + sidebar (30d) + 2 social posts. Full-stack launch support.',
    best_for: 'Product launches · Funding announcements',
    reach: 'Full Kerja AI audience',
    icon: Rocket,
    badge: 'Best value',
    features: [
      '1 newsletter top sponsor',
      '30 days sidebar banner',
      '2 social posts (LinkedIn + X)',
      'Light analytics report after',
    ],
  },
];

export default function AdvertiseSlotGrid() {
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);

  return (
    <>
      <section id="slots" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest mb-2">
              Pick a slot
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Ad slots & pricing
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
              Prices in <span className="font-semibold text-gray-700">MYR</span>. USD invoicing
              available — just ask. No procurement bureaucracy, reply within 1 business day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SLOTS.map((slot) => {
              const Icon = slot.icon;
              return (
                <div
                  key={slot.id}
                  className={`relative bg-white rounded-2xl border ${
                    slot.highlight ? 'border-[#1D4ED8]/40 shadow-md' : 'border-gray-100 shadow-sm'
                  } p-6 flex flex-col`}
                >
                  {slot.badge && (
                    <span
                      className={`absolute -top-2.5 right-4 inline-flex items-center gap-1 ${
                        slot.highlight ? 'bg-[#1D4ED8]' : 'bg-amber-500'
                      } text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm`}
                    >
                      {slot.badge}
                    </span>
                  )}

                  <div
                    className={`w-10 h-10 rounded-xl ${
                      slot.highlight ? 'bg-[#1D4ED8]/10' : 'bg-gray-100'
                    } flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-5 h-5 ${slot.highlight ? 'text-[#1D4ED8]' : 'text-gray-600'}`} />
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{slot.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{slot.reach}</p>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-gray-900">RM{slot.price}</span>
                    <span className="text-xs text-gray-400">{slot.cadence}</span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{slot.description}</p>

                  <ul className="mt-4 space-y-1.5">
                    {slot.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-[#1D4ED8] mt-1 leading-none">·</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-[11px] text-gray-400 border-t border-gray-100 pt-3">
                    <span className="font-medium text-gray-500">Best for:</span> {slot.best_for}
                  </p>

                  <button
                    onClick={() => setSelectedSlot(slot)}
                    className={`mt-5 w-full flex items-center justify-center gap-2 ${
                      slot.highlight
                        ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                        : 'bg-gray-900 hover:bg-gray-700 text-white'
                    } text-sm font-semibold py-2.5 rounded-xl transition shadow-sm`}
                  >
                    Book this slot
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center mt-8 text-xs text-gray-400">
            Need something custom? Email{' '}
            <a href="mailto:info@kerja-ai.com" className="text-[#1D4ED8] hover:underline">
              info@kerja-ai.com
            </a>{' '}
            and we&apos;ll quote it.
          </p>
        </div>
      </section>

      <AdvertiseBookingModal
        open={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        slot={selectedSlot}
      />
    </>
  );
}
