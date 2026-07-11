'use client';

import React from 'react';
import slugify from 'slugify';
import TinyMCEEditor from '@/components/blog/TinyMCEEditor';

export type FormState = {
  title: string;
  slug: string;
  content: string;
  category: string;
  date: string;
  featured_image: string;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'published';
};

type BlogPostFormProps = {
  formData: FormState;
  handleChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  onSave: (formData: FormState) => Promise<void>;
  saving?: boolean;
};

export default function BlogPostForm({ formData, handleChange, onSave, saving }: BlogPostFormProps) {
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const handleTitleChange = (value: string) => {
    handleChange('title', value);

    const generatedSlug = slugify(value, { lower: true, strict: true });
    if (!formData.slug || formData.slug === slugify(formData.title, { lower: true, strict: true })) {
      handleChange('slug', generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter your blog title..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
            required
          />
          {/* Live Slug Preview */}
          {formData.title && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">URL:</span> /blog/{formData.slug || 'your-slug-here'}
            </p>
          )}
        </div>

        {/* Slug Field */}
        <div>
          <label className="block text-sm font-semibold mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="Auto-generated or customize if needed"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
            required
          />
        </div>

        {/* Date Picker Field */}
        <div>
          <label className="block text-sm font-semibold mb-2">Publish Date</label>
          <input
            type="date"
            value={formData.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Choose the publish date for your blog post.
          </p>
        </div>

        {/* Content Field */}
        <div>
          <label className="block text-sm font-semibold mb-2">Content</label>
          <TinyMCEEditor
            value={formData.content}
            onChange={(value) => handleChange('content', value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Preparing Preview...' : 'Preview Blog'}
          </button>

          <button
            type="submit"
            className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold py-3 px-6 rounded-lg transition min-w-[140px] disabled:opacity-50"
            disabled={saving}
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Blog'
            )}
          </button>
        </div>
      </form>
    </>
  );
}
