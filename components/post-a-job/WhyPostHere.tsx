'use client';

import React from 'react';
import {
  BriefcaseIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  BoltIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

function Card({
  icon,
  title,
  kicker,
  desc,
  tone = 'neutral',
}: {
  icon: React.ReactNode;
  title: string;
  kicker: string;
  desc: string;
  tone?: 'neutral' | 'brand';
}) {
  const toneStyles =
    tone === 'brand'
      ? 'bg-gradient-to-b from-[#fff7f3] to-white border-[#f7d6cb]'
      : 'bg-white border-gray-200';

  return (
    <div
      className={[
        'group relative overflow-hidden rounded-3xl border p-6 sm:p-7 text-left shadow-sm transition',
        'hover:-translate-y-0.5 hover:shadow-md',
        toneStyles,
      ].join(' ')}
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#1D4ED8]/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-black/5">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {kicker}
          </div>
          <h4 className="mt-1 text-base sm:text-lg font-extrabold text-gray-900">{title}</h4>
          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-gray-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-200 px-3 py-2 sm:px-4 sm:py-3">
      <div className="text-lg sm:text-xl font-extrabold text-gray-900 leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-gray-600">{label}</div>
    </div>
  );
}

export default function WhyPostHere() {
  return (
    <section className="text-center">
      <div className="mx-auto max-w-3xl space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff7f3] px-3 py-1 text-xs font-semibold text-[#1D4ED8] ring-1 ring-[#1D4ED8]/15">
          Built for APAC remote hiring
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          If you’re hiring remote in APAC,
          <span className="text-[#1D4ED8]"> distribution</span> matters.
        </h2>

        <p className="text-base sm:text-lg text-gray-600">
          Posting a job is easy.
          <br className="hidden sm:block" />
          Getting it seen by the right candidates — that’s the hard part.
          <span className="text-gray-900 font-medium"> Kerja-AI is built for that.</span>
        </p>

        {/* proof row */}
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value="6,000+" label="Email subscribers" />
          <Stat value="3,000+" label="LinkedIn followers" />
          <Stat value="4,500+" label="X (Twitter)" />
          <Stat value="~12,000+" label="Pageviews" />
        </div>

        <p className="text-[12px] text-gray-500">
          And yes — every listing is <span className="font-semibold text-gray-900">manually reviewed</span> by an
          admin to keep the board clean.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
        <Card
          tone="brand"
          icon={<GlobeAltIcon className="h-6 w-6 text-[#1D4ED8]" />}
          kicker="Reach, but targeted"
          title="APAC remote &amp; hybrid talent — not global noise"
          desc="You’re not paying to be one tiny card on a generic job board. You’re reaching remote-ready candidates across Malaysia, Singapore, Philippines, Vietnam and beyond — people actively searching for remote and hybrid work in this region."
        />

        <Card
          icon={<BriefcaseIcon className="h-6 w-6 text-emerald-600" />}
          kicker="No surprises"
          title="Flat pricing. No commissions. No games."
          desc="No recruiters taking a cut. No hidden fees. Just a clean listing model that keeps your cost predictable — and your hiring process in your control."
        />

        <Card
          icon={<RocketLaunchIcon className="h-6 w-6 text-indigo-600" />}
          kicker="Remote-first by design"
          title="Every listing is remote. That’s the point."
          desc="Candidates don’t have to filter through onsite and hybrid roles. You don’t have to compete with irrelevant listings. It’s a remote-only environment — which means faster matching and fewer wasted clicks."
        />

        <Card
          tone="brand"
          icon={<CheckCircleIcon className="h-6 w-6 text-[#1D4ED8]" />}
          kicker="Trust layer"
          title="Human-reviewed listings (keeps quality high)"
          desc="Spam and scam listings destroy conversion. We review listings before publishing to protect candidates — and to protect your employer brand from being placed next to junk."
        />

        <Card
          icon={<BoltIcon className="h-6 w-6 text-amber-600" />}
          kicker="For urgent roles"
          title="Private Early Access for paid jobs"
          desc="Paid listings can be placed into Private Early Access before they go public — so you get attention from high-intent candidates first, not last."
        />

        <Card
          icon={<MegaphoneIcon className="h-6 w-6 text-sky-600" />}
          kicker="Distribution engine"
          title="We don’t just ‘list’ it. We push it."
          desc="Paid jobs get included in our weekly newsletter to 6,000+ APAC subscribers and boosted on social — after admin approval. Free jobs are public-only and don’t enter the newsletter."
        />
      </div>

    </section>
  );
}
