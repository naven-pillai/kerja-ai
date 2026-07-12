-- Store which newsletter groups a subscriber opted into.
--
-- MailerLite is the source of truth for sending, but we keep a copy so we can:
--   * segment/count without an API round-trip,
--   * rebuild the MailerLite list if it is ever lost,
--   * drive the Phase 4 daily-alerts cron from our own DB.
--
-- Nullable and defaulted to empty: existing subscribers predate categories and
-- must not be broken. An empty array means "no category preference" — the
-- subscribe route treats that as "all groups", which is what the compact
-- email-only forms (footer, sidebar, exit popup) send.

alter table public.newsletter_subscribers
  add column if not exists categories text[] not null default '{}';

comment on column public.newsletter_subscribers.categories is
  'Newsletter group slugs from constants/newsletter-groups.ts (e.g. ai-ml-engineering). Empty = subscribed to all groups.';

-- Cheap membership lookups for the future daily-alerts cron
-- ("who is in ai-ml-engineering?").
create index if not exists idx_newsletter_subscribers_categories
  on public.newsletter_subscribers using gin (categories);
