export type FeaturedJob = {
    id: string;
    slug: string;
    title: string;
  
    job_type: string[];
    job_category: string[];
    job_location: string[];
  
    min_salary: number | null;
    max_salary: number | null;
    currency: string;
  
    tags: string[] | null;
    created_at: string | null;
    expires_at: string | null;
    goes_public_at: string | null;
  
    is_featured: boolean;
    status: string;
  
    company: {
      name: string;
      slug: string;
      logo_url: string | null;
    } | null;
  };
  