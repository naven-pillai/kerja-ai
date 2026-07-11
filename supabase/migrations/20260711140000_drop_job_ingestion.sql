-- Drop the job_ingestion staging table.
--
-- The ingest pipeline has been removed from kerja-ai-admin (app/ingest,
-- app/api/ingest, lib/ingest.ts). Jobs are entered through the admin form,
-- with AI autofill from a URL via /api/ai-job-extract — which never used this
-- table.
--
-- Safe to drop, verified before writing:
--   * 0 rows.
--   * Its only foreign key points OUT to jobs (job_ingestion.job_id -> jobs.id),
--     so nothing in `jobs` depends on it.
--   * Nothing else in the schema references it.
--   * No code in either repo reads or writes it.
--
-- `cascade` takes its index, trigger, RLS policies and grants with it.
--
-- This is irreversible. If ingestion is ever revived, the table definition is
-- recoverable from git history (supabase/schema.sql).

drop table if exists public.job_ingestion cascade;
