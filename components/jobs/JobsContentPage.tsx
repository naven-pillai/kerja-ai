'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SlidersHorizontal, X, SearchX, ChevronDown, Sparkles } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { JobWithCompany } from '@/types/custom';
import { Filters } from '@/types/filters';

import JobCard from '@/components/common/JobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';
import JobsSidebar from '@/components/jobs/JobsSidebar';
import NewsletterCard from '@/components/common/NewsletterCard';
import ScrollToTopOnRouteChange from '@/components/common/ScrollToTopOnRouteChange';
import Link from 'next/link';

dayjs.extend(relativeTime);

type SortOption = 'featured' | 'newest';

const emptyFilters: Filters = {
  keyword: '',
  category: '',
  location: '',
  jobType: '',
  remoteType: '',
  skills: '',
};

export default function JobsContentPage({ initialKeyword = '' }: { initialKeyword?: string }) {
  const [allJobs, setAllJobs] = useState<JobWithCompany[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithCompany[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filters>({ ...emptyFilters, keyword: initialKeyword });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id, title, slug, created_at, is_featured, status, expires_at,
          valid_through, job_type, job_category, job_location, remote_type,
          min_salary, max_salary, currency, tags, apply_url,
          company_id, description, seo_title, seo_description,
          goes_public_at,
          company:companies(name, slug, logo_url)
        `)
        .eq('status', 'published')
        .lte('goes_public_at', new Date().toISOString())
        .not('goes_public_at', 'is', null)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) { console.error('Error fetching jobs:', error); setLoading(false); return; }

      const jobs = (data ?? []) as JobWithCompany[];
      const valid = jobs.filter((j) => !j.expires_at || dayjs().isBefore(dayjs(j.expires_at)));

      setAllJobs(valid);
      setFilteredJobs(valid);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // Close mobile drawer when clicking outside / on overlay
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileFilterOpen]);

  const handleApply = useCallback((filters: Filters) => {
    setVisibleCount(15);
    setActiveFilters(filters);
    let results = [...allJobs];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      results = results.filter(
        (j) => j.title.toLowerCase().includes(kw) || j.company?.name?.toLowerCase().includes(kw)
      );
    }
    if (filters.category) {
      results = results.filter((j) => j.job_category?.includes(filters.category));
    }
    if (filters.location) {
      results = results.filter((j) => j.job_location?.includes(filters.location));
    }
    if (filters.remoteType) {
      results = results.filter((j) => j.remote_type === filters.remoteType);
    }
    if (filters.jobType) {
      results = results.filter((j) =>
        Array.isArray(j.job_type) ? j.job_type.includes(filters.jobType) : j.job_type === filters.jobType
      );
    }
    if (filters.skills) {
      const tags = filters.skills.toLowerCase().split(',').map((t) => t.trim()).filter(Boolean);
      results = results.filter((j) => j.tags?.some((t) => tags.includes(t.toLowerCase())));
    }

    setFilteredJobs(results);
  }, [allJobs]);

  const handleClear = useCallback(() => {
    setVisibleCount(15);
    setActiveFilters(emptyFilters);
    setFilteredJobs(allJobs);
  }, [allJobs]);

  // Sort displayed jobs
  const displayedJobs = useMemo(() => {
    const sorted = [...filteredJobs];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => dayjs(b.created_at ?? 0).valueOf() - dayjs(a.created_at ?? 0).valueOf());
    } else {
      sorted.sort((a, b) => dayjs(b.created_at ?? 0).valueOf() - dayjs(a.created_at ?? 0).valueOf());
    }
    return sorted;
  }, [filteredJobs, sortBy]);

  const featuredJobs = useMemo(
    () => (sortBy === 'featured' ? displayedJobs.filter((j) => j.is_featured) : []),
    [displayedJobs, sortBy]
  );

  const allRegularJobs = useMemo(
    () => (sortBy === 'featured' ? displayedJobs.filter((j) => !j.is_featured) : displayedJobs),
    [displayedJobs, sortBy]
  );

  const regularJobs = useMemo(
    () => allRegularJobs.slice(0, visibleCount),
    [allRegularJobs, visibleCount]
  );

  const hasMore = visibleCount < allRegularJobs.length;

  // Active filter chips
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const filterChips: { label: string; key: keyof Filters }[] = [
    ...(activeFilters.keyword ? [{ label: `"${activeFilters.keyword}"`, key: 'keyword' as const }] : []),
    ...(activeFilters.category ? [{ label: activeFilters.category, key: 'category' as const }] : []),
    ...(activeFilters.location ? [{ label: activeFilters.location, key: 'location' as const }] : []),
    ...(activeFilters.jobType ? [{ label: activeFilters.jobType, key: 'jobType' as const }] : []),
    ...(activeFilters.remoteType ? [{ label: activeFilters.remoteType, key: 'remoteType' as const }] : []),
    ...(activeFilters.skills ? [{ label: activeFilters.skills, key: 'skills' as const }] : []),
  ];

  const removeChip = (key: keyof Filters) => {
    const updated = { ...activeFilters, [key]: '' };
    setActiveFilters(updated);
    handleApply(updated);
  };

  const sortLabels: Record<SortOption, string> = {
    featured: 'Featured first',
    newest: 'Newest first',
  };

  return (
    <>
      <ScrollToTopOnRouteChange />

      {/* ── Mobile filter drawer ── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-[85vw] max-w-sm bg-white h-full overflow-y-auto shadow-2xl">
            <JobsSidebar
              onApply={handleApply}
              onClear={handleClear}
              initialKeyword={initialKeyword}
              activeFilterCount={activeFilterCount}
              isDrawer
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="bg-gray-50/50 min-h-screen">

        {/* ── Page header ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Remote Jobs in APAC
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Verified opportunities updated daily across Southeast Asia &amp; beyond.
              </p>
            </div>

          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">

            {/* Desktop sidebar */}
            <div className="hidden lg:block w-[260px] shrink-0">
              <JobsSidebar
                onApply={handleApply}
                onClear={handleClear}
                initialKeyword={initialKeyword}
                activeFilterCount={activeFilterCount}
              />
            </div>

            {/* Job list */}
            <div className="flex-1 min-w-0">

              {/* Top bar: count + sort + mobile filter button */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <p className="text-sm text-gray-500">
                  {loading
                    ? <span className="inline-block w-24 h-4 bg-gray-100 rounded animate-pulse" />
                    : <><span className="font-semibold text-gray-900">{displayedJobs.length}</span> {displayedJobs.length === 1 ? 'job' : 'jobs'} found</>
                  }
                </p>

                <div className="flex items-center gap-2">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSortOpen((v) => !v)}
                      className="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:border-gray-300 transition"
                    >
                      {sortLabels[sortBy]}
                      <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isSortOpen && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                        {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => { setSortBy(key); setIsSortOpen(false); setVisibleCount(15); }}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              sortBy === key
                                ? 'text-[#1D4ED8] font-semibold bg-gray-50'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile filter button */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 text-sm font-medium border border-gray-200 bg-white px-3 py-2 rounded-lg hover:border-gray-300 transition"
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Active filter chips */}
              {filterChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filterChips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => removeChip(chip.key)}
                      className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition group"
                    >
                      {chip.label}
                      <X size={11} className="text-gray-400 group-hover:text-[#1D4ED8]" />
                    </button>
                  ))}
                  <button
                    onClick={handleClear}
                    className="text-xs text-[#1D4ED8] hover:underline font-medium px-1 py-1.5"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Loading skeletons */}
              {loading && (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Featured spotlight */}
              {!loading && featuredJobs.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Featured</span>
                    <div className="flex-1 h-px bg-amber-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {featuredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular job list */}
              {!loading && regularJobs.length > 0 && (
                <>
                  {featuredJobs.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">All Jobs</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                  )}
                  <div className="space-y-3" id="job-list">
                    {regularJobs.map((job, index) => (
                      <div key={job.id}>
                        <JobCard job={job} />
                        {index === 2 && (
                          <Link
                            href="/talents/signup"
                            className="group mt-3 flex items-center gap-4 p-5 rounded-xl border border-dashed border-[#1D4ED8]/30 bg-gradient-to-r from-red-50/60 to-orange-50/40 hover:border-[#1D4ED8]/60 hover:from-red-50 hover:to-orange-50/60 transition-all duration-200"
                          >
                            <div className="w-11 h-11 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center shrink-0">
                              <Sparkles className="w-5 h-5 text-[#1D4ED8]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-[#1D4ED8] transition-colors">
                                Looking for remote work in APAC?
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Create a free talent profile and let employers find you — no cold applying.
                              </p>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1.5 shrink-0 text-xs font-semibold text-white bg-[#1D4ED8] group-hover:bg-[#1E40AF] px-3 py-1.5 rounded-lg transition">
                              Get Listed Free →
                            </span>
                          </Link>
                        )}
                        {index === 4 && (
                          <div className="mt-3">
                            <NewsletterCard />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="pt-4 text-center">
                      <button
                        onClick={() => setVisibleCount((c) => c + 15)}
                        className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-sm font-semibold text-gray-700 px-6 py-3 rounded-xl transition"
                      >
                        Load more jobs
                        <span className="text-xs font-normal text-gray-400">
                          ({allRegularJobs.length - visibleCount} remaining)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Empty state */}
              {!loading && displayedJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <SearchX size={28} className="text-gray-300" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No jobs match your filters</h3>
                  <p className="text-sm text-gray-500 max-w-xs mb-5">
                    Try broadening your search or clearing some filters to see more opportunities.
                  </p>
                  <button
                    onClick={handleClear}
                    className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#c42705] transition"
                  >
                    <X size={14} />
                    Clear all filters
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
