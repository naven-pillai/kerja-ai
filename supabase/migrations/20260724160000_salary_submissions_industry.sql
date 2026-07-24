-- Industry and employment type on salary submissions.
--
-- Both materially move pay and neither narrows anonymity: industry is a
-- fourteen-value bucket, not an employer, and permanent-vs-contract is a
-- coarse split. A data scientist in banking and one in edtech are not paid
-- alike, so without industry the eventual bands would blur two different
-- markets together.
--
-- Nullable: they are optional on the form, and a submission that answers only
-- the four required questions is still worth having.

alter table public.salary_submissions
  add column if not exists industry text,
  add column if not exists employment_type text;

comment on column public.salary_submissions.industry is
  'Bucketed industry from constants/salary-submission.ts. Not the employer name — that is deliberately never collected.';
