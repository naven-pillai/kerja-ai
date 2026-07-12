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
          Built for AI &amp; data hiring in Malaysia &amp; Singapore
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Reach people who came here for
          <span className="text-[#1D4ED8]"> AI and data work</span> — not the whole internet.
        </h2>

        <p className="text-base sm:text-lg text-gray-600">
          Posting a job anywhere is easy.
          <br className="hidden sm:block" />
          Getting it in front of people who actually do AI and data work — that&apos;s the hard part.
          <span className="text-gray-900 font-medium"> Kerja AI is built for exactly that.</span>
        </p>

        {/* proof row */}
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value="Free" label="To post your role — Phase 1" />
          <Stat value="11" label="AI, ML &amp; data role categories" />
          <Stat value="Minutes" label="From first field to submitted" />
          <Stat value="2" label="Markets — Malaysia &amp; Singapore" />
        </div>

        <p className="text-[12px] text-gray-500">
          And every listing is <span className="font-semibold text-gray-900">reviewed by a human</span> before it
          goes live — so the board stays worth browsing.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
        <Card
          tone="brand"
          icon={<GlobeAltIcon className="h-6 w-6 text-[#1D4ED8]" />}
          kicker="Targeted reach"
          title="People who came here for AI &amp; data — not the whole internet"
          desc="You are not one more card on a giant, general job board. Your role goes in front of people in Malaysia and Singapore who are actively looking for AI, machine learning and data work."
        />

        <Card
          icon={<BriefcaseIcon className="h-6 w-6 text-emerald-600" />}
          kicker="Free at launch"
          title="Post for free. No recruiter taking a cut."
          desc="Posting is free while we are in Phase 1 — no commissions, no middleman, no games. Candidates apply straight through your own link or email, and you stay in control of the process."
        />

        <Card
          icon={<RocketLaunchIcon className="h-6 w-6 text-indigo-600" />}
          kicker="One focus"
          title="Every listing is AI, ML or data. That is the point."
          desc="Candidates do not wade through sales, ops and admin roles to find yours. It is a single-focus board, which means less noise for them and faster, better-matched applications for you."
        />

        <Card
          tone="brand"
          icon={<CheckCircleIcon className="h-6 w-6 text-[#1D4ED8]" />}
          kicker="Quality control"
          title="Every listing is reviewed by a human"
          desc="Spam and scam posts wreck a job board fast. We check each listing before it publishes — to protect candidates, and to keep your company off a page full of junk."
        />

        <Card
          icon={<BoltIcon className="h-6 w-6 text-amber-600" />}
          kicker="Fast"
          title="Live in minutes, not days"
          desc="Fill in four short steps, submit, and your role is queued for a quick review. No sales call, no waiting on an account manager — most listings are reviewed and live the same day."
        />

        <Card
          icon={<MegaphoneIcon className="h-6 w-6 text-sky-600" />}
          kicker="Right audience"
          title="In front of people already searching for this"
          desc="Kerja AI is a content-led board built around AI and data careers in Malaysia and Singapore. Your role sits where that audience already reads, searches and browses — not lost in a feed of unrelated jobs."
        />
      </div>

    </section>
  );
}
