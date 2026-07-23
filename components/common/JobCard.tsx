'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MapPin, Briefcase, Star, Lock, ArrowRight } from 'lucide-react';

import { JobWithCompany } from '@/types/custom';
import CompanyLogo from '@/components/common/CompanyLogo';
import RemoteTypePill from '@/components/common/RemoteTypePill';
import { formatSalaryRange } from '@/utils/formatSalary';
import { formatJobLocation } from '@/lib/formatLocation';
import { resolveSalaryCurrency } from '@/constants/job-filters';
import { categoryColorMap, jobTypeColorMap } from '@/lib/categoryStyles';

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
  const extraCategories = jobCategories.slice(1);
  const jobType = Array.isArray(job.job_type) ? job.job_type[0] : job.job_type;
  const jobLocation = Array.isArray(job.job_location) ? job.job_location[0] : job.job_location;
  // "Kuala Lumpur, Malaysia" when a city is set; the country alone otherwise
  // (Singapore, remote roles, and jobs that predate the city column).
  const locationLabel = formatJobLocation(jobLocation, job.city);
  // Falls back to the job's country when currency is unset, so a salary is
  // never rendered as a bare number with no idea which currency it is in.
  const currency = resolveSalaryCurrency(job.currency, jobLocation);

  const isFeatured = job.is_featured === true;
  const createdAt = job.created_at ? dayjs(job.created_at) : null;
  const isNew = createdAt !== null && dayjs().diff(createdAt, 'day') <= 2;

  const salary =
    typeof job.min_salary === 'number' || typeof job.max_salary === 'number'
      ? formatSalaryRange(job.min_salary ?? null, job.max_salary ?? null, currency ?? null)
      : null;

  const categoryColor =
    (jobCategory && categoryColorMap[jobCategory]) ?? 'bg-gray-100 text-gray-600';

  const jobTypeColor =
    (jobType && jobTypeColorMap[jobType]) ?? 'bg-gray-100 text-gray-600';

  if (isFeatured) {
    return (
      <Link
        href={`/jobs/${job.slug}`}
        className="group relative w-full flex flex-col overflow-hidden rounded-xl border border-amber-200/80 bg-linear-to-b from-amber-50/60 to-white shadow-sm shadow-amber-100/60 transition-all duration-200 hover:shadow-md hover:shadow-amber-100 hover:border-amber-300"
      >
        {/* Top gradient bar */}
        <div className="h-0.75 w-full bg-linear-to-r from-amber-400 via-[#1D4ED8] to-[#1D4ED8]" />

        <div className="flex flex-col sm:flex-row gap-4 p-5">
          {/* Company logo */}
          <div className="shrink-0">
            <CompanyLogo
              src={job.company?.logo_url || ''}
              alt={job.company?.name || 'Company Logo'}
              size={52}
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl ring-1 ring-amber-200 bg-white shadow-sm"
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-[#1D4ED8] transition-colors">
                {job.title}
              </h3>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                {isNew && (
                  <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">NEW</span>
                )}
                <span className="text-[11px] text-gray-500 whitespace-nowrap">
                  {createdAt ? createdAt.fromNow() : 'Recently'}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-medium text-gray-600">{job.company?.name ?? 'Unknown company'}</span>
              {jobLocation && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {locationLabel}
                  </span>
                </>
              )}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3 items-center">
              {/* Featured badge — solid */}
              <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                <Star className="w-2.5 h-2.5 fill-amber-950 text-amber-950" />
                Featured
              </span>
              {showEarlyAccessBadge && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-[#1D4ED8] border border-blue-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5" />
                  Early Access
                </span>
              )}
              <RemoteTypePill remoteType={job.remote_type} />
              {jobType && (
                <span className={`${jobTypeColor} text-[11px] font-medium px-2.5 py-0.5 rounded-full`}>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-2.5 h-2.5" />
                    {jobType}
                  </span>
                </span>
              )}
              {jobCategory && (
                <span className={`${categoryColor} text-[11px] font-medium px-2.5 py-0.5 rounded-full`}>
                  {jobCategory}
                </span>
              )}
              {extraCategories.slice(0, 1).map((cat) => (
                <span key={cat} className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                  {cat}
                </span>
              ))}
              {extraCategories.length > 1 && (
                <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                  +{extraCategories.length - 1}
                </span>
              )}
              {salary && (() => {
                const match = salary.match(/^([^\d]*)(.+)$/);
                const prefix = match?.[1] ?? '';
                const amount = match?.[2] ?? salary;
                return (
                  <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full">
                    <span className="font-normal">{prefix}</span>
                    <span className="font-bold tracking-tight">{amount}</span>
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden sm:flex items-center self-center shrink-0">
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
        </div>

        {/* Mobile date */}
        <div className="flex sm:hidden items-center justify-between text-xs text-gray-500 px-5 pb-4 -mt-1">
          {isNew
            ? <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">NEW</span>
            : <span />
          }
          <span className="text-[11px]">{createdAt ? createdAt.fromNow() : 'Recently'}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group relative w-full flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300"
    >
      {/* Company logo */}
      <div className="shrink-0">
        <CompanyLogo
          src={job.company?.logo_url || ''}
          alt={job.company?.name || 'Company Logo'}
          size={52}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl ring-1 ring-gray-200 bg-white shadow-sm"
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-gray-900 leading-snug group-hover:text-[#1D4ED8] transition-colors">
            {job.title}
          </h3>

          {/* Date + NEW — desktop */}
          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
            {isNew && (
              <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                NEW
              </span>
            )}
            <span className="text-[11px] text-gray-500 whitespace-nowrap">
              {createdAt ? createdAt.fromNow() : 'Recently'}
            </span>
          </div>
        </div>

        {/* Company + location */}
        <p className="text-sm text-gray-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-medium text-gray-600">{job.company?.name ?? 'Unknown company'}</span>
          {jobLocation && (
            <>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {locationLabel}
              </span>
            </>
          )}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mt-3 items-center">
          {showEarlyAccessBadge && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-[#1D4ED8] border border-blue-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              <Lock className="w-2.5 h-2.5" />
              Early Access
            </span>
          )}
          <RemoteTypePill remoteType={job.remote_type} />
          {jobType && (
            <span className={`${jobTypeColor} text-[11px] font-medium px-2.5 py-0.5 rounded-full`}>
              <span className="flex items-center gap-1">
                <Briefcase className="w-2.5 h-2.5" />
                {jobType}
              </span>
            </span>
          )}
          {jobCategory && (
            <span className={`${categoryColor} text-[11px] font-medium px-2.5 py-0.5 rounded-full`}>
              {jobCategory}
            </span>
          )}
          {extraCategories.slice(0, 1).map((cat) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              {cat}
            </span>
          ))}
          {extraCategories.length > 1 && (
            <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
              +{extraCategories.length - 1}
            </span>
          )}
          {salary && (() => {
            const match = salary.match(/^([^\d]*)(.+)$/);
            const prefix = match?.[1] ?? '';
            const amount = match?.[2] ?? salary;
            return (
              <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full">
                <span className="font-normal opacity-70">{prefix}</span>
                <span className="font-bold tracking-tight">{amount}</span>
              </span>
            );
          })()}
        </div>
      </div>

      {/* Arrow — desktop hover indicator */}
      <div className="hidden sm:flex items-center self-center shrink-0">
        <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all duration-200" />
      </div>

      {/* Date + NEW — mobile */}
      <div className="flex sm:hidden items-center justify-between text-xs text-gray-500 mt-1">
        {isNew
          ? <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">NEW</span>
          : <span />
        }
        <span className="text-[11px]">{createdAt ? createdAt.fromNow() : 'Recently'}</span>
      </div>
    </Link>
  );
}
