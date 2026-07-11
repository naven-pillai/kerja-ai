import { NextResponse } from 'next/server'
import { getResend } from '@/lib/resend'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import {
  isValidEmail,
  normalizeOptionalString,
  rejectCrossSiteRequest,
  rejectOversizedRequest,
  rejectRateLimitedRequest,
} from '@/lib/request-security'

const ADMIN_EMAIL = 'info@kerja-ai.com'
const MAX_BODY_BYTES = 20 * 1024;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
  const crossSiteResponse = rejectCrossSiteRequest(req);
  if (crossSiteResponse) return crossSiteResponse;

  const oversizedResponse = rejectOversizedRequest(req, MAX_BODY_BYTES);
  if (oversizedResponse) return oversizedResponse;

  const rateLimitResponse = rejectRateLimitedRequest(req, {
    namespace: 'newsletter-subscribe',
    max: 8,
    windowMs: 30 * 60 * 1000,
  });
  if (rateLimitResponse) return rateLimitResponse;

  const { email, name, location, website } = await req.json()

  if (website) {
    return NextResponse.json({ message: 'Successfully subscribed!' })
  }

  const normalizedEmail = normalizeOptionalString(email, 320)?.toLowerCase() ?? null;
  const normalizedName = normalizeOptionalString(name, 120);
  const normalizedLocation = normalizeOptionalString(location, 120);

  if (!normalizedEmail) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }

  if (!isValidEmail(normalizedEmail)) {
    return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
  }

  const API_KEY = process.env.MAILERLITE_API_KEY
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID

  if (!API_KEY || !GROUP_ID) {
    return NextResponse.json(
      { message: 'Missing MAILERLITE_API_KEY or MAILERLITE_GROUP_ID in environment' },
      { status: 500 }
    )
  }

  try {
    // 1. Subscribe to MailerLite
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email: normalizedEmail,
        name: normalizedName,
        resubscribe: true,
        groups: [GROUP_ID],
        fields: {
          country: normalizedLocation || '',
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      // Log upstream (MailerLite) detail server-side rather than reflecting it.
      console.error('MailerLite subscribe failed:', res.status, data)
      return NextResponse.json({ message: 'Subscription failed' }, { status: res.status })
    }

    // 2. Save to Supabase
    const { error: supabaseError } = await getSupabaseAdmin().from('newsletter_subscribers').upsert(
      {
        email: normalizedEmail,
        name: normalizedName,
        country: normalizedLocation,
        source: 'website',
      },
      { onConflict: 'email' }
    );

    if (supabaseError) {
      console.error('Supabase newsletter upsert error:', supabaseError);
      return NextResponse.json({ message: 'Failed to save subscriber' }, { status: 500 })
    }

    // 3. Send email notification to admin
    await getResend().emails.send({
      from: 'Kerja-AI <noreply@kerja-ai.com>',
      to: ADMIN_EMAIL,
      subject: '🆕 New Newsletter Subscriber',
      html: `
        <p><strong>Name:</strong> ${escapeHtml(normalizedName) || '-'}</p>
        <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
        <p><strong>Location:</strong> ${escapeHtml(normalizedLocation) || 'Unknown'}</p>
        <hr />
        <p>Kerja-AI.com</p>
      `,
    })

    return NextResponse.json({ message: 'Successfully subscribed!' })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ message: 'Unexpected server error. Please try again.' }, { status: 500 })
  }
}
