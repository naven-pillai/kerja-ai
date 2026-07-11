import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { secret?: string; slug?: string }

  if (!process.env.REVALIDATION_SECRET || body.secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/jobs')

  return NextResponse.json({ revalidated: true, slug: body.slug ?? null })
}
