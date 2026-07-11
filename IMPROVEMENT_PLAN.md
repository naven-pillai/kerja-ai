# Kerja-AI: Full Analysis & Improvement Plan

> Generated: 2026-03-21
> Covers: `kerja-ai` (front-end) and `kerja-ai-admin` (admin panel)

---

## Current State Summary

### Front-end (`kerja-ai`)

**Stack:** Next.js 16, App Router, TypeScript, Tailwind v4, Supabase, Stripe, Anthropic SDK, Framer Motion, Resend

**Pages covered:**
- `/` — Hero, GridHighlights, FeaturedJobs, LatestBlog, NewsletterCTA
- `/jobs`, `/jobs/[slug]` — Listings with filters, detailed job view with sidebar
- `/talents`, `/talents/[slug]`, `/talents/signup` — Talent directory + signup
- `/tools`, `/tools/[slug]` — Tool directory (pricing filter not yet implemented)
- `/remote-companies`, `/remote-companies/[slug]` — Company directory
- `/remote-salary/...` — Salary insight pages
- `/blog`, `/blog/[slug]` — Blog with reading progress, social share
- `/telegram-alerts` — Paid Telegram alert subscription (Stripe)
- `/post-job` — Paid job posting (Stripe)
- `/preferences/...` — Multi-step job preference flow
- Sitemaps (5 separate), robots, JSON-LD structured data ✓
- AI: Claude for job/blog summarisation ✓
- Analytics: Clicky + Vercel Speed Insights ✓

### Admin (`kerja-ai-admin`)

**Stack:** Same core, plus Recharts, jsPDF, jspdf-autotable

**Sections:**
- **Dashboard** — Stat cards (jobs/companies/blog/tools), job plans purchased, expiring jobs panel, top viewed/clicked jobs, monthly bar charts, expense widget, recent activity feed
- **Jobs** — CRUD, status tabs (all/published/pending/draft/archived), category filter, debounced search, view/click stats, featured toggle, paginated
- **Companies** — CRUD table
- **Candidates** — Talent profile management
- **Blog** — TinyMCE editor, CRUD
- **Tools** — CRUD
- **Affiliates** — Page exists (stub)
- **Revenue** — KPIs, monthly bar chart (6/12M toggle), plan mix breakdown, filterable table
- **Expenses** — Monthly tracking, PDF export, live MYR exchange rate, grand total/YTD/current month
- **P&L** — Composed chart (revenue bars + expense bars + net profit line), month-by-month table
- **Navigation** — Sidebar with grouped nav (Overview / Manage / Finance / Content), ⌘K command search, mobile nav

---

## Gaps & Issues Found

### Front-end

| # | Area | Issue |
|---|------|-------|
| 1 | **Tools page** | Pricing filter is a placeholder comment — never implemented (`ToolsPageClient.tsx`) |
| 2 | **Tools page** | No mobile filter drawer (sidebar is `hidden md:block` only) |
| 3 | **Tools search** | No debounce, no URL-persisted filter state |
| 4 | **Job alerts** | Telegram-only (paid) — no free email alert tier |
| 5 | **Saved jobs** | No bookmarking/wishlist at all |
| 6 | **Talent profiles** | No availability badge, no "open to work" status toggle |
| 7 | **Home** | No testimonials/social proof section beyond the small pill counter |
| 8 | **Home** | No animated stats counters |
| 9 | **Blog** | No inline newsletter subscribe within article body |
| 10 | **Salary pages** | No chart visualisation — text data only |
| 11 | **SEO** | Missing BreadcrumbList structured data on taxonomy & detail pages |
| 12 | **Post-a-job** | No live preview of how listing will look before payment |
| 13 | **Company pages** | No "open roles count" badge on listing card |
| 14 | **UX** | No scroll-to-top button on long pages (jobs, blog, talent) |
| 15 | **Performance** | Tools and talent pages load all records with no pagination |

### Admin

| # | Area | Issue | Status |
|---|------|-------|--------|
| 1 | **Dashboard** | No newsletter subscriber count stat card | Open |
| 2 | **Dashboard** | No talent/candidate count card | Open |
| 3 | **Jobs** | No bulk actions (bulk publish, bulk archive, bulk delete) | Open |
| 4 | **Jobs** | No scheduling — can't set a future `goes_public_at` from the UI | Done |
| 5 | **Blog** | No scheduled publish date picker in UI | Open |
| 6 | **Candidates** | No approval/rejection workflow with notes | Open |
| 7 | **Revenue** | `paid_at` field used inconsistently — some rows use `created_at` for revenue date | Open |
| 8 | **Revenue** | No Stripe webhook event log to audit payment issues | Open |
| 9 | **Affiliates** | Likely empty/stub — no referral tracking, commission management | Open |
| 10 | **Analytics** | No view-to-apply conversion rate per job | **Done** |
| 11 | **Analytics** | No Telegram subscriber breakdown by region/plan | Open |
| 12 | **Expenses** | No expense categories (just service names) | Open |
| 13 | **Content** | No AI one-click SEO optimisation for job descriptions from edit page | Open |
| 14 | **Auth** | Login page has no "forgot password" link | Open |
| 15 | **UX** | No confirmation before navigating away from unsaved job/blog edits | Open |

---

## Improvement Plan

### Priority 1 — Quick Wins (high impact, low effort)

**Front-end:**
- [ ] Fix tools pricing filter — wire up the existing `pricing` filter state to actually filter by `pricing_type`
- [ ] Add tools mobile drawer — same pattern as the jobs mobile filter drawer
- [ ] Tools search bar — add debounced client-side name search above the grid
- [ ] Salary page charts — replace text-only salary ranges with a simple bar chart (Recharts already installed)
- [ ] BreadcrumbList JSON-LD — add to `/tools/[slug]`, `/jobs/[slug]`, `/blog/[slug]`, `/remote-companies/[slug]`
- [ ] Scroll-to-top button — floating button on `/jobs`, `/talents`, `/blog`
- [ ] "Open roles" count badge on company cards in `/remote-companies` listing

**Admin:**
- [x] View-to-apply conversion rate per job — shown in Stats column of JobTable
- [ ] Newsletter subscriber card on dashboard
- [ ] Talent/candidate stat card — add to the 4-card grid
- [ ] Forgot password link on login page
- [ ] AI SEO optimise button on job edit page — one-click generate `seo_title` + `seo_description` using Anthropic SDK (already installed)

---

### Priority 2 — High Impact Features

**Front-end:**
- [ ] **Saved jobs (localStorage)** — "Save" bookmark button on job cards and job detail page; persist to `localStorage`; add `/saved-jobs` page. No auth required, low friction.
- [ ] **Free email job alerts** — lightweight opt-in at bottom of `/jobs` page. Store in Supabase `preferences` table, use Resend to send weekly digest. Lower barrier than Telegram paid tier.
- [ ] **Inline newsletter CTA in blog posts** — after the first 3 paragraphs, inject a styled subscribe card
- [ ] **Talent "open to work" status** — add a green indicator badge on talent cards when `available_from` is upcoming/now
- [ ] **Home testimonials section** — 3 quote cards from real job seekers/hirers between GridHighlights and FeaturedJobs

**Admin:**
- [ ] **Job scheduling UI** — add a datetime picker for `goes_public_at` in the job edit form (field exists in DB, not editable from admin)
- [ ] **Bulk job actions** — multi-select checkboxes in JobTable → bulk publish / archive / delete
- [ ] **Candidate approval workflow** — Add Approve/Reject buttons with optional notes on candidate detail page; update `status` field
- [ ] **Sort jobs by conversion rate** — make the conversion rate column sortable in JobTable

---

### Priority 3 — Differentiation & Stand-Out Features

**Front-end:**
- [ ] **AI Job Match quiz** — a 3-question wizard (role, location, experience level) → scores and ranks open jobs via Anthropic. Lives at `/match` or as a modal on the home hero.
- [ ] **Salary comparison chart page** — at `/remote-salary/[category]`, show a grouped bar chart of min/max salary ranges by location using real job data
- [ ] **Company "hiring now" badge** — on company listing cards, badge when they've posted a job in the last 30 days
- [ ] **Job application tracker** — let users log `applied`, `interview`, `offer`, `rejected` states for any job (localStorage or Supabase with auth)
- [ ] **SEO category hub pages** — richer `/job-categories/[slug]` pages with: top companies hiring, average salary, trending skills, paginated job list

**Admin:**
- [ ] **Affiliate management** — proper referral code system: generate codes, track clicks/conversions, see commission owed
- [ ] **Telegram subscriber analytics** — table of who subscribed, which region/plan, churn view
- [ ] **Revenue → Stripe webhook log** — read-only table of recent Stripe events to diagnose missed payments
- [ ] **Content calendar** — monthly calendar view showing scheduled blog posts and jobs going live

---

### Priority 4 — Technical Debt & Architecture

**Front-end:**
- [ ] **URL-persisted filters on `/jobs`** — sync `category`, `type`, `location` to URL params so filtered pages are shareable and back-button works
- [ ] **ISR for job detail pages** — add `revalidate = 3600` to avoid re-fetching on every request for popular pages
- [ ] **Pagination for `/talents`** — currently loads all talent records; add server-side pagination
- [ ] **Remove duplicate sidebar** — `jobs/[slug]/page.tsx` has identical mobile/desktop sidebar code; extract to a single `<JobSidebar>` component

**Admin:**
- [ ] **Route protection via middleware** — move session checks to a single `middleware.ts` instead of per-route redirects
- [ ] **Unsaved changes warning** — use `useBeforeUnload` hook on job/blog edit pages
- [ ] **Consistent Supabase client** — admin uses 3 different patterns (`createSupabaseClient`, `createClient`, `createSupabaseBrowserClient`); normalise to one

---

## What Would Make It Stand Out Most

Against other APAC job boards (JobStreet, MyCareersFuture, Tech In Asia), the biggest differentiators are:

1. **Curated quality** — Already the core brand. Lean into it more visibly: show a "Verified by KR team" badge on every listing.
2. **AI job matching** — No other APAC niche job board has this. A 3-question wizard that scores open jobs is genuinely novel.
3. **Salary transparency** — Most boards hide salaries. Kerja-AI already collects them. Make salary charts the hero of `/remote-salary` — it's an SEO magnet.
4. **Talent directory** — Having both employers AND talent in one place is a moat. The talent approval workflow + "available now" badge makes it actually usable for hiring.
5. **The P&L dashboard** — The depth of admin financial tracking (revenue/expenses/P&L with charts) means the business is operated with data, enabling smart reinvestment decisions.
