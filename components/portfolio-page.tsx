import { ReviewStory } from "@/components/salmoon/review-story";
import { WorkSection } from "@/components/salmoon/work-section";
import { ChatDialog } from "@/components/salmoon/chat-dialog";
import { ExperienceSection } from "@/components/salmoon/experience-section";
import { ConnectSection } from "@/components/salmoon/connect-section";
import { RailNav } from "@/components/salmoon/rail-nav";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { LanguageSwitch } from "@/components/language-switch";
import {
  PortfolioMotion,
  SectionReveal,
} from "@/components/salmoon/portfolio-motion";

export function PortfolioPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  return (
    // overflow-x: clip, not hidden: hidden would make this a scroll container
    // and stop the pinned sections from sticking.
    <PortfolioMotion className="portfolio-motion bg-background text-foreground selection:bg-foreground selection:text-background relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-clip">
      {/* Keyboard and screen-reader users can jump past the rail */}
      <a
        href="#main"
        className="focus:bg-foreground focus:text-background sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        {copy.skip}
      </a>
      <div aria-hidden className="edge-fade top-0" />
      <div aria-hidden className="edge-fade bottom-0 rotate-180" />

      {/* Main Intimate Centered Column */}
      <main
        id="main"
        tabIndex={-1}
        className="relative flex w-full max-w-lg flex-col items-center gap-y-14 pt-8 pr-4 pl-10 outline-none md:max-w-xl md:gap-y-16 md:px-4 md:pt-12"
      >
        <ReviewStory copy={copy.review} offer={copy.offer} locale={locale} />
        <SectionReveal>
          <ExperienceSection copy={copy.experience} />
        </SectionReveal>
        <WorkSection copy={copy.hero} />
        <SectionReveal>
          <ConnectSection copy={copy.contact} />
        </SectionReveal>
      </main>

      {/* No trigger of its own: openChat() opens it from anywhere. */}
      <ChatDialog copy={copy.hero.chat} />

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
