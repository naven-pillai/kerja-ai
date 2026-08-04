'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MapPin, BadgeCheck, Star, Lock, ArrowRight } from 'lucide-react';

import { JobWithCompany } from '@/types/custom';
import CompanyLogo from '@/components/common/CompanyLogo';
import RemoteTypePill from '@/components/common/RemoteTypePill';
import { formatSalaryRange } from '@/utils/formatSalary';
import { formatJobLocation } from '@/lib/formatLocation';
import { resolveSalaryCurrency } from '@/constants/job-filters';
import { seniorityFromTitle } from '@/utils/seniorityFromTitle';

dayjs.extend(relativeTime);

type Props = {
  job: JobWithCompany;
  showEarlyAccessBadge?: boolean;
};

export default function JobCard({ job, showEarlyAccessBadge = false }: Props) {
  const jobCategories = Array.isArray(job.job_category)
    ? job.job_category
    : job.job_category
      ? [job.job_category]
      : [];
  const jobCategory = jobCategories[0] ?? null;
  const jobType = Array.isArray(job.job_type) ? job.job_type[0] : job.job_type;
  const jobLocation = Array.isArray(job.job_location) ? job.job_location[0] : job.job_location;

  // "Kuala Lumpur, Malaysia" when a city is set; the country alone otherwise.
  const locationLabel = formatJobLocation(jobLocation, job.city);
  const seniority = seniorityFromTitle(job.title);

  // Falls back to the job's country when currency is unset, so a salary is never
  // a bare number with no currency.
  const currency = resolveSalaryCurrency(job.currency, jobLocation);
  const hasSalary = typeof job.min_salary === 'number' || typeof job.max_salary === 'number';
  const salary = hasSalary
    ? formatSalaryRange(job.min_salary ?? null, job.max_salary ?? null, currency ?? null)
    : null;

  // Up to two skills, dropping any that just repeat the category or job type so
  // the card does not say the same thing twice.
  const tags = Array.isArray(job.tags) ? job.tags : [];
  const redundant = new Set(
    [jobCategory, jobType].filter(Boolean).map((s) => s!.toLowerCase())
  );
  const skills = tags
    .filter((t) => t && !redundant.has(t.toLowerCase()))
    .slice(0, 2);

  const isFeatured = job.is_featured === true;
  const createdAt = job.created_at ? dayjs(job.created_at) : null;
  const isNew = createdAt !== null && dayjs().diff(createdAt, 'day') <= 2;

  const wrapper = isFeatured
    ? 'border-amber-200/80 bg-linear-to-b from-amber-50/60 to-white shadow-sm shadow-amber-100/60 hover:shadow-md hover:shadow-amber-100 hover:border-amber-300'
    : 'border-gray-100 bg-white hover:shadow-md hover:border-gray-300';

  const logoRing = isFeatured ? 'ring-amber-200' : 'ring-gray-200';

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl border transition-all duration-200 ${wrapper}`}
    >
      {isFeatured && (
        <div className="h-0.75 w-full bg-linear-to-r from-amber-400 via-[#1D4ED8] to-[#1D4ED8]" />
      )}

      <div className="flex gap-4 p-5">
        {/* Logo */}
        <div className="shrink-0">
          <CompanyLogo
            src={job.company?.logo_url || ''}
            alt={job.company?.name || 'Company Logo'}
            size={52}
            className={`h-12 w-12 rounded-xl bg-white shadow-sm ring-1 sm:h-13 sm:w-13 ${logoRing}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Top: company + verified · time */}
          <div className="flex items-start justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1 text-sm font-medium text-gray-600">
              <span className="truncate">{job.company?.name ?? 'Unknown company'}</span>
              <BadgeCheck
                className="h-3.5 w-3.5 shrink-0 text-[#14B8A6]"
                aria-label="Manually reviewed by Kerja AI"
              />
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {isNew && (
                <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  New
                </span>
              )}
              <span className="whitespace-nowrap text-[11px] text-gray-400">
                {createdAt ? createdAt.fromNow() : 'Recently'}
              </span>
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-1 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#1D4ED8]">
            {job.title}
          </h3>

          {/* Location · seniority */}
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-gray-500">
            {jobLocation && (
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {locationLabel}
              </span>
            )}
            {seniority && (
              <>
                {jobLocation && <span className="text-gray-300">·</span>}
                <span>{seniority}</span>
              </>
            )}
          </p>

          {/* Salary — the one figure a job seeker scans for, so it is bold green
              text, not a chip lost among the others. Work setup rides alongside. */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {salary ? (
              <span className="text-sm font-bold tracking-tight text-emerald-700">{salary}</span>
            ) : (
              <span className="text-sm text-gray-400">Salary undisclosed</span>
            )}
            <RemoteTypePill remoteType={job.remote_type} />
          </div>

          {/* Bottom: employment type + up to two skills. Category is not repeated
              here — the section context already carries it, and dropping it keeps
              the row to the few decision-relevant labels. */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {jobType && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                {jobType}
              </span>
            )}
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[11px] font-medium text-gray-500"
              >
                {skill}
              </span>
            ))}
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-amber-950 shadow-sm">
                <Star className="h-2.5 w-2.5 fill-amber-950 text-amber-950" />
                Featured
              </span>
            )}
            {showEarlyAccessBadge && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                <Lock className="h-2.5 w-2.5" />
                Early Access
              </span>
            )}
          </div>
        </div>

        {/* Hover arrow */}
        <div className="hidden shrink-0 items-center self-center sm:flex">
          <ArrowRight
            className={`h-4 w-4 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#1D4ED8] ${
              isFeatured ? 'text-amber-300' : 'text-gray-200'
            }`}
          />
        </div>
      </div>
    </Link>
  );
}
