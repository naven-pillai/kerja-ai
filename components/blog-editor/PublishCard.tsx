'use client';

import { FormState } from '@/components/blog/BlogPostForm';

type Props = {
  formData: FormState;
  handleChange: (field: keyof FormState, value: FormState[keyof FormState]) => void; // ✅ Fixed typing
  onSave: (status: 'draft' | 'published') => void;
  saving: boolean;
};

export default function PublishCard({ formData, handleChange, onSave, saving }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl border space-y-6">
      <h3 className="text-lg font-bold text-gray-800">Publish Settings</h3>

      {/* Status Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Post Status</label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value as 'draft' | 'published')}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Save Draft Button */}
        <button
          type="button"
          onClick={() => onSave('draft')}
          disabled={saving}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Draft...
            </div>
          ) : (
            'Save Draft'
          )}
        </button>

        {/* Publish Button */}
        <button
          type="button"
          onClick={() => onSave('published')}
          disabled={saving}
          className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </div>
          ) : (
            'Publish'
          )}
        </button>
      </div>
    </div>
  );
}
