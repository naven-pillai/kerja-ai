'use client';

import { Heading } from '@/lib/extractHeadingsFromHTML'; // adjust path if needed
import { useState, useEffect } from 'react';

type TOCProps = {
  headings: Heading[];
};

export default function TableOfContents({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="uppercase text-sm font-bold text-blue-600 tracking-wide">
        Table of Contents
      </h3>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block text-sm transition-colors ${
                activeId === heading.id
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
