import CollectionStructuredData from "@/components/seo/CollectionStructuredData";

export { metadata } from "./metadata";

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  // The page itself is a client component, so its structured data lives here.
  return (
    <>
      <CollectionStructuredData
        name="Contact Kerja AI"
        description="Reach Kerja AI — the AI and data job board for Malaysia and Singapore."
        path="/contact"
        type="ContactPage"
      />
      {children}
    </>
  );
}
