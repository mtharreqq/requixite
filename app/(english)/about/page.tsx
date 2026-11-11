import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";
import { getPortfolioCopy } from "@/lib/portfolio-copy";

const copy = getPortfolioCopy("en").about;

export const metadata: Metadata = {
  title: `${copy.title} — Requixite`,
  description: copy.meta,
  alternates: {
    canonical: "/about",
    languages: { en: "/about", id: "/id/about" },
    types: { "text/markdown": "/llms.txt" },
  },
};

export default function Page() {
  return <AboutPage locale="en" />;
}
