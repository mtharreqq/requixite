import type { Metadata } from "next";
import { HeroSection } from "@/components/salmoon/hero-section";
import { DilemmaSection } from "@/components/salmoon/dilemma-section";
import { ProofSection } from "@/components/salmoon/proof-section";
import { ProcessSection } from "@/components/salmoon/process-section";
import { WorkSection } from "@/components/salmoon/work-section";
import { ExperienceSection } from "@/components/salmoon/experience-section";
import { ConnectSection } from "@/components/salmoon/connect-section";
import { RailNav } from "@/components/salmoon/rail-nav";
import { LocaleSwitch } from "@/components/salmoon/locale-switch";
import { HAS_PUBLISHED_WORK } from "@/data/projects";
import {
  PortfolioMotion,
  SectionReveal,
} from "@/components/salmoon/portfolio-motion";
import {
  hreflangLanguages,
  isLocale,
  localePath,
  seoCopy,
  type Locale,
  type LocalizedPath,
} from "@/lib/i18n";
import { notFound } from "next/navigation";

const PATH: LocalizedPath = "";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  if (!isLocale(requested)) return {};
  const locale: Locale = requested;
  const copy = seoCopy(locale);
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: localePath(locale, PATH),
      languages: hreflangLanguages(PATH),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: localePath(locale, PATH),
      siteName: "Requixite",
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <PortfolioMotion className="portfolio-motion bg-background text-foreground selection:bg-foreground selection:text-background relative flex min-h-screen w-full flex-col items-center justify-start">
      {/* Top subtle fade gradient (Salmoon style) */}
      <div className="from-background pointer-events-none fixed top-0 left-0 z-40 h-8 w-full bg-gradient-to-b to-transparent md:h-12" />

      {/* Main Intimate Centered Column */}
      <main className="relative flex w-full max-w-lg flex-col items-center gap-y-16 py-16 pr-4 pl-10 md:max-w-xl md:gap-y-20 md:px-4 md:py-24">
        <LocaleSwitch />
        <HeroSection />
        <SectionReveal>
          <DilemmaSection />
        </SectionReveal>
        <SectionReveal>
          <ProofSection />
        </SectionReveal>
        <SectionReveal>
          <ProcessSection />
        </SectionReveal>
        {HAS_PUBLISHED_WORK && (
          <SectionReveal>
            <WorkSection />
          </SectionReveal>
        )}
        <SectionReveal>
          <ExperienceSection />
        </SectionReveal>
        <SectionReveal>
          <ConnectSection />
        </SectionReveal>
      </main>

      {/* Section rail, left edge */}
      <RailNav />
    </PortfolioMotion>
  );
}
