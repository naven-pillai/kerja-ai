import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { appendUTM } from '@/utils/appendUTM'
import { formatApplyUrl } from '@/utils/formatApplyUrl'

// Anyone can submit a job, so apply_url is attacker-controlled until a
// moderator publishes it. Redirecting on an unpublished row would turn
// /apply/<slug> into an open redirector on a trusted domain.
function isHttpUrl(url: string) {
  try {
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('id, apply_url, title')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!job?.apply_url || !isHttpUrl(job.apply_url)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const finalApplyUrl = appendUTM(
    formatApplyUrl({ url: job.apply_url, jobTitle: job.title }),
    {
      utm_source: 'kerja-ai',
      utm_medium: 'referral',
      utm_campaign: 'job-apply',
    }
  )

  await supabaseAdmin
    .from('job_events')
    .insert({ job_id: job.id, event_type: 'click' })

  return NextResponse.redirect(finalApplyUrl)
}
