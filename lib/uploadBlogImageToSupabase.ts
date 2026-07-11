import { createClient } from '@supabase/supabase-js';

// Create a Supabase client (Client-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Generic image uploader (can be used for blog, company logo, etc.)
export async function uploadImageToSupabase(file: File, folder: string = 'uploads') {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(folder)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from(folder)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

