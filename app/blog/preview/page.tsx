'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BlogPreviewContent() {
  const searchParams = useSearchParams();

  // ✅ Assert non-null by using optional chaining or `?.get`
  const title = searchParams?.get('title') || 'Untitled';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {/* Add your preview content here */}
    </div>
  );
}

export default function BlogPreviewPage() {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <BlogPreviewContent />
    </Suspense>
  );
}
