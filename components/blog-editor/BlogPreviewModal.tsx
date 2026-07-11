'use client';

import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    title: string;
    excerpt: string;
    content: string;
    featured_image: string;
  };
};

export default function BlogPreviewModal({ isOpen, onClose, formData }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        <div className="p-8 space-y-6">
          {/* Featured Image */}
          {formData.featured_image && (
            <img
              src={formData.featured_image}
              alt="Featured"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold">{formData.title}</h1>

          {/* Excerpt */}
          <p className="text-gray-700">{formData.excerpt}</p>

          {/* Content */}
          <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: formData.content }} />
        </div>
      </div>
    </div>
  );
}
