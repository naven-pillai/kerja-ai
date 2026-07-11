import type { Metadata } from "next";
import FAQPageClient from "@/components/pages/FAQPageClient";

export const metadata: Metadata = {
  title: "FAQ | Kerja-AI - Remote & Hybrid Jobs for Southeast Asia",
  description:
    "Common questions about Kerja-AI, remote work in APAC, job alerts, salary guides, and how to spot scams. Straight answers, no fluff.",
  openGraph: {
    title: "FAQ | Kerja-AI",
    description:
      "Common questions about Kerja-AI, remote work in APAC, and how things work here.",
    url: "https://kerja-ai.com/faq",
    siteName: "Kerja-AI",
    type: "website",
  },
  alternates: { canonical: "https://kerja-ai.com/faq" },
};

export default function FAQPage() {
  return <FAQPageClient />;
}
