'use client';

import Link from 'next/link';
import { Mail, Briefcase, MapPin, ShieldCheck, Wrench, User } from 'lucide-react';

const differentiators = [
  {
    icon: MapPin,
    title: 'APAC-first, not APAC-afterthought',
    desc: 'Jobs filtered for Southeast Asian timezone and hiring eligibility. Not a global dump with a region filter.',
  },
  {
    icon: ShieldCheck,
    title: 'Every job is verified',
    desc: 'We check that listings are actively hiring and open to APAC applicants, and label each one 100% Remote or Hybrid before it goes live.',
  },
  {
    icon: Wrench,
    title: 'Tool reviews for this region',
    desc: 'We review remote work tools for local pricing, payment methods, latency, and APAC customer support.',
  },
  {
    icon: User,
    title: 'Built by someone who gets it',
    desc: 'I work remotely from Malaysia. The problems this platform solves are ones I\u2019ve hit myself.',
  },
];

export default function AboutContent() {
  return (
    <main className="bg-white min-h-screen text-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-20 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#1D4ED8] mb-4">
            About Kerja-AI
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Remote and hybrid jobs shouldn&apos;t be a{' '}
            <span className="text-[#1D4ED8]">Western-only</span> thing.
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            I&apos;m Naven. I built Kerja-AI because most job boards ignore
            Southeast Asia. The talent is here — Malaysia, Philippines,
            Singapore, Indonesia — but the platforms weren&apos;t built for us.
            So I made one that is, covering both fully remote and hybrid roles.
          </p>
        </div>
      </section>

      {/* What we do — two columns */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
              Jobs
            </h2>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Verified remote &amp; hybrid roles open to APAC
            </h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">
              Every listing is checked — no scams, no bait-and-switch. We label
              each role <strong>100% Remote</strong> or <strong>Hybrid</strong>{' '}
              up front, so you know exactly what you&apos;re applying to before
              you click.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
              Tools
            </h2>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Reviews built for this region
            </h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">
              We review tools remote workers actually use — project management,
              communication, payroll, VPNs — and rate them for how well they
              work here. A tool that&apos;s great in San Francisco can be
              unusable in Jakarta if the pricing or support isn&apos;t there.
            </p>
          </div>
        </div>
      </section>

      {/* Vision quote */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <blockquote className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed">
            &ldquo;Someone in Johor should be able to work for a company in
            Berlin. A designer in Manila should have the same shot as one in
            London. Where you live shouldn&apos;t cap what you earn or who you
            work with.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-gray-400 font-medium">
            — Naven, Founder
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8 text-center">
          How we&apos;re different
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {differentiators.map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="group relative border border-gray-200 bg-white p-6 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#1D4ED8]/10 transition-colors">
                <Icon className="w-4.5 h-4.5 text-gray-400 group-hover:text-[#1D4ED8] transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let&apos;s work together
        </h2>
        <p className="text-gray-500 mb-6 text-[15px]">
          Whether you&apos;re hiring, job hunting, or building for remote and
          hybrid teams — we&apos;d like to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="mailto:info@kerja-ai.com"
            className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#c62806] transition text-sm"
          >
            <Mail className="w-4 h-4" /> Get in touch
          </Link>
          <Link
            href="/post-job"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition text-sm"
          >
            <Briefcase className="w-4 h-4" /> Post a job
          </Link>
        </div>
      </section>
    </main>
  );
}
