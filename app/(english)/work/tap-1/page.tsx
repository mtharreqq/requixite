import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { getCaseStudyCopy } from "@/lib/case-study-copy";

const copy = getCaseStudyCopy("en", "tap-1");

export const metadata: Metadata = {
  title: `${copy.title} — Requixite`,
  description: copy.description,
  alternates: {
    canonical: "/work/tap-1",
    languages: { en: "/work/tap-1", id: "/id/work/tap-1" },
  },
};

export default function Page() {
  return <CaseStudyPage locale="en" slug="tap-1" />;
}
