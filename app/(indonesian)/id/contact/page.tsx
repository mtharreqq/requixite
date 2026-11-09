import type { Metadata } from "next";
import { ContactPage } from "@/components/sub-page";
import { getPortfolioCopy } from "@/lib/portfolio-copy";

const copy = getPortfolioCopy("id").contactPage;

export const metadata: Metadata = {
  title: `${copy.title} — Requixite`,
  description: copy.meta,
  alternates: {
    canonical: "/id/contact",
    languages: { en: "/contact", id: "/id/contact" },
  },
};

export default function Page() {
  return <ContactPage locale="id" />;
}
