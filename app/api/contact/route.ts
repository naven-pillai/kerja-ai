import { NextRequest, NextResponse } from 'next/server';
import {
  isValidEmail,
  normalizeOptionalString,
  normalizeRequiredString,
  rejectCrossSiteRequest,
  rejectOversizedRequest,
  rejectRateLimitedRequest,
} from '@/lib/request-security';

const MAX_BODY_BYTES = 50 * 1024;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: NextRequest) {
  try {
    const crossSiteResponse = rejectCrossSiteRequest(req);
    if (crossSiteResponse) return crossSiteResponse;

    const oversizedResponse = rejectOversizedRequest(req, MAX_BODY_BYTES);
    if (oversizedResponse) return oversizedResponse;

    const rateLimitResponse = rejectRateLimitedRequest(req, {
      namespace: 'contact-form',
      max: 4,
      windowMs: 15 * 60 * 1000,
    });
    if (rateLimitResponse) return rateLimitResponse;

    const { name, email, subject, message, topic, company, newsletter, website } = await req.json();

    if (website) return NextResponse.json({ ok: true }, { status: 200 }); // Honeypot

    const nameValue = normalizeRequiredString(name, 120);
    const emailValue = normalizeRequiredString(email, 320)?.toLowerCase() ?? null;
    const messageValue = normalizeRequiredString(message, 5000);
    const topicValue = normalizeOptionalString(topic, 120);
    const companyValue = normalizeOptionalString(company, 120);

    if (!nameValue || !emailValue || !messageValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidEmail(emailValue)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const inbox = process.env.CONTACT_INBOX || 'info@kerja-ai.com';

    const normalizedSubject =
      normalizeOptionalString(subject, 140)
        ? normalizeOptionalString(subject, 140)
        : 'General Contact Form Message';
    const wantsNewsletter = newsletter === true || newsletter === 'true';

    if (apiKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Kerja-AI <noreply@kerja-ai.com>',
          to: [inbox],
          reply_to: [emailValue],
          subject: `[Contact] ${escapeHtml(normalizedSubject)}`,
          html: `
            <div style="font-family:sans-serif;line-height:1.5">
              <h2>New Contact Message</h2>
              <p><strong>Name:</strong> ${escapeHtml(nameValue)}</p>
              <p><strong>Email:</strong> ${escapeHtml(emailValue)}</p>
              <p><strong>Company:</strong> ${escapeHtml(companyValue) || '-'}</p>
              <p><strong>Topic:</strong> ${escapeHtml(topicValue) || '-'}</p>
              <p><strong>Newsletter opt-in:</strong> ${wantsNewsletter ? 'Yes' : 'No'}</p>
              <hr style="margin:16px 0" />
              <p style="white-space:pre-wrap">${escapeHtml(messageValue)}</p>
            </div>`,
        }),
      });

      if (!resendResponse.ok) {
        const resendError = await resendResponse.text();
        throw new Error(resendError || 'Failed to send contact email');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
