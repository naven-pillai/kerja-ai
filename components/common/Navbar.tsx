'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Companies', href: '/companies' },
  { label: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const pathname = usePathname() ?? '';
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">

        {/* Logo */}
        <Link href="/" aria-label="Go to homepage" className="flex items-center shrink-0">
          <Image src="/kerja-ai-logo.png" alt="KerjaAI" width={534} height={460} priority style={{ height: '48px', width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'text-[#1D4ED8]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1D4ED8]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/newsletter"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
          >
            Job Alerts
          </Link>
          <Link
            href="/post-job"
            className="text-sm font-semibold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-4 py-2 rounded-lg transition"
          >
            Post a Job
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-[#1D4ED8] bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
              <Link
                href="/newsletter"
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Job Alerts
              </Link>
              <Link
                href="/post-job"
                className="text-center bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
              >
                Post a Job
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
