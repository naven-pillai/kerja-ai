'use client';

import { useEffect, useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import type { AdSlot } from '@/components/advertise/AdvertiseSlotGrid';

type Props = {
  open: boolean;
  onClose: () => void;
  slot: AdSlot | null;
};

const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'proton.me', 'protonmail.com', 'aol.com', 'live.com', 'me.com', 'msn.com',
]);

function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return !!domain && PERSONAL_DOMAINS.has(domain);
}

export default function AdvertiseBookingModal({ open, onClose, slot }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatPromoting, setWhatPromoting] = useState('');
  const [note, setNote] = useState('');
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSubmitted(false);
        setError(null);
        setName('');
        setCompanyName('');
        setEmail('');
        setWebsite('');
        setWhatPromoting('');
        setNote('');
      }, 200);
      return () => clearTimeout(t);
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (isPersonalEmail(trimmedEmail)) {
      setError('Please use your work email (personal addresses are not accepted).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/advertise-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          companyName: companyName.trim(),
          email: trimmedEmail,
          website: website.trim(),
          whatPromoting: whatPromoting.trim(),
          note: note.trim(),
          honeypot,
          slotId: slot?.id ?? null,
          slotName: slot?.name ?? null,
          slotPrice: slot?.price ?? null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Could not send your request. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="advertise-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="p-7 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request sent</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Thanks! We&apos;ll review your request and get back to you at{' '}
              <span className="font-semibold text-gray-700">{email}</span> within 1 business day
              with next steps and invoicing details.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-3 rounded-xl transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1D4ED8]/10 mb-4 mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#1D4ED8]" />
            </div>

            <h2 id="advertise-title" className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-1">
              {slot ? `Book: ${slot.name}` : 'Tell us what you want to promote'}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
              {slot ? (
                <>
                  <span className="font-semibold text-gray-800">RM{slot.price}</span> · {slot.cadence}.
                  We&apos;ll confirm availability and send an invoice within 1 business day.
                </>
              ) : (
                'Reply within 1 business day. Personal email addresses not accepted.'
              )}
            </p>

            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <div className="space-y-3">
              <Field label="Your name" required>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  className="input-class"
                />
              </Field>

              <Field label="Company name" required>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Inc."
                  className="input-class"
                />
              </Field>

              <Field label="Work email" required hint="No personal addresses">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-class"
                />
              </Field>

              <Field label="Company website" hint="Optional but helpful">
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="input-class"
                />
              </Field>

              <Field label="What are you promoting?" required>
                <input
                  type="text"
                  required
                  value={whatPromoting}
                  onChange={(e) => setWhatPromoting(e.target.value)}
                  placeholder="e.g. SaaS launch · Talent platform · Bootcamp"
                  className="input-class"
                />
              </Field>

              <Field label="Anything else?" hint="Optional — timing, target audience, budget">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Tell us about your goals"
                  className="input-class resize-none"
                />
              </Field>
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Sending…' : slot ? `Request ${slot.name}` : 'Send request'}
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-3">
              No commitment. We&apos;ll confirm availability + send a quote.
            </p>

            <style>{`
              .input-class {
                width: 100%;
                padding: 10px 14px;
                border-radius: 8px;
                border: 1px solid #d1d5db;
                background: white;
                font-size: 14px;
                transition: all 0.15s;
              }
              .input-class:focus {
                outline: none;
                border-color: #1D4ED8;
                box-shadow: 0 0 0 2px rgba(223, 45, 6, 0.15);
              }
            `}</style>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-[#1D4ED8]">*</span>}
        </label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
