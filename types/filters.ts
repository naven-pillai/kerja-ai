// types/filters.ts
import { jobCategories, jobLocations, jobTypes } from '@/constants/job-filters';

export type JobCategory = (typeof jobCategories)[number];
export type JobLocation = (typeof jobLocations)[number];
export type JobType = (typeof jobTypes)[number];

/** Work setup options — must match the jobs.remote_type check constraint. */
export const REMOTE_TYPES = ['100% Remote', 'Hybrid'] as const;

export type Filters = {
  keyword: string;
  category: string;
  location: string;
  jobType: string;
  /** '' = any, otherwise one of REMOTE_TYPES */
  remoteType: string;
  skills: string;
};
