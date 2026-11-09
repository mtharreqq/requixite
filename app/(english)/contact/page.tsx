import type { Metadata } from "next";
import { ContactPage } from "@/components/layout/sub-page";
import { getPortfolioCopy } from "@/lib/portfolio-copy";

const copy = getPortfolioCopy("en").contactPage;

export const metadata: Metadata = {
  title: `${copy.title} — Requixite`,
  description: copy.meta,
  alternates: {
    canonical: "/contact",
    languages: { en: "/contact", id: "/id/contact" },
  },
};

export default function Page() {
  return <ContactPage locale="en" />;
}
