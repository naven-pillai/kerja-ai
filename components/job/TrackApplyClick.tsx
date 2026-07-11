'use client'

import React from "react"
import { appendUTM } from '@/utils/appendUTM'

export function TrackApplyClick({
  jobId,
  applyUrl,
  children,
  className,
}: {
  jobId: string
  applyUrl: string
  children: React.ReactNode
  className?: string
}) {
  const handleClick = async () => {
    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId }),
    })

    if (applyUrl.startsWith('mailto:')) {
      window.location.href = applyUrl
    } else {
      const finalUrl = appendUTM(applyUrl, {
        utm_source: 'kerja-ai',
        utm_medium: 'referral',
        utm_campaign: 'job-apply',
      })
      window.open(finalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
