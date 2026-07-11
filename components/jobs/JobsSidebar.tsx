'use client';

import { useState, useEffect } from 'react';
import { Search, X, MapPin, Briefcase, Tag, SlidersHorizontal, Globe2 } from 'lucide-react';
import { jobCategories, jobLocations, jobTypes } from '@/constants/job-filters';
import { Filters, REMOTE_TYPES } from '@/types/filters';

type Props = {
  onApply: (filters: Filters) => void;
  onClear: () => void;
  initialKeyword?: string;
  activeFilterCount?: number;
  isDrawer?: boolean;
  onClose?: () => void;
};

const emptyFilters: Filters = {
  keyword: '',
  category: '',
  location: '',
  jobType: '',
  remoteType: '',
  skills: '',
};

export default function JobsSidebar({
  onApply,
  onClear,
  initialKeyword = '',
  activeFilterCount = 0,
  isDrawer = false,
  onClose,
}: Props) {
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    keyword: initialKeyword,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      onApply(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, onApply]);

  const set = (field: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleClear = () => {
    setFilters(emptyFilters);
    onClear();
  };

  const inputClass =
    'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition';

  const selectClass =
    'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition appearance-none cursor-pointer';

  const content = (
    <div className={isDrawer ? 'p-5' : 'bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24'}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-[#1D4ED8] hover:underline font-medium"
            >
              Clear all
            </button>
          )}
          {isDrawer && onClose && (
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition">
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5">

        {/* Keyword */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5"><Search size={11} /> Search</span>
          </label>
          <input
            type="text"
            placeholder="e.g. ML Engineer, Data Scientist"
            className={inputClass}
            value={filters.keyword}
            onChange={(e) => set('keyword', e.target.value)}
          />
        </div>

        {/* Work Setup — pills */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5"><Globe2 size={11} /> Work Setup</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['', ...REMOTE_TYPES].map((type) => (
              <button
                key={type || 'all'}
                onClick={() => set('remoteType', type)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  filters.remoteType === type
                    ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {type || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Job Type — pills */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5"><Briefcase size={11} /> Job Type</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['', ...jobTypes].map((type) => (
              <button
                key={type || 'all'}
                onClick={() => set('jobType', type)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  filters.jobType === type
                    ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {type || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5"><Tag size={11} /> Category</span>
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => set('category', e.target.value)}
              className={selectClass}
            >
              <option value="">All categories</option>
              {jobCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5"><MapPin size={11} /> Location</span>
          </label>
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => set('location', e.target.value)}
              className={selectClass}
            >
              <option value="">All locations</option>
              {jobLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Skills / Tags
          </label>
          <input
            type="text"
            placeholder="e.g. Python, PyTorch, SQL"
            className={inputClass}
            value={filters.skills}
            onChange={(e) => set('skills', e.target.value)}
          />
          <p className="text-[11px] text-gray-500 mt-1.5">Separate multiple skills with commas</p>
        </div>

      </div>
    </div>
  );

  return content;
}
