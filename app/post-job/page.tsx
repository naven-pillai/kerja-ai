import PostJobContentPage from '@/components/post-job/PostJobContentPage';
import { SITE } from '@/config/site';
import { OG_IMAGES } from '@/lib/seo';
import CollectionStructuredData from '@/components/seo/CollectionStructuredData';

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
    images: OG_IMAGES,
  },
};

// Phase 1: job posting is free. Paid/featured tiers land in a later phase,
// so there is no pricing gate or Stripe checkout — the form submits directly.
export default function PostJobPage() {
  return (
    <>
      <CollectionStructuredData
        name="Post a Job on Kerja AI"
        description="Post an AI, machine learning or data role in Malaysia or Singapore. Free at launch."
        path="/post-job"
        type="WebPage"
      />
      <PostJobContentPage isPaid={false} isFeatured={false} />
    </>
  );
}
