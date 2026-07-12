import { FC } from 'react';

export type StructuredDataBlogPostProps = {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  featuredImage: string;
};

const StructuredDataBlogPost: FC<StructuredDataBlogPostProps> = ({
  title,
  description,
  url,
  datePublished,
  dateModified,
  featuredImage,
  authorName,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    image: [featuredImage],
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kerja AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kerja-ai.com/logo.png',
        width: 300,
        height: 50,
      },
    },
    datePublished,
    dateModified,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

export default StructuredDataBlogPost;
