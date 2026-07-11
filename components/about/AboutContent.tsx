'use client';

import Link from 'next/link';
import { Mail, Briefcase, MapPin, ShieldCheck, Wrench, User } from 'lucide-react';

const differentiators = [
  {
    icon: MapPin,
    title: 'Malaysia and Singapore, nothing else',
    desc: 'One board for the KL\u2013Singapore corridor. Compare an RM offer in KL against an SGD one across the border, instead of digging through a global list that was never meant for you.',
  },
  {
    icon: ShieldCheck,
    title: 'Real AI and data roles, current',
    desc: 'Every listing is a genuine AI, machine learning or data opening at a company hiring in Malaysia or Singapore \u2014 not scraped noise or a job that closed six months ago.',
  },
  {
    icon: Wrench,
    title: 'One niche, eleven role types',
    desc: 'AI Engineering, Machine Learning, Data Science, NLP, Computer Vision, Prompt Engineering and more \u2014 the roles this shift is creating, in one place.',
  },
  {
    icon: User,
    title: 'Built by someone watching the same shift',
    desc: 'I\u2019m not selling you hype about AI. I\u2019m tracking where the jobs are actually going in Malaysia and Singapore, and putting them on one board.',
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
            AI is reshaping Malaysian and Singaporean careers. This is the{' '}
            <span className="text-[#1D4ED8]">board</span> built for it.
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            I&apos;m Naven. I built Kerja-AI because there was no board built for
            one thing: AI, machine learning and data careers in Malaysia and
            Singapore. TalentCorp expects around 697,000 jobs to be highly
            affected by AI within three to five years — so I wanted one place
            that tracks the roles coming out of that shift, for the people
            feeling it most.
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
              AI and data roles, Malaysia &amp; Singapore
            </h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">
              Every listing is a genuine <strong>AI</strong>,{' '}
              <strong>machine learning</strong> or <strong>data</strong> opening
              at a company hiring here. No general software jobs padding the
              list, no scraped roles that closed months ago. You see the title,
              the location, and whether it&apos;s an RM or SGD offer before you
              click.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
              Context
            </h2>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              SG offers, read from a Malaysian seat
            </h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">
              A lot of the value is comparing across the border — an RM salary in
              KL against an SGD one in Singapore, and what actually clears after
              cost of living. The Singapore roles here are framed for Malaysians
              weighing the jump, not for locals. Salary is context for the
              decision, never the whole pitch.
            </p>
          </div>
        </div>
      </section>

      {/* Vision quote */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <blockquote className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed">
            &ldquo;A fresh grad in KL shouldn&apos;t have to guess where AI is
            taking their field. Put the real roles in one place, show what they
            pay on each side of the border, and the anxiety turns into a decision
            you can actually make.&rdquo;
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
          Post a role, or find your next one
        </h2>
        <p className="text-gray-500 mb-6 text-[15px]">
          Hiring for AI, ML or data work in Malaysia or Singapore? Posting is
          free right now. Looking for your next role? The board and the weekly
          newsletter are built for you. Either way, say hello.
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
