'use client';

import { useState } from 'react';
import { FormState } from '@/components/blog/BlogPostForm';
import Image from 'next/image'; // ✅ Import Image

type Props = {
  formData: FormState;
  handleChange: (field: keyof FormState, value: string) => void;
};

export default function FeaturedImageCard({ formData, handleChange }: Props) {
  const [imageValid, setImageValid] = useState(true);

  // An empty field is never "invalid" — there's nothing to complain about yet.
  // Deriving that beats the old effect, which reset the flag only when the field
  // was cleared through this input and left a stale error if the parent cleared
  // the form.
  const showInvalid = Boolean(formData.featured_image) && !imageValid;

  const validateImageURL = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol.startsWith('http');
    } catch {
      return false;
    }
  };

  const handleBlur = () => {
    const isValid = validateImageURL(formData.featured_image);
    setImageValid(isValid);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h4 className="text-lg font-bold text-gray-800">Featured Image</h4>

      <input
        type="text"
        value={formData.featured_image}
        onChange={(e) => handleChange('featured_image', e.target.value)}
        onBlur={handleBlur}
        placeholder="Paste the full image URL here (https://...)"
        className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none ${
          showInvalid ? 'border-red-500' : 'border-gray-300'
        }`}
      />

      {showInvalid && (
        <p className="text-sm text-red-500 mt-1">⚠️ Please enter a valid URL (must start with http or https)</p>
      )}

      {/* Preview */}
      {formData.featured_image && !showInvalid ? (
        <div className="relative w-full max-h-64 mt-4 rounded-lg overflow-hidden border">
          <Image
            src={formData.featured_image}
            alt="Featured Preview"
            layout="fill"
            objectFit="cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg mt-4">
          No image preview
        </div>
      )}
    </div>
  );
}
