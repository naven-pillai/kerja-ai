'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { appendUTM } from '@/utils/appendUTM';
import { slugify } from '@/utils/slugify';
import { formatApplyUrl } from '@/utils/formatApplyUrl';
import { formatSalaryRange } from '@/utils/formatSalary';
import RemoteTypePill from '@/components/common/RemoteTypePill';

dayjs.extend(relativeTime);

type Props = {
  job: {
    postedOn?: string;
    applyBefore?: string;
    jobType?: string;
    remoteType?: string | null;
    category?: string;
    location?: string;
    tags?: string[];
    applyUrl?: string;
    title: string;
    slug?: string;

    // camelCase (what you used)
    minSalary?: number | string | null;
    maxSalary?: number | string | null;
    currency?: string | null;

    // snake_case (what Supabase usually returns)
    min_salary?: number | string | null;
    max_salary?: number | string | null;
  };
};

function getPostedLabel(postedOn?: string) {
  if (!postedOn) return '—';
  const parsedDate = dayjs(postedOn);
  return parsedDate.isValid() ? dayjs().to(parsedDate) : '—';
}

function formatExpiryDate(expiry?: string) {
  if (!expiry) return '—';
  const parsed = dayjs(expiry);
  return parsed.isValid() ? parsed.format('MMM D, YYYY') : '—';
}

function isExpired(expiry?: string) {
  return expiry ? dayjs().isAfter(dayjs(expiry).endOf('day')) : false;
}

function cleanLocation(input: unknown): string {
  if (!input) return '';

  const location =
    Array.isArray(input)
      ? input.join(' ')
      : typeof input === 'string'
      ? input
      : String(input);

  return location.replace(/^Remote\s*-\s*/i, '').trim();
}


function toNumber(val: number | string | null | undefined) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return Number.isFinite(val) ? val : null;
  const cleaned = String(val).replace(/[^\d.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export default function JobMetaBox({ job }: Props) {
  const expired = isExpired(job.applyBefore);

  const baseUrl = job.applyUrl
    ? formatApplyUrl({ url: job.applyUrl, jobTitle: job.title })
    : '#';

  const finalApplyUrl = appendUTM(baseUrl, {
    utm_source: 'kerja-ai',
    utm_medium: 'referral',
    utm_campaign: 'job-apply',
  });

  // ✅ Pick from camelCase OR snake_case
  const minRaw = job.minSalary ?? job.min_salary ?? null;
  const maxRaw = job.maxSalary ?? job.max_salary ?? null;
  const currency = job.currency ?? 'MYR';

  const min = toNumber(minRaw);
  const max = toNumber(maxRaw);

  // ✅ Salary string (may be empty depending on your formatter)
  const salaryText = formatSalaryRange(min, max, currency);

  // ✅ If you WANT salary to always show, use a fallback label:
  const salaryDisplay = salaryText || (min || max ? `${currency} ${min ?? ''}${min && max ? '–' : ''}${max ?? ''}` : '');

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">About the Job</h4>

      {expired && (
        <div className="bg-red-50 text-red-600 text-xs font-medium px-3 py-1.5 rounded-md">
          ⚠️ This role has closed. Applications may no longer be accepted.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Posted</span>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-md w-fit">
            {getPostedLabel(job.postedOn)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Apply Before</span>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-md w-fit ${
              expired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {formatExpiryDate(job.applyBefore)}
          </span>
        </div>

        {job.jobType && (
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Type</span>
            <Link
              href={`/job-type/${slugify(job.jobType)}`}
              className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-md hover:bg-blue-200 transition w-fit"
            >
              {job.jobType}
            </Link>
          </div>
        )}

        {job.remoteType && (
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Work Setup</span>
            <RemoteTypePill remoteType={job.remoteType} />
          </div>
        )}

        {job.category && (
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Category</span>
            <Link
              href={`/job-category/${slugify(job.category)}`}
              className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-md hover:bg-green-200 transition w-fit"
            >
              {job.category}
            </Link>
          </div>
        )}

        {job.location && (
          <div className="flex flex-col col-span-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Location</span>
            <Link
              href={`/job-location/${slugify(cleanLocation(job.location))}`}
              className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-md hover:bg-purple-200 transition w-fit"
            >
              {cleanLocation(job.location)}
            </Link>
          </div>
        )}
      </div>

      {job.tags && job.tags.length > 0 && (
        <div>
          <h5 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Skills / Tags</h5>
          <div className="flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-md transition"
              >
                {tag}
              </span>
            ))}
          </div>

          {salaryDisplay && (
            <div className="mt-2.5">
              <h5 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Salary</h5>
              <span className="inline-flex bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                {salaryDisplay}
              </span>
            </div>
          )}
        </div>
      )}

      {(!job.tags || job.tags.length === 0) && salaryDisplay && (
        <div>
          <h5 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Salary</h5>
          <span className="inline-flex bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-md">
            {salaryDisplay}
          </span>
        </div>
      )}

      {job.applyUrl && !expired && (
        <a
          href={
            job.slug && !finalApplyUrl.startsWith('mailto:')
              ? `/apply/${job.slug}`
              : finalApplyUrl
          }
          target={finalApplyUrl.startsWith('mailto:') ? '_self' : '_blank'}
          rel={finalApplyUrl.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className="block w-full text-center bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold py-2.5 rounded-lg text-sm transition"
        >
          {finalApplyUrl.startsWith('mailto:') ? 'Email your application' : 'Apply for this role'}
        </a>
      )}
    </div>
  );
}
