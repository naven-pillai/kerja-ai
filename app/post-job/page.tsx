import PostJobContentPage from '@/components/post-job/PostJobContentPage';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'Post Your AI, ML or Data Job — Free',
  description:
    'Hiring for AI, machine learning or data roles in Malaysia or Singapore? Post your job free and reach candidates who came here for exactly this work.',
  alternates: { canonical: `${SITE.url}/post-job` },
  openGraph: {
    title: `Post Your AI, ML or Data Job — Free - ${SITE.name}`,
    description:
      'Hiring for AI, machine learning or data roles in Malaysia or Singapore? Post your job free and reach candidates who came here for exactly this work.',
    url: `${SITE.url}/post-job`,
    siteName: SITE.name,
    type: 'website',
  },
};

// Phase 1: job posting is free. Paid/featured tiers land in a later phase,
// so there is no pricing gate or Stripe checkout — the form submits directly.
export default function PostJobPage() {
  return <PostJobContentPage isPaid={false} isFeatured={false} />;
}
