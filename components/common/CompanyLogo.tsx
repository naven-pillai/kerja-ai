'use client';

import Image from 'next/image';

type CompanyLogoProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
};

export default function CompanyLogo({
  src,
  alt,
  size = 100,
  className = '',
}: CompanyLogoProps) {
  const fallbackSrc = '/default-company-logo.png';

  const safeSrc =
    typeof src === 'string' && src.trim().length > 0 ? src : fallbackSrc;

  return (
    <Image
      src={safeSrc}
      alt={alt || 'Company Logo'}
      width={size}
      height={size}
      className={`object-cover rounded-lg bg-white ${className}`}
    />
  );
}
