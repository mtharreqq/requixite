import { HeroSection } from "@/components/salmoon/hero-section";
import { DilemmaSection } from "@/components/salmoon/dilemma-section";
import { ProofSection } from "@/components/salmoon/proof-section";
import { ProcessSection } from "@/components/salmoon/process-section";
import { WorkSection } from "@/components/salmoon/work-section";
import { ExperienceSection } from "@/components/salmoon/experience-section";
import { ConnectSection } from "@/components/salmoon/connect-section";
import { RailNav } from "@/components/salmoon/rail-nav";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Top subtle fade gradient (Salmoon style) */}
      <div className="pointer-events-none fixed top-0 left-0 z-40 h-8 w-full bg-gradient-to-b from-background to-transparent md:h-12" />

      {/* Main Intimate Centered Column */}
      <main className="flex w-full max-w-lg md:max-w-xl flex-col items-center gap-y-16 pr-4 pl-10 py-16 md:px-4 md:gap-y-20 md:py-24">
        <HeroSection />
        <DilemmaSection />
        <ProofSection />
        <ProcessSection />
        <WorkSection />
        <ExperienceSection />
        <ConnectSection />
      </main>

      {/* Section rail, left edge */}
      <RailNav />
    </div>
  );
}
