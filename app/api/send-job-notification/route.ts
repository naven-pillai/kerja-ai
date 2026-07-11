import { NextResponse } from 'next/server';
import { getResend } from '@/lib/resend';
import { z } from 'zod';
import {
  rejectCrossSiteRequest,
  rejectOversizedRequest,
  rejectRateLimitedRequest,
} from '@/lib/request-security';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@kerja-ai.com';
const FROM_EMAIL = process.env.RESEND_FROM || 'Kerja-AI <noreply@kerja-ai.com>';
const MAX_BODY_BYTES = 30 * 1024;

const Schema = z.object({
  jobTitle: z.string().min(3),
  companyName: z.string().min(2),
  contactEmail: z.string().email(),
  companyWebsite: z.string().url().optional().or(z.literal('')).optional(),
  applyUrl: z.string().url(),
  jobCategory: z.string().min(2),
  jobType: z.string().min(2),
  jobLocation: z.string().min(2),
  minSalary: z.union([z.number(), z.string()]).optional().nullable(),
  maxSalary: z.union([z.number(), z.string()]).optional().nullable(),
  tags: z.union([z.array(z.string()), z.string()]).optional().nullable(),
});

function escapeHtml(input: unknown) {
  const s = String(input ?? '');
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(req: Request) {
  try {
    const crossSiteResponse = rejectCrossSiteRequest(req);
    if (crossSiteResponse) return crossSiteResponse;

    const oversizedResponse = rejectOversizedRequest(req, MAX_BODY_BYTES);
    if (oversizedResponse) return oversizedResponse;

    const rateLimitResponse = rejectRateLimitedRequest(req, {
      namespace: 'send-job-notification',
      max: 6,
      windowMs: 30 * 60 * 1000,
    });
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    if (body?.website) {
      return NextResponse.json({ success: true });
    }

    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      jobTitle,
      companyName,
      contactEmail,
      companyWebsite,
      applyUrl,
      jobCategory,
      jobType,
      jobLocation,
      minSalary,
      maxSalary,
      tags,
    } = parsed.data;

    const tagsText = Array.isArray(tags) ? tags.join(', ') : (tags ?? '');
    const salaryText =
      minSalary || maxSalary ? `${minSalary ?? '—'} – ${maxSalary ?? '—'}` : 'Not provided';

    const safe = {
      jobTitle: escapeHtml(jobTitle),
      companyName: escapeHtml(companyName),
      contactEmail: escapeHtml(contactEmail),
      companyWebsite: escapeHtml(companyWebsite || ''),
      applyUrl: escapeHtml(applyUrl),
      jobCategory: escapeHtml(jobCategory),
      jobType: escapeHtml(jobType),
      jobLocation: escapeHtml(jobLocation),
      salaryText: escapeHtml(salaryText),
      tagsText: escapeHtml(tagsText),
    };

    const jobSummaryHtml = `
      <div style="font-family: ui-sans-serif, system-ui; line-height:1.6">
        <h2>📝 New Job Submission: ${safe.jobTitle}</h2>
        <p><strong>Company:</strong> ${safe.companyName}</p>
        <p><strong>Contact Email:</strong> ${safe.contactEmail}</p>
        ${companyWebsite ? `<p><strong>Website:</strong> <a href="${safe.companyWebsite}">${safe.companyWebsite}</a></p>` : ''}
        <p><strong>Job Type:</strong> ${safe.jobType}</p>
        <p><strong>Location:</strong> ${safe.jobLocation}</p>
        <p><strong>Category:</strong> ${safe.jobCategory}</p>
        <p><strong>Salary:</strong> ${safe.salaryText}</p>
        ${tagsText ? `<p><strong>Tags:</strong> ${safe.tagsText}</p>` : ''}
        <p><strong>Apply URL:</strong> <a href="${safe.applyUrl}">${safe.applyUrl}</a></p>
      </div>
    `;

    // Only ever mail the admin. This endpoint is public and unauthenticated, so
    // sending a confirmation to the request-supplied contactEmail would let
    // anyone relay mail from our domain, with an attacker-chosen subject, to any
    // recipient. The submitter's confirmation belongs on the moderation step,
    // once the address is known to be theirs.
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `🆕 New Job Posted: ${jobTitle}`,
      html: jobSummaryHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Email sending failed:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
