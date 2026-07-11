'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight, UserPlus, Briefcase, Eye, Zap } from 'lucide-react';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

export default function NewsletterSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 py-16 md:py-24 relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      {/* Confirmation card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-10">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          You&apos;re in.
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-2">
          Check your inbox and confirm your subscription — then you&apos;ll get new AI and data roles across Malaysia and Singapore every week.
        </p>
        <p className="text-gray-500 text-xs">
          Not seeing it? Check your spam or promotions tab.
        </p>
      </div>

      {/* Talent CTA card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-[#1D4ED8]" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            While you wait, start browsing
          </h2>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Your first email lands next week. In the meantime, every open AI, machine learning and data role in Malaysia and Singapore is already on the board.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600">
              Filter by role, location and remote type to find the ones that fit you.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600">
              New roles added regularly across both Malaysia and Singapore.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600">
              Free to browse, no account needed. Apply straight to the employer.
            </p>
          </div>
        </div>

        <Link
          href="/jobs"
          className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold transition"
        >
          Browse AI &amp; data jobs
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-center text-xs text-gray-500 mt-3">
          New AI and data roles across Malaysia and Singapore.
        </p>
      </div>

      {/* Secondary link */}
      <div className="mt-8 flex gap-6 text-sm">
        <Link href="/jobs" className="text-gray-500 hover:text-gray-700 transition underline underline-offset-2">
          Browse jobs
        </Link>
        <Link href="/" className="text-gray-500 hover:text-gray-700 transition underline underline-offset-2">
          Back to home
        </Link>
      </div>
    </section>
  );
}
