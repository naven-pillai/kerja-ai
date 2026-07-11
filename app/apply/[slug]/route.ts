import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { appendUTM } from '@/utils/appendUTM'
import { formatApplyUrl } from '@/utils/formatApplyUrl'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('id, apply_url, title')
    .eq('slug', slug)
    .maybeSingle()

  if (!job?.apply_url) return NextResponse.json({ error: 'not found' }, { status: 404 })

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
