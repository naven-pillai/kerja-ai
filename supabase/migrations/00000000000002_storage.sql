-- ============================================================================
-- Kerja-AI — storage buckets + policies.
-- company-logos : company + job-poster logos (public read)
-- blog-images   : inline TinyMCE editor images (public read)
-- featured_images: blog featured images (public read)
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('company-logos',  'company-logos',  true, 2097152, array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('blog-images',    'blog-images',    true, 5242880, array['image/png','image/jpeg','image/webp','image/gif']),
  ('featured_images','featured_images',true, 5242880, array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

-- Public read for all three public buckets ----------------------------------
create policy "public read kerja-ai buckets"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('company-logos','blog-images','featured_images'));

-- Admin (authenticated) may write to any of the buckets ---------------------
create policy "auth write kerja-ai buckets"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('company-logos','blog-images','featured_images'));
create policy "auth update kerja-ai buckets"
  on storage.objects for update to authenticated
  using (bucket_id in ('company-logos','blog-images','featured_images'));
create policy "auth delete kerja-ai buckets"
  on storage.objects for delete to authenticated
  using (bucket_id in ('company-logos','blog-images','featured_images'));

-- Public post-a-job form uploads a company logo before submitting the (pending)
-- job, so anon may write ONLY to company-logos.
create policy "anon upload company logo"
  on storage.objects for insert to anon
  with check (bucket_id = 'company-logos');
