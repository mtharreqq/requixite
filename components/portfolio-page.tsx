import { StackStory } from "@/components/salmoon/stack-story";
import { HeroSection } from "@/components/salmoon/hero-section";
import { DilemmaSection } from "@/components/salmoon/dilemma-section";
import { ProofSection } from "@/components/salmoon/proof-section";
import { ProcessSection } from "@/components/salmoon/process-section";
import { WorkSection } from "@/components/salmoon/work-section";
import { ExperienceSection } from "@/components/salmoon/experience-section";
import { ConnectSection } from "@/components/salmoon/connect-section";
import { RailNav } from "@/components/salmoon/rail-nav";
import { getProjects } from "@/data/projects";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { LanguageSwitch } from "@/components/language-switch";
import {
  PortfolioMotion,
  SectionReveal,
} from "@/components/salmoon/portfolio-motion";

export function PortfolioPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  const projects = getProjects(locale).filter((project) => project.published);
  const hasWork = projects.some((project) => project.published);
  return (
    <PortfolioMotion className="portfolio-motion bg-background text-foreground selection:bg-foreground selection:text-background relative flex min-h-screen w-full flex-col items-center justify-start">
      {/* Top subtle fade gradient (Salmoon style) */}
      <div className="from-background pointer-events-none fixed top-0 left-0 z-40 h-8 w-full bg-gradient-to-b to-transparent md:h-12" />

      {/* Main Intimate Centered Column */}
      <main className="flex w-full max-w-lg flex-col items-center gap-y-14 py-8 pr-4 pl-10 md:max-w-xl md:gap-y-16 md:px-4 md:py-12">
        <HeroSection copy={copy.hero} />
        <SectionReveal>
          <DilemmaSection copy={copy.dilemma} />
        </SectionReveal>
        <ProofSection copy={copy.proof} />
        <StackStory copy={copy.stack} />
        <SectionReveal>
          <ProcessSection copy={copy.process} />
        </SectionReveal>
        {hasWork && (
          <SectionReveal>
            <WorkSection projects={projects} copy={copy.work} />
          </SectionReveal>
        )}
        <SectionReveal>
          <ExperienceSection copy={copy.experience} />
        </SectionReveal>
        <SectionReveal>
          <ConnectSection copy={copy.contact} />
        </SectionReveal>
      </main>

      {/* Section rail, left edge */}
      <RailNav
        copy={copy.rail}
        languageControl={
          <LanguageSwitch locale={locale} label={copy.language} />
        }
      />
    </PortfolioMotion>
  );
}
