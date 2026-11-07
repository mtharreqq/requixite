import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study-page";
import { getCaseStudyCopy } from "@/lib/case-study-copy";

const copy = getCaseStudyCopy("id");

export const metadata: Metadata = {
  title: `${copy.title} — Requixite`,
  description: copy.description,
  alternates: {
    canonical: "/id/work/rantai",
    languages: { en: "/work/rantai", id: "/id/work/rantai" },
  },
};

export default function Page() {
  return <CaseStudyPage locale="id" />;
}
