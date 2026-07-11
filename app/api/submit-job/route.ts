import { NextResponse } from 'next/server';
import { z } from 'zod';
import slugify from 'slugify';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  rejectCrossSiteRequest,
  rejectOversizedRequest,
  rejectRateLimitedRequest,
} from '@/lib/request-security';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 60 * 1024;

// Public, unauthenticated submission → always a FREE job in the moderation
// queue (status='pending'). Writes use the service-role client, so the anon
// INSERT policies on jobs/companies can be dropped. Rate-limited per IP.
const Schema = z.object({
  jobTitle: z.string().trim().min(3).max(200),
  companyName: z.string().trim().min(2).max(200),
  companyTagline: z.string().max(300).optional().default(''),
  companyWebsite: z.string().max(300).optional().default(''),
  companyFacebook: z.string().max(300).optional().default(''),
  companyX: z.string().max(300).optional().default(''),
  companyLinkedIn: z.string().max(300).optional().default(''),
  contactEmail: z.string().email().max(200),
  logoUrl: z.string().max(600).optional().default(''),
  jobCategory: z.string().max(100).optional().default(''),
  jobType: z.string().max(100).optional().default(''),
  jobLocation: z.string().max(100).optional().default(''),
  remoteType: z.string().max(50).optional().default('100% Remote'),
  currency: z.string().max(10).optional().default('MYR'),
  minSalary: z.union([z.number(), z.string()]).nullable().optional(),
  maxSalary: z.union([z.number(), z.string()]).nullable().optional(),
  tags: z.array(z.string().max(60)).max(20).optional().default([]),
  description: z.string().min(1).max(50000),
  applyUrl: z.string().url().max(600),
});

function toNum(v: unknown): number | null {
  if (v == null || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

async function uniqueSlug(title: string, company: string): Promise<string> {
  const base = slugify(`${title}-${company}`, { lower: true, strict: true }).slice(0, 90) || 'job';
  const { data } = await supabaseAdmin.from('jobs').select('id').eq('slug', base).maybeSingle();
  return data ? `${base}-${Date.now().toString(36)}` : base;
}

export async function POST(request: Request) {
  const crossSite = rejectCrossSiteRequest(request);
  if (crossSite) return crossSite;

  const oversized = rejectOversizedRequest(request, MAX_BODY_BYTES);
  if (oversized) return oversized;

  // Cap public submissions: 5 per hour per IP.
  const limited = rejectRateLimitedRequest(request, {
    namespace: 'submit-job',
    max: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  try {
    // Company: reuse an existing match by name or website, else create.
    let companyId: string | null = null;
    const { data: byName } = await supabaseAdmin
      .from('companies')
      .select('id')
      .ilike('name', d.companyName)
      .limit(1);
    if (byName?.length) {
      companyId = byName[0].id;
    } else if (d.companyWebsite) {
      const www = d.companyWebsite.includes('://www.')
        ? d.companyWebsite
        : d.companyWebsite.replace('://', '://www.');
      const nonWww = d.companyWebsite.replace('://www.', '://');
      const { data: byWeb } = await supabaseAdmin
        .from('companies')
        .select('id')
        .in('website', [d.companyWebsite, www, nonWww])
        .limit(1);
      if (byWeb?.length) companyId = byWeb[0].id;
    }

    if (!companyId) {
      const { data: newCo, error: coErr } = await supabaseAdmin
        .from('companies')
        .insert({
          name: d.companyName,
          slug: `${slugify(d.companyName, { lower: true, strict: true })}-${Math.random().toString(36).slice(2, 7)}`,
          tagline: d.companyTagline || null,
          website: d.companyWebsite || null,
          facebook: d.companyFacebook || null,
          twitter: d.companyX || null,
          linkedin: d.companyLinkedIn || null,
          logo_url: d.logoUrl || null,
          contact_email: d.contactEmail,
        })
        .select('id')
        .single();
      if (coErr) throw new Error(`Company create failed: ${coErr.message}`);
      companyId = newCo.id;
    }

    const slug = await uniqueSlug(d.jobTitle, d.companyName);

    const { error: jobErr } = await supabaseAdmin.from('jobs').insert({
      title: d.jobTitle,
      slug,
      job_category: d.jobCategory ? [d.jobCategory] : [],
      job_type: d.jobType ? [d.jobType] : [],
      job_location: d.jobLocation ? [d.jobLocation] : [],
      remote_type: d.remoteType || '100% Remote',
      currency: d.currency || 'MYR',
      min_salary: toNum(d.minSalary),
      max_salary: toNum(d.maxSalary),
      tags: d.tags,
      description: d.description,
      apply_url: d.applyUrl,
      company_id: companyId,
      status: 'pending',
      billing_plan: 'free',
    });
    if (jobErr) throw new Error(`Job insert failed: ${jobErr.message}`);

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Submission failed';
    console.error('[submit-job]', message);
    return NextResponse.json({ error: 'Could not submit the job. Please try again.' }, { status: 500 });
  }
}
