import Link from "next/link";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { FooterWordmark } from "@/components/salmoon/footer-wordmark";
import { RailNav, type RailSection } from "@/components/salmoon/rail-nav";
import { AskBox } from "@/components/salmoon/review-story";
import { ChatDialog } from "@/components/salmoon/chat-dialog";
import { ExperienceSection } from "@/components/salmoon/experience-section";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  PortfolioMotion,
  SectionReveal,
} from "@/components/salmoon/portfolio-motion";

/** The next page as one card, the rest as small links, before the closing
 * composer. */
function Suggestions({ locale, path }: { locale: Locale; path: string }) {
  const { skip } = getPortfolioCopy(locale).review;
  const base = locale === "id" ? "/id" : "";
  const all = [
    ["", skip.home, skip.homeTip],
    ["/about", skip.about, skip.aboutTip],
    ["/work", skip.work, skip.workTip],
    ["/work/rantai", skip.caseStudy, skip.caseStudyTip],
    ["/contact", skip.contact, skip.contactTip],
  ];
  const href = (p: string) => base + p || "/";
  const at = all.findIndex(([p]) => p === path);
  const [np, nLabel, nTip] = all[(at + 1) % all.length];
  return (
    <nav className="flex flex-col gap-4">
      <Link
        href={href(np)}
        className="group bg-card border-border/80 hover:bg-muted flex items-center gap-4 rounded-2xl border p-5 transition-colors"
      >
        <span className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">{skip.next}</span>
          <span className="text-xl font-medium tracking-[-0.03em]">
            {nLabel}
          </span>
          <span className="text-muted-foreground text-sm">{nTip}</span>
        </span>
        <ArrowRight
          aria-hidden
          className="ml-auto size-5 shrink-0 transition-transform group-hover:translate-x-1"
        />
      </Link>
      <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 px-1 text-sm">
        {all
          .filter(([p]) => p !== path && p !== np)
          .map(([p, label]) => (
            <Link
              key={p}
              href={href(p)}
              className="hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
      </div>
    </nav>
  );
}

/** About, Work and case studies: their own page, same column, then other
 * pages to try, the story's closing composer and the footer. */
export function SubPage({
  locale,
  path,
  sections,
  children,
}: {
  locale: Locale;
  path: string;
  /** This page's sections for the rail; contact is added at the end. */
  sections: RailSection[];
  children: React.ReactNode;
}) {
  const copy = getPortfolioCopy(locale);
  // The contact page is only its composer: nothing to scroll to.
  const bare = path === "/contact";
  const ask = copy.review.cta.pages[path] ?? copy.review.cta;
  return (
    <PortfolioMotion className="bg-background text-foreground selection:bg-foreground selection:text-background flex min-h-screen w-full justify-center overflow-x-clip">
      <main className="flex w-full max-w-lg flex-col gap-y-14 px-4 pt-10 pb-20 md:max-w-xl md:gap-y-16 md:px-4 md:pt-14 md:pb-0">
        {children}
        {!bare && (
          <>
            <Suggestions locale={locale} path={path} />
            <SectionReveal>
              <section id="contact" className="flex flex-col gap-5">
                <h2 className="text-center text-xl leading-tight font-medium tracking-[-0.03em] text-balance md:text-2xl">
                  {ask.title}
                </h2>
                <AskBox
                  locale={locale}
                  title={ask.title}
                  placeholder={ask.placeholder}
                />
              </section>
            </SectionReveal>
            {/* Short pages push the footer to the bottom of the screen. */}
            <div className="mt-auto">
              <footer className="relative overflow-hidden">
                <FooterWordmark
                  text="Requixite"
                  className="mb-[-0.2em] text-[clamp(3.5rem,15vw,7.5rem)] leading-[0.85] font-semibold tracking-[-0.06em]"
                />
              </footer>
            </div>
          </>
        )}
      </main>
      <ChatDialog copy={copy.hero.chat} />
      <RailNav
        copy={copy.rail}
        locale={locale}
        path={path}
        sections={
          bare
            ? sections
            : [...sections, { id: "contact", label: copy.rail.contact }]
        }
      />
    </PortfolioMotion>
  );
}

export function AboutPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  return (
    <SubPage
      locale={locale}
      path="/about"
      sections={[
        { id: "intro", label: copy.rail.intro },
        { id: "experience", label: copy.rail.experience },
      ]}
    >
      <header id="intro" className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {copy.about.title}
        </h1>
        {copy.about.story.map((p) => (
          <p
            key={p}
            className="text-muted-foreground text-sm leading-relaxed md:text-base"
          >
            {p}
          </p>
        ))}
      </header>
      <ExperienceSection copy={copy.experience} />
    </SubPage>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  return (
    <SubPage
      locale={locale}
      path="/contact"
      sections={[{ id: "intro", label: copy.rail.intro }]}
    >
      {/* Same ask as the story's end: the page leads with the composer. */}
      {/* Fills the first screen (minus main's top padding), centered. */}
      <section
        id="intro"
        className="flex min-h-[calc(100svh-2.5rem)] flex-col justify-center gap-8 md:min-h-[calc(100svh-3.5rem)]"
      >
        <header className="flex flex-col gap-3">
          <h1 className="text-[clamp(24px,4.8vw,36px)] leading-tight font-medium tracking-[-0.04em]">
            {copy.review.cta.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {copy.contactPage.intro}
          </p>
        </header>
        <AskBox locale={locale} />
      </section>
    </SubPage>
  );
}

export function WorkPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  return (
    <SubPage
      locale={locale}
      path="/work"
      sections={[
        { id: "intro", label: copy.rail.intro },
        ...copy.workPage.projects.map((p) => ({
          id: p.href.split("/").pop()!,
          label: p.name,
        })),
      ]}
    >
      <header id="intro" className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {copy.workPage.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.workPage.intro}
        </p>
      </header>
      <ul className="flex flex-col gap-10">
        {copy.workPage.projects.map((p) => (
          <li key={p.href} id={p.href.split("/").pop()}>
            <Link href={p.href} className="group flex flex-col gap-3">
              <Image
                src={p.image}
                alt={p.name}
                width={1200}
                height={750}
                sizes="(min-width: 768px) 576px, 100vw"
                className="border-border/80 w-full rounded-lg border transition-opacity group-hover:opacity-90"
              />
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-semibold">{p.name}</h2>
                <span className="text-muted-foreground text-xs">
                  {p.client} · {p.year}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {p.summary}
              </p>
              <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors">
                {copy.workPage.read}
                <ArrowRight aria-hidden className="size-3" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SubPage>
  );
}
