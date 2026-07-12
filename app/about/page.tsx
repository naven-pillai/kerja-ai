// app/about/page.tsx
import AboutContent from '@/components/about/AboutContent';

export const metadata = {
  title: 'About — AI & Data Careers in Malaysia & Singapore',
  description: 'Why Naven built Kerja AI: the AI and data job board for Malaysia and Singapore, for people watching AI reshape their careers in the KL–Singapore corridor.',
  alternates: { canonical: 'https://kerja-ai.com/about' },
  openGraph: {
    title: 'About — AI & Data Careers in Malaysia & Singapore',
    description: 'The AI, machine learning and data job board for Malaysia and Singapore — built for career-anxious talent in the KL–Singapore corridor.',
    url: 'https://kerja-ai.com/about',
    siteName: 'Kerja AI',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}