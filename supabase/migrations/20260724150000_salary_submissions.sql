-- Anonymous salary submissions.
--
-- Kerja AI publishes salary bands for four categories only, because the other
-- seven have no credible local survey data. This table is how that changes:
-- enough real submissions and we can publish our own figures instead of leaning
-- on third-party guides.
--
-- ── Anonymity is structural, not a promise ──────────────────────────────────
-- There is deliberately no name, email, company name or IP column here. That
-- is not an oversight — the AI/data market in Malaysia and Singapore is small
-- enough that "Senior ML Engineer at <company> on RM15k" identifies one person.
-- Company *type* is collected instead of company name, which keeps the segment
-- useful for analysis without making anyone identifiable. Since nothing here
-- can be traced to a person, there is nothing to leak.
--
-- ── Access ─────────────────────────────────────────────────────────────────
-- RLS on with no policies at all: anon and authenticated can neither read nor
-- write. Inserts go through /api/salary-submission using the service-role key,
-- which bypasses RLS. That means submissions cannot be read back out through
-- PostgREST by anyone — a public read policy here would expose every salary
-- ever submitted.

create table if not exists public.salary_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Role. job_category is one of constants/job-filters.ts jobCategories —
  -- all eleven, not just the four we currently publish, since the point is to
  -- build data for the ones we cannot yet report on.
  job_category text not null,
  job_title text,

  -- Market. city is Malaysia-only, matching the rule used everywhere else
  -- (Singapore is a city-state).
  country text not null,
  city text,

  -- Pay. Gross monthly in local currency, which is how both markets quote it
  -- and how jobs.min_salary/max_salary are already stored.
  years_experience text not null,
  monthly_salary integer not null,
  currency text not null,

  -- Context that makes a figure interpretable.
  company_type text,
  work_arrangement text,
  bonus_months numeric(4, 1),

  -- Crowdsourced pay needs a human pass before it feeds anything public —
  -- typos, annual figures entered as monthly, and joke entries all happen.
  status text not null default 'pending'
);

comment on table public.salary_submissions is
  'Anonymous salary reports from the public form. No personally identifying columns by design. Review status before using in published figures.';

-- The analysis query this exists to serve: "what does <category> pay in
-- <country>", over approved rows.
create index if not exists idx_salary_submissions_category_country
  on public.salary_submissions (job_category, country, status);

alter table public.salary_submissions enable row level security;
