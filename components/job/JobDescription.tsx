'use client';

import '@/app/styles/job-description.css';
import { sanitize } from '@/lib/sanitize';
import { appendUTM } from '@/utils/appendUTM';
import { formatApplyUrl } from '@/utils/formatApplyUrl';
import dayjs from 'dayjs';

type Props = {
  description: string;
  applyUrl: string;
  expiresAt?: string;
  jobTitle: string;
  slug: string;
};

export default function JobDescription({ description, applyUrl, expiresAt, jobTitle, slug }: Props) {
  const isExpired = expiresAt ? dayjs().isAfter(dayjs(expiresAt)) : false;
  const cleanDescription = sanitize(description?.trim() ?? '');

  const finalApplyUrl = appendUTM(
    formatApplyUrl({ url: applyUrl, jobTitle }),
    {
      utm_source: 'kerja-ai',
      utm_medium: 'referral',
      utm_campaign: 'job-apply',
    }
  );

  const trackedApplyUrl = finalApplyUrl.startsWith('mailto:')
    ? finalApplyUrl
    : `/apply/${slug}`

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Description body */}
      <div className="px-6 pt-6 pb-2 md:px-8 md:pt-8">
        <div
          className="job-description"
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
        />
      </div>

      {/* Footer — expired warning or apply CTA */}
      <div className="px-6 py-5 md:px-8 border-t border-gray-100 bg-gray-50">
        {isExpired ? (
          <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 px-4 py-2.5 rounded-lg">
            ⚠️ This job listing has expired. Applications are no longer being accepted.
          </div>
        ) : (
          <a
            href={trackedApplyUrl}
            target={finalApplyUrl.startsWith('mailto:') ? '_self' : '_blank'}
            rel={finalApplyUrl.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="inline-block bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold py-2.5 px-7 rounded-lg text-sm transition cursor-pointer shadow-sm"
          >
            {finalApplyUrl.startsWith('mailto:') ? 'Send Email to Apply' : 'Apply Now →'}
          </a>
        )}
      </div>
    </div>
  );
}
