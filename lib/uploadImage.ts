import { createClient } from '@supabase/supabase-js';

// ✅ Supabase client for browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Upload any image file to a specified Supabase Storage folder.
 * @param file - File object to upload
 * @param folder - Supabase Storage bucket (e.g., 'featured_images', 'company-logos')
 * @returns The public URL of the uploaded image
 */
export async function uploadImageToSupabase(file: File, folder: string = 'uploads') {
  if (!file) throw new Error('No file provided');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Upload the file
  const { error } = await supabase.storage
    .from(folder)
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(folder)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Failed to retrieve public URL');
  }

  return publicUrlData.publicUrl;
}
