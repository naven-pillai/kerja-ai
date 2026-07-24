-- A short summary shown at the top of a blog post, above the body.
--
-- Distinct from the columns that already exist, which are easy to confuse:
--   * seo_description / meta_description — for search engines and social cards,
--     never rendered on the page.
--   * excerpt — the teaser on listing cards (blog index, latest-blogs API).
--
-- This one is read by the reader, in the article itself: the "here is what this
-- post covers" paragraph before the content starts.
--
-- Nullable with no default: every existing post predates it, and a post without
-- a summary simply renders none rather than an empty box.

alter table public.blogs
  add column if not exists summary text;

comment on column public.blogs.summary is
  'Short summary rendered at the top of the post, above the content. Not an SEO field — seo_description is separate, and excerpt is the listing-card teaser.';
