'use client';

import Link from 'next/link';
import CompanyLogo from '@/components/common/CompanyLogo';
import { Building2, ArrowUpRight } from 'lucide-react';

type Props = {
  companyName: string;
  logoUrl?: string | null;
  companySlug?: string;
  jobCount?: number;
};

export default function CompanyCard({
  companyName,
  logoUrl,
  companySlug,
  jobCount,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header label */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100">
        <Building2 size={11} className="text-gray-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          About the Company
        </span>
      </div>

      {/* Company info */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <CompanyLogo
            src={logoUrl}
            alt={`${companyName} logo`}
            size={48}
            className="rounded-lg border border-gray-100 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-gray-900 leading-snug truncate">
              {companyName}
            </h4>
            {typeof jobCount === 'number' && jobCount > 0 && (
              <p className="text-[11px] text-gray-500 mt-0.5">
                {jobCount} open {jobCount === 1 ? 'role' : 'roles'}
              </p>
            )}
          </div>
        </div>

        {companySlug && (
          <Link
            href={`/companies/${companySlug}`}
            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-gray-200 hover:border-[#1D4ED8] hover:text-[#1D4ED8] text-xs font-semibold text-gray-600 transition-colors group"
          >
            View Company Profile
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
