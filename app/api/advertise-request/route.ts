import { NextRequest, NextResponse } from 'next/server';
import {
  isValidEmail,
  normalizeOptionalString,
  normalizeRequiredString,
  rejectCrossSiteRequest,
  rejectOversizedRequest,
  rejectRateLimitedRequest,
} from '@/lib/request-security';

const MAX_BODY_BYTES = 20 * 1024;

const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'proton.me', 'protonmail.com', 'aol.com', 'live.com', 'me.com', 'msn.com',
]);

function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return !!domain && PERSONAL_DOMAINS.has(domain);
}

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
    const crossSite = rejectCrossSiteRequest(req);
    if (crossSite) return crossSite;

    const oversized = rejectOversizedRequest(req, MAX_BODY_BYTES);
    if (oversized) return oversized;

    const rateLimited = rejectRateLimitedRequest(req, {
      namespace: 'advertise-request',
      max: 8,
      windowMs: 60 * 60 * 1000, // 8 per hour per IP
    });
    if (rateLimited) return rateLimited;

    const body = await req.json();
    const {
      name,
      companyName,
      email,
      website,
      whatPromoting,
      note,
      honeypot,
      slotId,
      slotName,
      slotPrice,
    } = body;

    if (honeypot) return NextResponse.json({ ok: true });

    const nameValue = normalizeRequiredString(name, 120);
    const companyValue = normalizeRequiredString(companyName, 120);
    const emailValue = normalizeRequiredString(email, 320)?.toLowerCase() ?? null;
    const websiteValue = normalizeOptionalString(website, 200);
    const whatPromotingValue = normalizeRequiredString(whatPromoting, 200);
    const noteValue = normalizeOptionalString(note, 2000);
    const slotIdValue = normalizeOptionalString(slotId, 60);
    const slotNameValue = normalizeOptionalString(slotName, 120);
    const slotPriceValue = typeof slotPrice === 'number' && slotPrice > 0 ? slotPrice : null;

    if (!nameValue || !companyValue || !emailValue || !whatPromotingValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidEmail(emailValue)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (isPersonalEmail(emailValue)) {
      return NextResponse.json(
        { error: 'Please use your work email (personal addresses are not accepted).' },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const inbox = process.env.CONTACT_INBOX || 'info@kerja-ai.com';

    if (apiKey) {
      const subject = slotNameValue
        ? `[Advertise] ${escapeHtml(companyValue)} → ${escapeHtml(slotNameValue)}`
        : `[Advertise] ${escapeHtml(companyValue)} — enquiry`;

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
          subject,
          html: `
            <div style="font-family:sans-serif;line-height:1.5;max-width:600px">
              <h2 style="margin:0 0 16px">New advertise enquiry</h2>

              ${
                slotNameValue
                  ? `<div style="background:#fff7f4;border:1px solid #f6c0b0;border-radius:8px;padding:12px 14px;margin-bottom:16px">
                       <p style="margin:0;font-size:12px;color:#a82607;text-transform:uppercase;letter-spacing:1px;font-weight:700">Slot</p>
                       <p style="margin:4px 0 0;font-weight:600">${escapeHtml(slotNameValue)}${
                         slotPriceValue ? ` — RM${slotPriceValue}` : ''
                       }</p>
                       ${slotIdValue ? `<p style="margin:4px 0 0;font-size:11px;color:#666">id: ${escapeHtml(slotIdValue)}</p>` : ''}
                     </div>`
                  : `<div style="background:#f7f7f7;border-radius:8px;padding:12px 14px;margin-bottom:16px;font-size:13px;color:#666">General enquiry — no specific slot selected</div>`
              }

              <table style="border-collapse:collapse;width:100%;font-size:14px">
                <tr><td style="padding:6px 0;color:#666;width:160px">Requester</td><td style="padding:6px 0;font-weight:600">${escapeHtml(nameValue)}</td></tr>
                <tr><td style="padding:6px 0;color:#666">Company</td><td style="padding:6px 0;font-weight:600">${escapeHtml(companyValue)}</td></tr>
                <tr><td style="padding:6px 0;color:#666">Work email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(emailValue)}">${escapeHtml(emailValue)}</a></td></tr>
                ${websiteValue ? `<tr><td style="padding:6px 0;color:#666">Website</td><td style="padding:6px 0"><a href="${escapeHtml(websiteValue)}">${escapeHtml(websiteValue)}</a></td></tr>` : ''}
                <tr><td style="padding:6px 0;color:#666">Promoting</td><td style="padding:6px 0">${escapeHtml(whatPromotingValue)}</td></tr>
              </table>

              ${
                noteValue
                  ? `<div style="margin-top:16px;padding:12px 14px;background:#f7f7f7;border-radius:8px">
                       <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:700">Note</p>
                       <p style="margin:0;white-space:pre-wrap;font-size:14px">${escapeHtml(noteValue)}</p>
                     </div>`
                  : ''
              }

              <p style="margin-top:20px;font-size:12px;color:#999">Reply directly to this email to respond to the advertiser.</p>
            </div>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const resendError = await resendResponse.text();
        throw new Error(resendError || 'Failed to send advertise request');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 },
    );
  }
}
