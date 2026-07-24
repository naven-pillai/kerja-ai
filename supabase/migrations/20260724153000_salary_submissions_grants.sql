-- Grant the API route's role access to salary_submissions.
--
-- Creating the table and enabling RLS was not enough: the table had no
-- privileges granted to any role, so every request failed with 42501
-- "permission denied for table salary_submissions" — including the
-- service-role insert that /api/salary-submission depends on. RLS controls
-- which *rows* a role may touch; GRANT controls whether it may touch the table
-- at all, and the second was missing.
--
-- service_role only. anon and authenticated are explicitly revoked rather than
-- merely left alone, so the intent is on the record: submissions are written by
-- our server and read by nobody through the public API. Anything else would
-- expose every salary ever submitted.

grant all privileges on table public.salary_submissions to service_role;

revoke all privileges on table public.salary_submissions from anon;
revoke all privileges on table public.salary_submissions from authenticated;
