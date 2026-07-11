'use client';

import { FormState } from '@/components/blog/BlogPostForm';

type Props = {
  formData: FormState;
  handleChange: (field: keyof FormState, value: string) => void;
};

export default function SEOSettingsCard({ formData, handleChange }: Props) {
  const titleCharLimit = 60;
  const descCharLimit = 160;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <h4 className="text-lg font-bold text-gray-800">SEO Settings</h4>

      {/* SEO Title */}
      <div>
        <label className="block text-sm font-semibold mb-2">SEO Title</label>
        <input
          type="text"
          value={formData.seo_title}
          onChange={(e) => handleChange('seo_title', e.target.value)}
          placeholder="Enter SEO Title (max 60 characters)"
          className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none ${
            formData.seo_title.length > titleCharLimit ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p className={`text-xs mt-1 ${formData.seo_title.length > titleCharLimit ? 'text-red-500' : 'text-gray-500'}`}>
          {formData.seo_title.length}/{titleCharLimit} characters
        </p>
      </div>

      {/* SEO Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">SEO Description</label>
        <textarea
          value={formData.seo_description}
          onChange={(e) => handleChange('seo_description', e.target.value)}
          placeholder="Enter SEO Description (max 160 characters)"
          rows={4}
          className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none resize-none ${
            formData.seo_description.length > descCharLimit ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p
          className={`text-xs mt-1 ${
            formData.seo_description.length > descCharLimit ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {formData.seo_description.length}/{descCharLimit} characters
        </p>
      </div>
    </div>
  );
}
