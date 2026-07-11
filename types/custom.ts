// Ensure this matches your generated supabase.ts export
import type { Database } from './supabase';

/**
 * Type representing a Job with an embedded Company object.
 * Also includes optional SEO metadata fields.
 */
export type JobWithCompany = Database['public']['Tables']['jobs']['Row'] & {
  company: Pick<
    Database['public']['Tables']['companies']['Row'],
    'name' | 'slug' | 'logo_url'
  >;
  seo_title?: string | null;
  seo_description?: string | null;
};

/**
 * Type representing a Company with its related Jobs (optional).
 */
export type CompanyWithJobs = Database['public']['Tables']['companies']['Row'] & {
  jobs?: Pick<
    Database['public']['Tables']['jobs']['Row'],
    'id' | 'slug' | 'title' | 'job_type' | 'job_category' | 'job_location' | 'min_salary' | 'max_salary' | 'created_at' | 'is_featured'
  >[];
};
