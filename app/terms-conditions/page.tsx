import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Kerja-AI',
  description:
    'Review the Terms & Conditions for using Kerja-AI.com — the remote job board for Southeast Asia. Learn about listings, talent profiles, privacy, and user responsibilities.',
  alternates: {
    canonical: 'https://kerja-ai.com/terms-conditions',
  },
};

const sections = [
  { id: 'overview', title: '1. Overview' },
  { id: 'listings', title: '2. Job Listings' },
  { id: 'applications', title: '3. Application Process' },
  { id: 'talent', title: '4. Talent Profiles' },
  { id: 'featured', title: '5. Featured Listings' },
  { id: 'conduct', title: '6. User Conduct' },
  { id: 'privacy', title: '7. Privacy Policy' },
  { id: 'ip', title: '8. Intellectual Property' },
  { id: 'liability', title: '9. Limitation of Liability' },
  { id: 'changes', title: '10. Changes to Terms' },
  { id: 'contact', title: '11. Contact' },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-[#f8f7f4] min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms &amp; Conditions</h1>
          <p className="text-gray-500 mt-2 text-sm">Last updated: March 18, 2026</p>
          <p className="text-gray-600 mt-4 text-sm leading-relaxed max-w-2xl">
            By accessing or using <strong>Kerja-AI.com</strong>, you agree to be bound by the following terms. Please read them carefully before using the platform.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex gap-10 items-start">

          {/* TOC — desktop */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-8">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Contents</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-gray-500 hover:text-[#1D4ED8] py-1 transition leading-snug"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <article className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-10 text-sm text-gray-700 leading-7">

            <section id="overview">
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Overview</h2>
              <p>
                Kerja-AI is a curated remote job board built for Southeast Asia. We connect remote-first companies with professionals across Malaysia, Singapore, the Philippines, Indonesia, and beyond. By using this platform — whether to post jobs, browse listings, or submit a talent profile — you agree to these terms.
              </p>
            </section>

            <section id="listings">
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. Job Listings</h2>
              <p>
                Employers are responsible for ensuring that all job postings are accurate, truthful, and compliant with applicable laws. Listings must not misrepresent the role, compensation, or company. Kerja-AI reserves the right to edit, delay, or remove any listing that violates our guidelines, contains misleading content, or is flagged as fraudulent.
              </p>
            </section>

            <section id="applications">
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Application Process</h2>
              <p>
                Job applications are submitted directly through the employer's provided link or email. Kerja-AI does not intervene in the hiring process and bears no responsibility for employer decisions, applicant conduct, or the outcome of any recruitment process.
              </p>
            </section>

            <section id="talent">
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Talent Profiles</h2>
              <p>
                Professionals may submit a talent profile to be discovered by employers. By submitting a profile, you confirm that the information provided is accurate and that you consent to it being displayed publicly on Kerja-AI after review and approval.
              </p>
              <p className="mt-3">
                Your email address will never be shown publicly. Only verified employers who unlock your profile may contact you. You may request removal of your profile at any time by emailing{' '}
                <a href="mailto:info@kerja-ai.com" className="text-[#1D4ED8] hover:underline">info@kerja-ai.com</a>.
              </p>
            </section>

            <section id="featured">
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Featured Listings</h2>
              <p>
                Employers may upgrade to a <strong>Featured Listing</strong> for increased visibility. Featured jobs appear prominently at the top of listings, on the homepage, and may be promoted via email and social channels. All payments for featured listings are final and non-refundable unless otherwise agreed in writing.
              </p>
            </section>

            <section id="conduct">
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. User Conduct</h2>
              <p>Users must not:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2 mt-2">
                <li>Post spam, fake, or duplicate listings</li>
                <li>Submit false or misleading talent profile information</li>
                <li>Use discriminatory, offensive, or harassing language</li>
                <li>Impersonate other individuals or companies</li>
                <li>Attempt to scrape, copy, or redistribute platform data without permission</li>
              </ul>
              <p className="mt-3">
                We reserve the right to ban or restrict access to anyone who violates these terms, without notice.
              </p>
            </section>

            <section id="privacy">
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Privacy Policy</h2>
              <p>
                Your use of Kerja-AI is also governed by our{' '}
                <Link href="/privacy-policy" className="text-[#1D4ED8] hover:underline">Privacy Policy</Link>,
                which explains how we collect, use, and protect your data. By using this platform, you also agree to the Privacy Policy.
              </p>
            </section>

            <section id="ip">
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
              <p>
                All content on Kerja-AI — including the design, logo, written copy, and platform features — is the property of Kerja-AI and may not be reproduced or distributed without written permission. Job listings remain the property of the respective employers.
              </p>
            </section>

            <section id="liability">
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p>
                Kerja-AI is provided on an "as is" basis. We make no warranties regarding the accuracy of listings or the outcome of any application or hire. To the fullest extent permitted by law, Kerja-AI shall not be liable for any indirect, incidental, or consequential damages arising from use of the platform.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p>
                We may update these Terms &amp; Conditions from time to time. Changes will be posted on this page with an updated date. Your continued use of the platform after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-lg font-bold text-gray-900 mb-3">11. Contact</h2>
              <p>
                If you have questions or concerns about these terms, please reach out at{' '}
                <a href="mailto:info@kerja-ai.com" className="text-[#1D4ED8] hover:underline">info@kerja-ai.com</a>.
              </p>
            </section>

            <div className="border-t border-gray-100 pt-6 text-xs text-gray-400">
              © {new Date().getFullYear()} Kerja-AI. All rights reserved.
            </div>
          </article>

        </div>
      </div>
    </main>
  );
}
