import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MapPin, BadgeCheck, Star } from 'lucide-react';
import CompanyLogo from '@/components/common/CompanyLogo';
import RemoteTypePill from '@/components/common/RemoteTypePill';
import { seniorityFromTitle } from '@/utils/seniorityFromTitle';
import { slugify } from '@/utils/slugify';

dayjs.extend(relativeTime);

type Props = {
  title: string;
  companyName: string;
  companyLogo: string;
  companySlug: string;
  locationLabel: string;
  jobCategory: string | null;
  remoteType: string | null;
  jobType: string | null;
  isFeatured: boolean;
  datePosted: string;
};

/**
 * The job-detail header — a clean introduction, not a control panel. It answers
 * what the job is, who it's with and where it is. Apply lives in the sidebar and
 * at the foot of the description; salary in the sidebar facts box. Both are kept
 * out of here on purpose so the introduction stays uncluttered and the apply
 * action isn't repeated three times down the page.
 *
 * A featured role carries an amber border, tint and top bar, and a Featured
 * badge lifted out to the top-right corner where it reads as a status on the
 * whole card rather than one chip among the meta.
 */
export default function JobDetailHeader({
  title,
  companyName,
  companyLogo,
  companySlug,
  locationLabel,
  jobCategory,
  remoteType,
  jobType,
  isFeatured,
  datePosted,
}: Props) {
  const seniority = seniorityFromTitle(title);
  const posted = datePosted ? dayjs(datePosted) : null;

  return (
    <header
      className={`relative overflow-hidden rounded-2xl border shadow-sm ${
        isFeatured
          ? 'border-amber-300 bg-linear-to-b from-amber-50/50 to-white'
          : 'border-gray-200 bg-white'
      }`}
    >
      {isFeatured && (
        <div className="h-1 w-full bg-linear-to-r from-amber-400 via-amber-400 to-[#1D4ED8]" />
      )}

      <div className="p-6 md:p-8">
        <div className="mb-5 flex items-start justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-gray-500"
          >
            <Link href="/jobs" className="hover:text-[#1D4ED8]">Jobs</Link>
            {jobCategory && (
              <>
                <span className="text-gray-300">/</span>
                <Link href={`/job-categories/${slugify(jobCategory)}`} className="hover:text-[#1D4ED8]">
                  {jobCategory}
                </Link>
              </>
            )}
            <span className="text-gray-300">/</span>
            <span className="truncate text-gray-700">{title}</span>
          </nav>

          {isFeatured && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950 shadow-sm">
              <Star className="h-3 w-3 fill-amber-950" />
              Featured
            </span>
          )}
        </div>

        <div className="flex gap-4 md:gap-5">
          <CompanyLogo
            src={companyLogo}
            alt={companyName}
            size={64}
            className={`h-14 w-14 shrink-0 rounded-xl bg-white shadow-sm ring-1 md:h-16 md:w-16 ${
              isFeatured ? 'ring-amber-200' : 'ring-gray-200'
            }`}
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                href={`/companies/${companySlug}`}
                className="text-sm font-semibold text-gray-700 hover:text-[#1D4ED8]"
              >
                {companyName}
              </Link>
              <span
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0d9488]"
                title="Every listing on Kerja AI is manually reviewed"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                Reviewed
              </span>
            </div>

            <h1 className="mt-1.5 font-body text-2xl font-bold leading-tight text-gray-900 md:text-[28px]">
              {title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600">
              {locationLabel && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  {locationLabel}
                </span>
              )}
              <RemoteTypePill remoteType={remoteType} />
              {seniority && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[13px] font-medium text-gray-600">
                  {seniority}
                </span>
              )}
              {jobType && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[13px] font-medium text-gray-600">
                  {jobType}
                </span>
              )}
            </div>

            {posted && <p className="mt-3 text-xs text-gray-400">Posted {posted.fromNow()}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}
