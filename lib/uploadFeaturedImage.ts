import { createSupabaseClient } from '@/lib/supabase-client';

export async function uploadFeaturedImage(file: File): Promise<string> {
  const supabase = createSupabaseClient();

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase
    .storage
    .from('blog-assets')
    .upload(`featured/${fileName}`, file, {
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading featured image:', error);
    throw error;
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-assets/${data.path}`;
  return url;
}
