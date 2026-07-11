// app/about/page.tsx
import AboutContent from '@/components/about/AboutContent';

export const metadata = {
  title: 'About | Kerja-AI — Remote & Hybrid Jobs for Southeast Asia',
  description: 'Kerja-AI is an APAC-first job board for remote and hybrid roles, built for talent in Malaysia, Philippines, Singapore, and Indonesia. Every job is verified and labelled 100% Remote or Hybrid. Every tool is reviewed for the region.',
  alternates: { canonical: 'https://kerja-ai.com/about' },
  openGraph: {
    title: 'About | Kerja-AI — Remote & Hybrid Jobs for Southeast Asia',
    description: 'Kerja-AI is an APAC-first job board for remote and hybrid roles, built for talent in Malaysia, Philippines, Singapore, and Indonesia.',
    url: 'https://kerja-ai.com/about',
    siteName: 'Kerja-AI',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}