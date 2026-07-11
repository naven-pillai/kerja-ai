// app/not-found.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFoundRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage after 0.5 seconds
    const timer = setTimeout(() => {
      router.replace('/');
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
      <p className="text-sm">Page not found. Redirecting to homepage...</p>
    </div>
  );
}
