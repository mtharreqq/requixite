import type { Metadata } from "next";
import { WorkPage } from "@/components/sub-page";
import { getPortfolioCopy } from "@/lib/portfolio-copy";

const copy = getPortfolioCopy("en").workPage;

export const metadata: Metadata = {
  title: `${copy.title} — Requixite`,
  description: copy.meta,
  alternates: {
    canonical: "/work",
    languages: { en: "/work", id: "/id/work" },
  },
};

export default function Page() {
  return <WorkPage locale="en" />;
}
