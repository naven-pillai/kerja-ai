-- Add city to jobs.
--
-- job_ingestion.city already exists — the scraper/AI pipeline extracts a city
-- and then drops it when a row is promoted into `jobs`. This carries it through.
--
-- Deliberately NOT replacing job_location: that stays the country-level axis
-- (Malaysia | Singapore) because currency is derived from it (MYR | SGD) and the
-- /job-location taxonomy is built on it. `city` is display precision on top,
-- nullable, and meaningless for 100% Remote roles. Singapore is a city-state and
-- should leave this null — "Singapore, Singapore" is not a thing.

alter table public.jobs
  add column if not exists city text;

comment on column public.jobs.city is
  'Optional city (Malaysia only, e.g. Kuala Lumpur, Penang, Johor Bahru). Country lives in job_location; currency derives from that. Null for remote roles and for Singapore.';

create index if not exists idx_jobs_city on public.jobs (city) where city is not null;
