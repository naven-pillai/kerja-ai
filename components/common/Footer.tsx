import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/config/site";

const links = {
  seekers: [
    { label: "Browse AI Jobs", href: "/jobs" },
    { label: "Jobs by Location", href: "/job-location" },
    { label: "Jobs by Category", href: "/job-categories" },
    { label: "Jobs by Type", href: "/job-types" },
    { label: "Blog & Guides", href: "/blog" },
    { label: "Job Alerts", href: "/newsletter" },
    { label: "FAQ", href: "/faq" },
  ],
  employers: [
    { label: "Post a Job", href: "/post-job" },
    { label: "Companies", href: "/companies" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-conditions" },
  ],
};

const socials = [
  { label: "LinkedIn", href: SITE.socials.linkedin, icon: "/icons/linkedin.svg" },
  { label: "X / Twitter", href: SITE.socials.x, icon: "/icons/x.svg" },
  { label: "Facebook", href: SITE.socials.facebook, icon: "/icons/facebook.svg" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f1117] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — spans 2 cols on lg */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Image
                src="/kerja-ai-logo.png"
                alt="KerjaAI"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-base font-bold text-white tracking-tight">Kerja-AI</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-65">
              The dedicated job board for AI, machine learning and data careers in Malaysia and Singapore. Built for the region&apos;s AI talent.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                >
                  <Image src={s.icon} alt={s.label} width={15} height={15} />
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">Stay in the Loop</p>
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                Latest AI &amp; data jobs in Malaysia and Singapore, straight to your inbox. No spam.
              </p>
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-4 py-2.5 rounded-lg transition"
              >
                Subscribe Free →
              </Link>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">For Job Seekers</h4>
            <ul className="space-y-2.5">
              {links.seekers.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers + Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">For Employers</h4>
            <ul className="space-y-2.5">
              {links.employers.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mt-8 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {links.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Kerja-AI. All rights reserved.</span>
          <span>Built for AI &amp; data talent in Malaysia and Singapore 🇲🇾 🇸🇬</span>
        </div>
      </div>
    </footer>
  );
}
