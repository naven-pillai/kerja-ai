// app/about/page.tsx
import AboutContent from '@/components/about/AboutContent';
import { OG_IMAGES } from '@/lib/seo';
import CollectionStructuredData from '@/components/seo/CollectionStructuredData';

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
    images: OG_IMAGES,
  },
};

export default function AboutPage() {
  return (
    <>
      <CollectionStructuredData
        name="About Kerja AI"
        description="Why Naven built Kerja AI — the AI and data job board for Malaysia and Singapore."
        path="/about"
        type="AboutPage"
      />
      <AboutContent />
    </>
  );
}