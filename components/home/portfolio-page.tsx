import { ReviewStory } from "@/components/home/review-story-lazy";
import { ChatDialog } from "@/components/chat/chat-dialog-lazy";
import { RailNav } from "@/components/layout/rail-nav";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { PortfolioMotion } from "@/components/shared/portfolio-motion";

export function PortfolioPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  return (
    // overflow-x: clip, not hidden: hidden would make this a scroll container
    // and stop the pinned sections from sticking.
    <PortfolioMotion
      layout
      className="portfolio-motion bg-background text-foreground selection:bg-foreground selection:text-background relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-clip"
    >
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
        className="tablet:max-w-2xl tablet:px-8 tablet:pb-[calc(2rem+env(safe-area-inset-bottom))] relative flex w-full max-w-lg flex-col items-center gap-y-14 px-4 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] outline-none md:max-w-xl md:gap-y-16 md:px-4 md:pt-12 md:pb-0"
      >
        <ReviewStory
          copy={copy.review}
          offer={copy.offer}
          contact={copy.contact}
          locale={locale}
        />
      </main>

      {/* No trigger of its own: openChat() opens it from anywhere. */}
      <ChatDialog copy={copy.hero.chat} />

      {/* Section rail, left edge */}
      <RailNav
        copy={copy.rail}
        locale={locale}
        sections={(
          ["review", "vibecoded", "feedback", "handoff", "offer"] as const
        ).map((id) => ({ id, label: copy.rail[id] }))}
      />
    </PortfolioMotion>
  );
}
