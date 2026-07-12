import type { Metadata } from 'next';
import NewsletterPageClient from '@/components/newsletter/NewsletterPageClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Newsletter — Weekly AI & Data Jobs, MY & SG',
  description:
    'One email a week with new AI, machine learning and data jobs across Malaysia and Singapore. Free, no spam, one-click unsubscribe.',
  alternates: { canonical: 'https://kerja-ai.com/newsletter' },
  openGraph: {
    title: 'Newsletter — Weekly AI & Data Jobs, MY & SG',
    description:
      'One email a week with new AI, machine learning and data jobs across Malaysia and Singapore. Free, no spam.',
    url: 'https://kerja-ai.com/newsletter',
    siteName: 'Kerja AI',
    type: 'website',
    images: [
      {
        url: 'https://kerja-ai.com/default-og-image-1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Kerja AI Newsletter — Weekly AI & Data Jobs in Malaysia & Singapore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter — Weekly AI & Data Jobs, MY & SG',
    description:
      'One email a week with new AI, machine learning and data jobs across Malaysia and Singapore. Free, no spam.',
    images: ['https://kerja-ai.com/default-og-image-1200x630.png'],
  },
};

type CampaignEmail = {
  subject?: string;
  preview_url?: string;
  screenshot_url?: string;
};

type Campaign = {
  id: string;
  name: string;
  finished_at?: string;
  emails?: CampaignEmail[];
};

async function getNewsletterIssues() {
  const API_KEY = process.env.MAILERLITE_API_KEY;

  if (!API_KEY) return [];

  try {
    const res = await fetch(
      'https://connect.mailerlite.com/api/campaigns?filter%5Bstatus%5D=sent&limit=10',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!res.ok) {
      console.error('MailerLite campaigns error:', res.status);
      return [];
    }

    const data = await res.json();

    return ((data.data ?? []) as Campaign[]).slice(0, 6).map((campaign) => ({
      id: campaign.id,
      subject: campaign.emails?.[0]?.subject ?? campaign.name,
      sentAt: campaign.finished_at ?? null,
      previewUrl: campaign.emails?.[0]?.preview_url ?? '',
      screenshotUrl: campaign.emails?.[0]?.screenshot_url ?? '',
    }));
  } catch (error) {
    console.error('Failed to fetch MailerLite campaigns:', error);
    return [];
  }
}

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How often do you send emails?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Once a week. No drip campaigns, no "we missed you" emails, no upsells.',
      },
    },
    {
      '@type': 'Question',
      name: 'What kind of jobs do you feature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'New AI, machine learning and data roles at companies hiring in Malaysia and Singapore. Every listing is a real opening in the field — nothing scraped, nothing padded with general software jobs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. No paid tiers, no premium version. The newsletter is free and always will be.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I unsubscribe anytime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One click. Every email has an unsubscribe link at the bottom. No guilt trips.',
      },
    },
  ],
};

const webPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Kerja AI Weekly Newsletter — AI & Data Jobs in Malaysia & Singapore',
  description:
    'One email a week with new AI, machine learning and data jobs across Malaysia and Singapore — delivered to your inbox, free.',
  url: 'https://kerja-ai.com/newsletter',
  publisher: {
    '@type': 'Organization',
    name: 'Kerja AI',
    url: 'https://kerja-ai.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://kerja-ai.com/logo.png',
      width: 300,
      height: 50,
    },
  },
  potentialAction: {
    '@type': 'SubscribeAction',
    target: 'https://kerja-ai.com/newsletter',
    name: 'Subscribe to Kerja AI Newsletter',
  },
};

export default async function NewsletterPage() {
  const issues = await getNewsletterIssues();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />
      <NewsletterPageClient issues={issues} />
    </>
  );
}
