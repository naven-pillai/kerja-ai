export type FormData = {
  companyName: string;
  companyTagline: string;
  companyWebsite: string;
  companyFacebook?: string;
  companyX?: string;
  companyLinkedIn?: string;
  companyLogo: File | null;
  jobTitle: string;
  jobCategory: string;
  jobType: string;
  jobLocation: string;
  minSalary: string;
  maxSalary: string;
  currency: string; // ✅ added
  tags: string;
  description: string;
  applyUrl: string;
  is_featured: boolean;
  contactEmail: string; // ✅ already present
};
