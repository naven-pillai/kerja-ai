'use client';

const sections = [
  { id: 'information', title: '1. Information We Collect' },
  { id: 'usage', title: '2. How We Use Your Data' },
  { id: 'talent', title: '3. Talent Profiles' },
  { id: 'newsletter', title: '4. Newsletter & Emails' },
  { id: 'third-party', title: '5. Third-Party Services' },
  { id: 'cookies', title: '6. Cookies' },
  { id: 'protection', title: '7. Data Protection' },
  { id: 'rights', title: '8. Your Rights' },
  { id: 'updates', title: '9. Updates to This Policy' },
];

export default function PrivacyPolicyContentPage() {
  return (
    <main className="bg-[#f8f7f4] min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-500 mt-2 text-sm">Last updated: March 18, 2026</p>
          <p className="text-gray-600 mt-4 text-sm leading-relaxed max-w-2xl">
            This Privacy Policy explains how <strong>Kerja-AI.com</strong> collects, uses, and protects the information you provide when using our platform.
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

            <section id="information">
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly to us, including when you:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>Post a job listing on our platform</li>
                <li>Submit a talent profile to be discovered by employers</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us via forms or email</li>
              </ul>
              <p className="mt-3">We also collect certain information automatically when you browse our site, including IP address, browser type, pages visited, and referral URLs via cookies and analytics tools.</p>
            </section>

            <section id="usage">
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Your Data</h2>
              <p className="mb-3">We use collected information to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>Display and manage job listings</li>
                <li>Surface talent profiles to verified employers</li>
                <li>Send job alerts, newsletters, and platform updates</li>
                <li>Improve site performance and user experience</li>
                <li>Respond to support requests and inquiries</li>
              </ul>
              <p className="mt-3">We do not sell your personal data to third parties.</p>
            </section>

            <section id="talent">
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Talent Profiles</h2>
              <p>
                If you submit a talent profile, the information you provide (such as your name, job title, skills, experience, and links) may be displayed publicly on our platform after review and approval. Your email address is never shown publicly — only employers who unlock your profile can contact you directly.
              </p>
              <p className="mt-3">
                You may request removal of your profile at any time by emailing us at{' '}
                <a href="mailto:info@kerja-ai.com" className="text-[#1D4ED8] hover:underline">info@kerja-ai.com</a>.
              </p>
            </section>

            <section id="newsletter">
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Newsletter & Emails</h2>
              <p>
                If you subscribe to our newsletter, we will send you AI and data job updates, platform news, and the occasional promotional email. You can unsubscribe at any time via the link at the bottom of every email. We use MailerLite to manage our mailing list.
              </p>
            </section>

            <section id="third-party">
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
              <p>
                We use third-party services to run the platform, including Google Analytics (site analytics), MailerLite (email marketing), Supabase (database and storage), and, if we introduce paid listings in future, a payment processor to handle them. Each of these services operates under its own privacy policy and data processing terms.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Cookies</h2>
              <p>
                Our site uses cookies to enhance performance and remember user preferences. Analytics cookies help us understand how visitors use the site. You can disable cookies through your browser settings, though some features may not function as expected.
              </p>
            </section>

            <section id="protection">
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Data Protection</h2>
              <p>
                We implement reasonable technical and organisational measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Your Rights</h2>
              <p>
                You have the right to access, correct, or request deletion of your personal data. To exercise any of these rights, please contact us at{' '}
                <a href="mailto:info@kerja-ai.com" className="text-[#1D4ED8] hover:underline">info@kerja-ai.com</a>.
                We will respond to all requests within 30 days.
              </p>
            </section>

            <section id="updates">
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Updates to This Policy</h2>
              <p>
                We may revise this Privacy Policy from time to time. When we do, we will update the date at the top of this page. Your continued use of Kerja-AI after any changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <div className="border-t border-gray-100 pt-6 text-xs text-gray-400">
              Questions? Email us at{' '}
              <a href="mailto:info@kerja-ai.com" className="text-[#1D4ED8] hover:underline">info@kerja-ai.com</a>
            </div>
          </article>

        </div>
      </div>
    </main>
  );
}
