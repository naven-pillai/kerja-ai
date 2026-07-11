'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import AdvertiseBookingModal from '@/components/advertise/AdvertiseBookingModal';

export default function AdvertiseFooterCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="book" className="py-16 md:py-24 bg-linear-to-br from-[#1e0a02] via-[#3b0d00] to-[#1D4ED8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Ready to reach AI and data talent in Malaysia and Singapore?
          </h2>
          <p className="mt-4 text-base text-white/80 max-w-xl mx-auto">
            Send a note and we&apos;ll reply within 1 business day with availability,
            mockups, and an invoice.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="mailto:info@kerja-ai.com?subject=Advertise%20with%20Kerja%20Remote"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              <Mail className="w-4 h-4" />
              info@kerja-ai.com
            </a>
          </div>

          <p className="mt-6 text-xs text-white/50">
            No commitment · No procurement bureaucracy · Reply within 1 business day
          </p>
        </div>
      </section>

      <AdvertiseBookingModal open={open} onClose={() => setOpen(false)} slot={null} />
    </>
  );
}
