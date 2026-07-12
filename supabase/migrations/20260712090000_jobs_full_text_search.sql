-- Full-text search over jobs, including the description body.
--
-- Why not just search descriptions in the browser: the /jobs board loads every
-- published job, so shipping descriptions to the client costs ~4.5 KB per job —
-- 0.9 MB at 200 jobs, 2.2 MB at 500. Postgres does the matching and returns only
-- ids, so the payload stays flat as the board grows.
--
-- The vector is a GENERATED column, so it can never drift out of sync with the
-- row: no trigger to forget, no backfill to run.
--
-- IMPORTANT — why the helper function exists:
-- A generated column's expression must be IMMUTABLE. `array_to_string` is only
-- STABLE (it depends on the element type's output function), so inlining it
-- fails with "generation expression is not immutable" (SQLSTATE 42P17). Wrapping
-- the whole build in one SQL function we declare IMMUTABLE is the standard way
-- round it — the computation genuinely is deterministic for these text inputs.

create or replace function public.jobs_search_vector(
  p_title        text,
  p_description  text,
  p_category     text[],
  p_tags         text[],
  p_location     text[],
  p_city         text,
  p_remote_type  text,
  p_job_type     text[]
)
returns tsvector
language sql
immutable
parallel safe
as $$
  -- Weighted so a job *titled* "Data Engineer" outranks one that merely mentions
  -- the phrase somewhere in its description.
  --   A = title
  --   B = categories + tags
  --   C = location, city, remote type, job type
  --   D = description body (HTML stripped)
  select
    setweight(to_tsvector('english'::regconfig, coalesce(p_title, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig,
      coalesce(array_to_string(p_category, ' '), '') || ' ' ||
      coalesce(array_to_string(p_tags, ' '), '')
    ), 'B') ||
    setweight(to_tsvector('english'::regconfig,
      coalesce(array_to_string(p_location, ' '), '') || ' ' ||
      coalesce(p_city, '') || ' ' ||
      coalesce(p_remote_type, '') || ' ' ||
      coalesce(array_to_string(p_job_type, ' '), '')
    ), 'C') ||
    setweight(to_tsvector('english'::regconfig,
      -- Descriptions are HTML. Strip tags so markup isn't indexed as words, and
      -- decode the few entities the editor emits.
      regexp_replace(
        replace(replace(replace(coalesce(p_description, ''), '&nbsp;', ' '), '&amp;', '&'), '&#39;', ''''),
        '<[^>]*>', ' ', 'g'
      )
    ), 'D')
$$;

alter table public.jobs
  add column if not exists search_vector tsvector
  generated always as (
    public.jobs_search_vector(
      title, description, job_category, tags, job_location, city, remote_type, job_type
    )
  ) stored;

comment on column public.jobs.search_vector is
  'Generated full-text index over title, categories, tags, location and the HTML-stripped description. Queried via /api/job-search. Never write to it directly.';

create index if not exists idx_jobs_search_vector
  on public.jobs using gin (search_vector);
