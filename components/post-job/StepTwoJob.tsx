'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FormData } from '@/types/job';
import { jobTypes, jobCategories, jobLocations, currencyMap, currencyOptions } from '@/constants/job-filters';
import { REMOTE_TYPES } from '@/types/filters';
import { validateFields, ValidationErrors } from '@/utils/validateFields';
import { X } from 'lucide-react';

type Props = {
  formData: FormData;
  handleChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
};


function Label({ children, htmlFor, optional }: { children: ReactNode; htmlFor?: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {optional && (
        <span className="text-[10px] font-normal text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">Optional</span>
      )}
    </label>
  );
}

export default function StepTwoJob(props: Props) {
  const formData = props?.formData;

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [tagInput, setTagInput] = useState('');

  const autoCurrency = useMemo(
    () => (formData ? currencyMap[formData.jobLocation] || 'USD' : 'USD'),
    [formData]
  );

  const [currencyLocked, setCurrencyLocked] = useState(() => {
    if (!formData?.currency) return false;
    if (!formData.jobLocation) return formData.currency !== 'USD';
    return formData.currency !== (currencyMap[formData.jobLocation] || 'USD');
  });

  useEffect(() => {
    if (!formData) return;
    if (!currencyLocked && formData.currency !== autoCurrency) {
      props.handleChange('currency', autoCurrency as FormData['currency']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCurrency, currencyLocked, formData]);

  // Guard: if props are wrong, don't crash the whole page
  if (!formData) return null;

  const { handleChange, nextStep, prevStep } = props;

  const selectedCurrency = formData.currency || autoCurrency;

  // Parse tags from comma-separated string
  const tagList = formData.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const addTag = (raw: string) => {
    const newTags = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => !tagList.includes(t));
    if (newTags.length === 0) return;
    const updated = [...tagList, ...newTags].join(', ');
    handleChange('tags', updated);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    const updated = tagList.filter((t) => t !== tag).join(', ');
    handleChange('tags', updated);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-300 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]'
    }`;

  const handleNext = () => {
    const validation = validateFields(formData, ['jobTitle', 'jobType', 'jobCategory', 'jobLocation']);

    // Cross-validate salary: min must not exceed max
    const min = formData.minSalary ? parseFloat(formData.minSalary) : null;
    const max = formData.maxSalary ? parseFloat(formData.maxSalary) : null;
    if (min !== null && max !== null && min > max) {
      validation.minSalary = 'Minimum salary cannot be greater than maximum.';
    }
    if (min !== null && min < 0) {
      validation.minSalary = 'Salary cannot be negative.';
    }

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    nextStep();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-base font-semibold text-gray-900">Job Details</h2>
        <p className="text-xs text-gray-500 mt-0.5">The core details candidates filter and search by.</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Job Title */}
        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <input
            id="jobTitle"
            type="text"
            placeholder="e.g. Senior Machine Learning Engineer"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className={inputClass('jobTitle')}
          />
          {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
        </div>

        {/* Job Type + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jobType">Job Type</Label>
            <select
              id="jobType"
              value={formData.jobType}
              onChange={(e) => handleChange('jobType', e.target.value)}
              className={inputClass('jobType')}
            >
              <option value="">Select type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>}
          </div>

          <div>
            <Label htmlFor="remoteType">Work Setup</Label>
            <select
              id="remoteType"
              value={formData.remoteType}
              onChange={(e) => handleChange('remoteType', e.target.value)}
              className={inputClass('remoteType')}
            >
              {REMOTE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Shown as a pill on your listing so candidates know what to expect.
            </p>
          </div>

          <div>
            <Label htmlFor="jobCategory">Category</Label>
            <select
              id="jobCategory"
              value={formData.jobCategory}
              onChange={(e) => handleChange('jobCategory', e.target.value)}
              className={inputClass('jobCategory')}
            >
              <option value="">Select category</option>
              {jobCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.jobCategory && <p className="text-red-500 text-xs mt-1">{errors.jobCategory}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="jobLocation">Location</Label>
          <select
            id="jobLocation"
            value={formData.jobLocation}
            onChange={(e) => handleChange('jobLocation', e.target.value)}
            className={inputClass('jobLocation')}
          >
            <option value="">Select location</option>
            {jobLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.jobLocation && <p className="text-red-500 text-xs mt-1">{errors.jobLocation}</p>}
        </div>

        {/* Salary */}
        <div>
          <Label optional>Salary Range</Label>
          <p className="text-xs text-gray-500 -mt-1 mb-2">
            <span className="font-medium text-emerald-700">Listings with salary get 2-3× more applications.</span>{' '}
            Even a rough range helps candidates self-qualify.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                {selectedCurrency}
              </span>
              <input
                type="number"
                placeholder="Min"
                value={formData.minSalary}
                onChange={(e) => handleChange('minSalary', e.target.value)}
                className={`w-full pl-12 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.minSalary ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-300 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]'
                }`}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                {selectedCurrency}
              </span>
              <input
                type="number"
                placeholder="Max"
                value={formData.maxSalary}
                onChange={(e) => handleChange('maxSalary', e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] transition-colors"
              />
            </div>
          </div>
          {errors.minSalary && <p className="text-red-500 text-xs mt-1">{errors.minSalary}</p>}

          {/* Currency selector */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Currency</span>
              {currencyLocked ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyLocked(false);
                    handleChange('currency', autoCurrency as FormData['currency']);
                  }}
                  className="text-xs text-[#1D4ED8] hover:underline"
                >
                  Reset to default
                </button>
              ) : (
                <span className="text-xs text-gray-500">Auto-set from location</span>
              )}
            </div>
            <select
              value={selectedCurrency}
              onChange={(e) => {
                setCurrencyLocked(true);
                handleChange('currency', e.target.value as FormData['currency']);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] transition-colors"
            >
              {currencyOptions.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label optional>Tags</Label>
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="e.g. PyTorch, LLMs, MLOps — press Enter or comma to add"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                if (tagInput.trim()) addTag(tagInput);
              }
            }}
            onBlur={() => {
              if (tagInput.trim()) addTag(tagInput);
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Help candidates find this job. Press Enter or comma to add a tag.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/3 bg-gray-100 text-gray-700 font-medium py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg cursor-pointer hover:opacity-95 transition-opacity text-sm"
        >
          Continue to Description →
        </button>
      </div>
    </div>
  );
}
