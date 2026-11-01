import { HeroSection } from "@/components/salmoon/hero-section";
import { DilemmaSection } from "@/components/salmoon/dilemma-section";
import { ProofSection } from "@/components/salmoon/proof-section";
import { ProcessSection } from "@/components/salmoon/process-section";
import { WorkSection } from "@/components/salmoon/work-section";
import { ExperienceSection } from "@/components/salmoon/experience-section";
import { ConnectSection } from "@/components/salmoon/connect-section";
import { RailNav } from "@/components/salmoon/rail-nav";
import {
  PortfolioMotion,
  SectionReveal,
} from "@/components/salmoon/portfolio-motion";

export default function Home() {
  return (
    <PortfolioMotion className="portfolio-motion bg-background text-foreground selection:bg-foreground selection:text-background relative flex min-h-screen w-full flex-col items-center justify-start">
      {/* Top subtle fade gradient (Salmoon style) */}
      <div className="from-background pointer-events-none fixed top-0 left-0 z-40 h-8 w-full bg-gradient-to-b to-transparent md:h-12" />

      {/* Main Intimate Centered Column */}
      <main className="flex w-full max-w-lg flex-col items-center gap-y-16 py-16 pr-4 pl-10 md:max-w-xl md:gap-y-20 md:px-4 md:py-24">
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
        <SectionReveal>
          <WorkSection />
        </SectionReveal>
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
