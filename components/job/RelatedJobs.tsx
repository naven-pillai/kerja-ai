'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { createSupabaseClient } from '@/lib/supabase-client';
import { JobWithCompany } from '@/types/custom';
import JobCard from '@/components/common/JobCard';

type Props = {
  category: string | string[];
  tags: string[];
  excludeJobId: string;
};

export default function RelatedJobs({ category, tags, excludeJobId }: Props) {
  const [relatedJobs, setRelatedJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      const supabase = createSupabaseClient();
      const normalizedCategory = Array.isArray(category) ? category[0] : category;
      const now = new Date().toISOString();

      const jobSelect = `
        id, slug, title, created_at, is_featured,
        expires_at, goes_public_at,
        job_type, job_category, job_location, city, remote_type,
        min_salary, max_salary, currency, tags,
        company:companies(name, logo_url, slug)
      `;

      const isValid = (job: JobWithCompany) =>
        !job.expires_at || dayjs().isBefore(dayjs(job.expires_at));

      // Fetch both in parallel
      const [categoryRes, tagsRes] = await Promise.all([
        normalizedCategory
          ? supabase
              .from('jobs')
              .select(jobSelect)
              .eq('status', 'published')
              .lte('goes_public_at', now)
              .not('goes_public_at', 'is', null)
              .contains('job_category', [normalizedCategory])
              .neq('id', excludeJobId)
              .order('created_at', { ascending: false })
              .limit(6)
          : Promise.resolve({ data: null }),
        tags.length > 0
          ? supabase
              .from('jobs')
              .select(jobSelect)
              .eq('status', 'published')
              .lte('goes_public_at', now)
              .not('goes_public_at', 'is', null)
              .overlaps('tags', tags)
              .neq('id', excludeJobId)
              .order('created_at', { ascending: false })
              .limit(6)
          : Promise.resolve({ data: null }),
      ]);

      const categoryJobs = (categoryRes.data as JobWithCompany[] | null)?.filter(isValid) ?? [];
      const tagJobs = (tagsRes.data as JobWithCompany[] | null)?.filter(isValid) ?? [];

      // Prefer category results, fall back to tags
      const best = categoryJobs.length > 0 ? categoryJobs : tagJobs;
      if (best.length > 0) setRelatedJobs(best.slice(0, 4));

      setLoading(false);
    };

    fetchRelated();
  }, [category, tags, excludeJobId]);

  if (loading) return null;

  const label = Array.isArray(category) ? category[0] : category;

  return (
    <div className="pt-12 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        More {label} roles in Malaysia &amp; Singapore
      </h3>

      {relatedJobs.length > 0 ? (
        <div className="space-y-4">
          {relatedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Nothing similar open right now. Check back soon — new AI and data roles land here often.
        </p>
      )}
    </div>
  );
}
