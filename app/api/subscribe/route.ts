import { NextResponse } from 'next/server'
import { getResend } from '@/lib/resend'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { resolveGroupIds, subscribe as mailerliteSubscribe } from '@/lib/mailerlite'
import { isNewsletterGroupSlug, newsletterGroupSlugs } from '@/constants/newsletter-groups'
import { normalizeSubscriberCountry } from '@/constants/newsletter-countries'
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

/**
 * Accept only slugs we know about. An unrecognised slug can't be silently
 * passed through — it would resolve to no MailerLite group, and the subscriber
 * would land in nothing and never receive an email.
 *
 * No categories (the compact email-only forms) means "everything".
 */
function normalizeCategories(input: unknown): string[] {
  if (!Array.isArray(input)) return [...newsletterGroupSlugs];
  const valid = input.filter(isNewsletterGroupSlug);
  return valid.length > 0 ? Array.from(new Set(valid)) : [...newsletterGroupSlugs];
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

  const { email, name, location, website, categories } = await req.json()

  // Honeypot — bots fill hidden fields. Report success so they don't retry.
  if (website) {
    return NextResponse.json({ message: 'Successfully subscribed!' })
  }

  const normalizedEmail = normalizeOptionalString(email, 320)?.toLowerCase() ?? null;
  const normalizedName = normalizeOptionalString(name, 120);
  const normalizedLocation = normalizeSubscriberCountry(location);
  const normalizedCategories = normalizeCategories(categories);

  if (!normalizedEmail) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }

  if (!isValidEmail(normalizedEmail)) {
    return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
  }

  // Kerja AI only lists jobs in Malaysia and Singapore, so we only take
  // subscribers there. Enforced here rather than only in the form: this
  // endpoint is public, and until now it accepted any country string at all —
  // which is how subscribers from outside the corridor got in.
  if (!normalizedLocation) {
    return NextResponse.json(
      { message: 'Kerja AI only covers Malaysia and Singapore. Please choose one to subscribe.' },
      { status: 400 }
    )
  }

  if (!process.env.MAILERLITE_API_KEY) {
    console.error('MAILERLITE_API_KEY is not configured');
    return NextResponse.json({ message: 'Subscription is unavailable right now' }, { status: 500 })
  }

  try {
    // 1. Resolve our slugs to MailerLite group ids by NAME.
    //
    // Falls back to the legacy single MAILERLITE_GROUP_ID when the per-category
    // groups don't exist yet, so this ships safely BEFORE the MailerLite groups
    // are created — signups keep working exactly as they do today.
    let groupIds = await resolveGroupIds(normalizedCategories);

    if (groupIds.length === 0) {
      const legacy = process.env.MAILERLITE_GROUP_ID;
      if (legacy) {
        groupIds = [legacy];
      } else {
        console.warn(
          '[subscribe] no MailerLite groups matched',
          normalizedCategories,
          '— subscriber will be created with no group'
        );
      }
    }

    const result = await mailerliteSubscribe({
      email: normalizedEmail,
      name: normalizedName,
      country: normalizedLocation,
      groupIds,
    });

    if (!result.ok) {
      // Log upstream detail server-side rather than reflecting it to the caller.
      console.error('MailerLite subscribe failed:', result.status, result.detail)
      return NextResponse.json({ message: 'Subscription failed' }, { status: 502 })
    }

    // 2. Save to Supabase.
    const { error: supabaseError } = await getSupabaseAdmin().from('newsletter_subscribers').upsert(
      {
        email: normalizedEmail,
        name: normalizedName,
        country: normalizedLocation,
        categories: normalizedCategories,
        source: 'website',
      },
      { onConflict: 'email' }
    );

    if (supabaseError) {
      // MailerLite already has them, so the subscription itself succeeded —
      // don't tell the user it failed just because our own copy didn't save.
      console.error('Supabase newsletter upsert error:', supabaseError);
    }

    // 3. Notify admin (best-effort — never fail the signup over this).
    try {
      await getResend().emails.send({
        from: 'Kerja AI <noreply@kerja-ai.com>',
        to: ADMIN_EMAIL,
        subject: '🆕 New Newsletter Subscriber',
        html: `
          <p><strong>Name:</strong> ${escapeHtml(normalizedName) || '-'}</p>
          <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
          <p><strong>Location:</strong> ${escapeHtml(normalizedLocation) || 'Unknown'}</p>
          <p><strong>Categories:</strong> ${escapeHtml(normalizedCategories.join(', '))}</p>
          <hr />
          <p>kerja-ai.com</p>
        `,
      })
    } catch (notifyError) {
      console.error('Admin notification failed (subscriber was still saved):', notifyError)
    }

    return NextResponse.json({ message: 'Successfully subscribed!' })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ message: 'Unexpected server error. Please try again.' }, { status: 500 })
  }
}
