-- ============================================================================
-- Kerja-AI — DESTRUCTIVE reset. Drops every object created by
--   00000000000001_init_schema.sql
--   00000000000002_storage.sql
-- so that `supabase db push` can be re-run from a clean slate.
--
-- ALL DATA IN THESE TABLES AND STORAGE BUCKETS IS PERMANENTLY DELETED.
-- Run against a dev/staging project, or a prod project you are sure is empty.
--
-- Usage:
--   supabase db execute --file supabase/reset.sql     # or paste into SQL Editor
--   supabase db push
--
-- Not in supabase/migrations/ on purpose — `db push` must never pick this up.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Storage: policies only.
--
--    The buckets are deliberately left in place. Supabase blocks DELETE on
--    storage.objects / storage.buckets from SQL (the storage.protect_delete
--    trigger); files must go through the Storage API. That's fine here — the
--    bucket creation in 00000000000002_storage.sql is `on conflict do nothing`,
--    so it re-runs against existing buckets without error. Only these policies
--    collide, so only these need dropping.
--
--    To also wipe the FILES (optional — orphaned files break nothing, they just
--    take up space), empty the buckets in Dashboard → Storage first, or:
--      supabase storage rm --experimental -r ss:///company-logos
-- ---------------------------------------------------------------------------
drop policy if exists "public read kerja-ai buckets" on storage.objects;
drop policy if exists "auth write kerja-ai buckets"  on storage.objects;
drop policy if exists "auth update kerja-ai buckets" on storage.objects;
drop policy if exists "auth delete kerja-ai buckets" on storage.objects;
drop policy if exists "anon upload company logo"     on storage.objects;

-- ---------------------------------------------------------------------------
-- 2. Views. (Also covered by the cascading table drops below, but explicit
--    drops keep this readable and safe to run in any order.)
-- ---------------------------------------------------------------------------
drop view if exists public.jobs_with_payment        cascade;
drop view if exists public.companies_with_job_count cascade;
drop view if exists public.sorted_companies         cascade;

-- ---------------------------------------------------------------------------
-- 3. Tables. `cascade` takes the triggers, indexes, RLS policies, grants and
--    foreign keys with them, so order technically doesn't matter — but it is
--    listed child-before-parent anyway.
-- ---------------------------------------------------------------------------
drop table if exists public.job_ingestion          cascade;
drop table if exists public.job_events             cascade;
drop table if exists public.job_payments           cascade;
drop table if exists public.jobs                   cascade;
drop table if exists public.blogs                  cascade;
drop table if exists public.authors                cascade;
drop table if exists public.categories             cascade;
drop table if exists public.companies              cascade;
drop table if exists public.newsletter_subscribers cascade;

-- ---------------------------------------------------------------------------
-- 4. Functions. Trigger functions are dropped last (the triggers that depend
--    on them went with the tables above).
-- ---------------------------------------------------------------------------
drop function if exists public.monthly_blog_posts();
drop function if exists public.monthly_registered_companies();
drop function if exists public.monthly_published_jobs();
drop function if exists public.top_jobs_by_event_windowed(text, timestamptz, timestamptz, integer);
drop function if exists public.top_jobs_by_event(text, integer);
drop function if exists public.job_events_daily(timestamptz, timestamptz);
drop function if exists public.get_jobs_stats(uuid[]);
drop function if exists public.get_job_stats(uuid);
drop function if exists public.archive_expired_jobs();
drop function if exists public.set_job_expiry();
drop function if exists public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 5. Migration history. Without this, `supabase db push` sees the versions as
--    already applied and reports "Remote database is up to date" — pushing
--    nothing against the now-empty schema. Skipped if the table doesn't exist
--    (i.e. nothing was ever pushed to this project).
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('supabase_migrations.schema_migrations') is not null then
    delete from supabase_migrations.schema_migrations
      where version in ('00000000000001', '00000000000002');
  end if;
end
$$;

commit;

-- Extensions (pgcrypto, uuid-ossp) are intentionally left installed:
-- `create extension if not exists` in the migration is already idempotent, and
-- other Supabase-managed schemas may depend on them.
