'use client';

import { useState } from 'react';
import TinyMCEEditor from '@/components/blog/TinyMCEEditor';
import type { FormData } from '@/types/job';
import { validateFields, ValidationErrors } from '@/utils/validateFields';

type Props = {
  formData: Pick<FormData, 'description' | 'applyUrl'>;
  handleChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
};

export default function StepThreeJobDescription({ formData, handleChange, nextStep, prevStep }: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleNext = () => {
    const validation = validateFields(formData as FormData, ['description', 'applyUrl']);
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
        <h2 className="text-base font-semibold text-gray-900">Job Description & Apply</h2>
        <p className="text-xs text-gray-500 mt-0.5">Write a compelling description and tell candidates how to apply.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Job Description
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Include responsibilities, requirements, and what makes this role exciting. Aim for at least 150 words.
          </p>
          <div className={errors.description ? 'ring-1 ring-red-400 rounded-lg' : ''}>
            <TinyMCEEditor
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
            />
          </div>
          {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
        </div>

        {/* Apply URL */}
        <div>
          <label htmlFor="applyUrl" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            How to Apply
          </label>
          <input
            id="applyUrl"
            type="text"
            placeholder="https://company.com/careers/apply  or  hiring@company.com"
            value={formData.applyUrl}
            onChange={(e) => handleChange('applyUrl', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
              errors.applyUrl ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-300 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]'
            }`}
          />
          <p className="text-xs text-gray-400 mt-1">Enter a URL to your application form, or an email address where candidates can apply.</p>
          {errors.applyUrl && <p className="text-red-500 text-xs mt-1">{errors.applyUrl}</p>}
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
          Review & Submit →
        </button>
      </div>
    </div>
  );
}
