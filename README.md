# Kerja-AI (public site)

The public job board for **artificial intelligence, machine learning and data careers in Malaysia and Singapore**. Sister site to [Kerja-Remote](https://kerja-remote.com). Built with Next.js 16 (App Router), React 19, Supabase, Tailwind v4, Resend and MailerLite.

Scope (Phase 1): **Jobs, Companies, Blog, Newsletter, and a free Post-a-Job form.**
Deferred: salary guides, candidate/talent directory, tools directory, Telegram alerts, paid/Stripe posting.

## Getting started

```bash
cp .env.example .env.local   # fill in your NEW Supabase project + keys
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # local dev
npm run build    # production build
npm run start    # serve production build
npm run lint
npm run test     # node test runner (request-security helpers)
SUPABASE_PROJECT_ID=<ref> npm run gen:types   # regenerate types/supabase.ts
```

## Structure

- `config/site.ts` — single source of truth for brand name, domain, emails, socials, palette
- `app/` — App Router pages + API routes (`/jobs`, `/companies`, `/blog`, `/newsletter`, `/post-job`, taxonomy hubs, `sitemap.ts`, `robots.ts`)
- `components/` — UI for jobs, companies, blog, newsletter, post-a-job, SEO
- `constants/job-filters.ts` — taxonomy: 11 AI role categories, `['Malaysia','Singapore']`, currencies
- `lib/` — Supabase clients, request hardening, SEO helpers
- `supabase/migrations/` — the database schema (see below)

## Database

Kerja-AI uses its **own** Supabase project — do not reuse the Kerja-Remote project. The full schema lives in `supabase/migrations/`:

- `00000000000001_init_schema.sql` — tables (jobs, companies, blogs, authors, categories, job_events, job_payments, newsletter_subscribers, job_ingestion), views, analytics functions, and **RLS enabled on every table** with scoped policies.
- `00000000000002_storage.sql` — public storage buckets (`company-logos`, `blog-images`, `featured_images`) and policies.

Apply to a fresh project:

```bash
supabase link --project-ref <NEW_REF>
supabase db push
```

The `jobs` table schema is intentionally identical to Kerja-Remote. Unlike Kerja-Remote, RLS is on from day one: anon can read only published jobs/blogs and public companies, insert a `pending` free job (moderation queue) and log analytics events — nothing else.

## Environment

See `.env.example`. Required: Supabase (URL, anon, service role), `NEXT_PUBLIC_SITE_URL`, Resend, MailerLite. Optional: TinyMCE, `REVALIDATION_SECRET`.

## Brand

Deep blue `#1D4ED8` → teal `#14B8A6`, sampled from the logo (`public/kerja-ai-logo.png`). Defined in `config/site.ts`.
