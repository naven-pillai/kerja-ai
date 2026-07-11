'use client';

import Link from 'next/link';
import Image from 'next/image';

type Company = {
  id: string;
  name: string;
  logoUrl?: string | null;
  companySlug: string;
  isHiring?: boolean;
  jobCount?: number;
  tagline?: string | null;
  industry?: string | null;
};

type CompanyCardProps = {
  company: Company;
  logoSize?: number;
  className?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase();
}

export default function CompanyCard({
  company,
  logoSize = 56,
  className = '',
}: CompanyCardProps) {
  const initials = getInitials(company.name);

  const hasJobCount = typeof company.jobCount === 'number';
  const jobCount = hasJobCount ? company.jobCount! : undefined;
  const hiring = hasJobCount ? (jobCount ?? 0) > 0 : company.isHiring === true;

  return (
    <Link
      href={`/companies/${company.companySlug}`}
      className={[
        'group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white',
        'transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg hover:border-gray-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2',
        className,
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-white opacity-100" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#1D4ED8]/10 blur-3xl" />

      <div className="relative p-5 sm:p-6">
        {/* Logo */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="relative shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm"
            style={{ width: logoSize + 14, height: logoSize + 14 }}
          >
            <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5" />
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.name}
                fill
                sizes={`${logoSize}px`}
                className="object-contain p-2 rounded-2xl"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-50 text-slate-700 font-bold">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Name + tagline */}
        <div className="mt-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#1D4ED8] transition">
            {company.name}
          </h3>

          {company.tagline && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {company.tagline}
            </p>
          )}
        </div>

        {/* Industry badge */}
        {company.industry && (
          <div className="mt-3">
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {company.industry}
            </span>
          </div>
        )}

        {/* Hiring badge */}
        {hiring && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {jobCount && jobCount > 0 ? `${jobCount} open role${jobCount !== 1 ? 's' : ''}` : 'Hiring now'}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
