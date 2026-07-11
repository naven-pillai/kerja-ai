/**
 * Company Enrichment Script
 * ─────────────────────────────────────────────────────────────
 * Reads all companies from Supabase, fetches each company's
 * website, and uses Claude Haiku to extract / generate:
 *   industry, company_size, hq_location, remote_policy,
 *   year_founded, careers_url, description
 *
 * Usage:
 *   node scripts/enrich-companies.mjs              # run for all missing companies
 *   node scripts/enrich-companies.mjs --dry-run    # preview without saving
 *   node scripts/enrich-companies.mjs --limit 5    # test on first 5
 *   node scripts/enrich-companies.mjs --slug stripe # run for one company
 *
 * Requirements: run from /kerja-ai root
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env.local ──────────────────────────────────────────
function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
  return env;
}

const env = loadEnv();

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ANTHROPIC_API_KEY) {
  console.error('❌  Missing env vars. Check .env.local for NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY');
  process.exit(1);
}

// ─── CLI flags ────────────────────────────────────────────────
const DRY_RUN  = process.argv.includes('--dry-run');
const limitArg = process.argv.indexOf('--limit');
const LIMIT    = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : null;
const slugArg  = process.argv.indexOf('--slug');
const SLUG     = slugArg !== -1 ? process.argv[slugArg + 1] : null;

// ─── Clients ──────────────────────────────────────────────────
const supabase  = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ─── Constants ───────────────────────────────────────────────
const DELAY_MS         = 600;   // between Claude calls
const FETCH_TIMEOUT_MS = 8000;  // per website fetch
const MAX_CONTENT_CHARS = 5000; // chars sent to Claude per page

const INDUSTRY_OPTIONS = [
  'SaaS', 'Fintech', 'E-commerce', 'Web3 / Crypto', 'Healthcare', 'Dev Tools',
  'EdTech', 'MarTech', 'HR Tech', 'LegalTech', 'Media & Content', 'Gaming',
  'Cybersecurity', 'AI / ML', 'Data & Analytics', 'Logistics & Supply Chain',
  'Travel & Hospitality', 'Real Estate', 'Climate & Sustainability', 'Other',
];

const SIZE_OPTIONS    = ['1–50', '51–200', '201–500', '501–1,000', '1,000+'];
const POLICY_OPTIONS  = ['Fully Remote', 'Hybrid-Remote', 'Remote-Friendly', 'Async-Friendly'];

// ─── HTML stripper ────────────────────────────────────────────
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Fetch website text ───────────────────────────────────────
async function fetchPage(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KerjaAIBot/1.0)' },
    });
    clearTimeout(timer);
    if (!res.ok) return '';
    const html = await res.text();
    return stripHtml(html).slice(0, MAX_CONTENT_CHARS);
  } catch {
    return '';
  }
}

async function fetchWebsiteContent(website) {
  if (!website) return '';
  const base = website.replace(/\/$/, '');

  // Try homepage + /about + /careers in parallel
  const [home, about, careers] = await Promise.all([
    fetchPage(base),
    fetchPage(`${base}/about`),
    fetchPage(`${base}/careers`),
  ]);

  return [home, about, careers]
    .filter(Boolean)
    .join('\n\n---\n\n')
    .slice(0, MAX_CONTENT_CHARS * 2);
}

// ─── Claude enrichment ────────────────────────────────────────
async function enrichWithClaude(company, websiteContent) {
  const prompt = `You are a company research assistant for Kerja-AI.com, a remote jobs board focused on APAC (Southeast Asia, India, East Asia, Australia).

Given the company information below, extract or infer the requested fields. Use the website content if available; otherwise rely on your training knowledge.

COMPANY NAME: ${company.name}
WEBSITE URL: ${company.website || 'not provided'}
EXISTING TAGLINE: ${company.tagline || 'none'}

WEBSITE CONTENT (may be partial or empty):
${websiteContent || '(no content fetched)'}

---

Return ONLY a valid JSON object with exactly these fields (no markdown, no extra text):

{
  "industry": one of ${JSON.stringify(INDUSTRY_OPTIONS)} or null,
  "company_size": one of ${JSON.stringify(SIZE_OPTIONS)} or null,
  "hq_location": "City, Country" string or null (e.g. "Singapore", "San Francisco, USA", "Global"),
  "remote_policy": one of ${JSON.stringify(POLICY_OPTIONS)} or null,
  "year_founded": "YYYY" string or null,
  "careers_url": full URL to their careers/jobs page or null,
  "description": "2–3 paragraph description (150–220 words). Paragraph 1: what the company does and its core products/mission. Paragraph 2: its remote work culture and why it's a good employer. Paragraph 3: why it's relevant to APAC job seekers. Write in third person, factual and neutral tone.",
  "confidence": "high" | "medium" | "low"
}

Rules:
- Use null for any field you are not reasonably confident about
- Do NOT invent founding years, sizes, or locations — use null if unsure
- careers_url should be a real URL pattern like https://company.com/careers or https://jobs.company.com
- confidence = "high" means you know the company well from training data or the website content is clear
- confidence = "low" means you have little data and are mostly guessing`;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.warn(`  ⚠️  JSON parse failed for ${company.name}. Raw:\n${raw.slice(0, 200)}`);
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔍  Company Enrichment Script`);
  console.log(`    Mode   : ${DRY_RUN ? '🟡 DRY RUN (no DB writes)' : '🟢 LIVE'}`);
  if (LIMIT) console.log(`    Limit  : ${LIMIT} companies`);
  if (SLUG)  console.log(`    Slug   : ${SLUG}`);
  console.log('');

  // Fetch companies
  let query = supabase
    .from('companies')
    .select('id, name, slug, website, tagline, description, industry')
    .order('name', { ascending: true });

  if (SLUG) {
    query = query.eq('slug', SLUG);
  } else {
    // Only process companies missing description (skip already enriched)
    query = query.is('description', null);
  }

  if (LIMIT) query = query.limit(LIMIT);

  const { data: companies, error } = await query;

  if (error) {
    console.error('❌  Supabase fetch error:', error.message);
    process.exit(1);
  }

  if (!companies || companies.length === 0) {
    console.log('✅  No companies need enrichment (all have descriptions already).');
    console.log('    To re-enrich, use --slug <slug> or manually clear the description field.');
    return;
  }

  console.log(`📋  Found ${companies.length} companies to enrich\n`);

  let successCount = 0;
  let skipCount    = 0;
  let errorCount   = 0;
  let totalTokens  = 0;

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const prefix = `[${String(i + 1).padStart(3, '0')}/${companies.length}]`;

    console.log(`${prefix} ${company.name}`);

    // Fetch website
    process.stdout.write(`         Fetching website...`);
    const websiteContent = await fetchWebsiteContent(company.website);
    const contentLen = websiteContent.length;
    process.stdout.write(` ${contentLen > 0 ? `${contentLen} chars` : 'no content'}\n`);

    // Call Claude
    process.stdout.write(`         Calling Claude...`);
    let result;
    try {
      result = await enrichWithClaude(company, websiteContent);
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      errorCount++;
      await sleep(DELAY_MS);
      continue;
    }

    if (!result) {
      console.log(`         ❌ Could not parse Claude response`);
      errorCount++;
      await sleep(DELAY_MS);
      continue;
    }

    const confidenceEmoji = result.confidence === 'high' ? '🟢' : result.confidence === 'medium' ? '🟡' : '🔴';
    console.log(` done ${confidenceEmoji} confidence:${result.confidence}`);

    // Show preview
    console.log(`         industry     : ${result.industry ?? '—'}`);
    console.log(`         size         : ${result.company_size ?? '—'}`);
    console.log(`         hq           : ${result.hq_location ?? '—'}`);
    console.log(`         policy       : ${result.remote_policy ?? '—'}`);
    console.log(`         founded      : ${result.year_founded ?? '—'}`);
    console.log(`         careers_url  : ${result.careers_url ?? '—'}`);
    console.log(`         description  : ${result.description ? result.description.slice(0, 80) + '…' : '—'}`);

    if (DRY_RUN) {
      console.log(`         [DRY RUN — not saved]\n`);
      skipCount++;
    } else {
      const updates = {};
      if (result.industry)      updates.industry      = result.industry;
      if (result.company_size)  updates.company_size  = result.company_size;
      if (result.hq_location)   updates.hq_location   = result.hq_location;
      if (result.remote_policy) updates.remote_policy = result.remote_policy;
      if (result.year_founded)  updates.year_founded  = result.year_founded;
      if (result.careers_url)   updates.careers_url   = result.careers_url;
      if (result.description)   updates.description   = result.description;
      updates.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id);

      if (updateError) {
        console.log(`         ❌ Supabase update failed: ${updateError.message}\n`);
        errorCount++;
      } else {
        console.log(`         ✅ Saved\n`);
        successCount++;
      }
    }

    await sleep(DELAY_MS);
  }

  // Summary
  console.log('─'.repeat(55));
  console.log(`✅  Done!`);
  console.log(`   Saved    : ${successCount}`);
  if (DRY_RUN) console.log(`   Previewed: ${skipCount} (dry run)`);
  console.log(`   Errors   : ${errorCount}`);
  console.log(`   Cost est : ~$${((successCount + skipCount) * 0.003).toFixed(2)} USD`);
  console.log('');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
