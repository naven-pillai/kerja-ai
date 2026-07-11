import PrivacyPolicyContentPage from '@/components/privacy-policy/PrivacyPolicyContentPage';

export const metadata = {
  title: 'Privacy Policy | Kerja-AI',
  description: 'Read our privacy policy to understand how we collect, use, and protect your data at Kerja-AI.',
  alternates: { canonical: 'https://kerja-ai.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContentPage />;
}
