import type { Metadata } from "next";
import FAQPageClient from "@/components/pages/FAQPageClient";
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  title: "FAQ — AI & Data Jobs in Malaysia & Singapore",
  description:
    "Straight answers about Kerja AI, the AI and data job board for Malaysia and Singapore — is it free, are the jobs real, and how it differs from JobStreet.",
  openGraph: {
    title: "FAQ - Kerja AI",
    description:
      "Is Kerja AI free? Are the jobs real? Only Malaysia? Straight answers on the AI and data job board for MY and SG.",
    url: "https://kerja-ai.com/faq",
    siteName: "Kerja AI",
    type: "website",
    images: OG_IMAGES,
  },
  alternates: { canonical: "https://kerja-ai.com/faq" },
};

export default function FAQPage() {
  return <FAQPageClient />;
}
