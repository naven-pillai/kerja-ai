// components/post-job/types.ts

export type FormData = {
  companyName: string;
  companyWebsite: string;
  companyLogo: File | null;
  contactEmail: string; // ✅ required field
  jobTitle: string;
  jobCategory: string;
  jobType: string;
  jobLocation: string;
  minSalary: string;
  maxSalary: string;
  tags: string;
  description: string;
  applyUrl: string;
};

export type StepProps = {
  formData: FormData;
  handleChange: <T extends keyof FormData>(field: T, value: FormData[T]) => void;
  nextStep: () => void;
  prevStep: () => void;
};
