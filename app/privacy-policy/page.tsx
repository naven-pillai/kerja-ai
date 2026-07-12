import PrivacyPolicyContentPage from '@/components/privacy-policy/PrivacyPolicyContentPage';

export const metadata = {
  title: 'Privacy Policy',
  description: "Kerja-AI's privacy policy: how we collect, use, and protect your data when you post a job, subscribe, or browse AI and data roles in Malaysia & Singapore.",
  alternates: { canonical: 'https://kerja-ai.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContentPage />;
}
