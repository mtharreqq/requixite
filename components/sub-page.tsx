import Link from "next/link";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { ConnectSection } from "@/components/salmoon/connect-section";
import { RailNav, type RailSection } from "@/components/salmoon/rail-nav";
import { ExperienceSection } from "@/components/salmoon/experience-section";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PortfolioMotion,
  SectionReveal,
} from "@/components/salmoon/portfolio-motion";

/** The other pages, minus this one, before the contact card. */
function Suggestions({ locale, path }: { locale: Locale; path: string }) {
  const { skip } = getPortfolioCopy(locale).review;
  const base = locale === "id" ? "/id" : "";
  const pages = [
    ["", skip.home, skip.homeTip],
    ["/about", skip.about, skip.aboutTip],
    ["/work", skip.work, skip.workTip],
    ["/work/rantai", skip.caseStudy, skip.caseStudyTip],
    ["/contact", skip.contact, skip.contactTip],
  ].filter(([p]) => p !== path);
  return (
    <nav className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-sm">{skip.next}</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {pages.map(([p, label, tip]) => (
          <Tooltip key={p}>
            <TooltipTrigger asChild>
              <Link href={base + p || "/"} className="composer-chip">
                {label}
              </Link>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
}

/** About, Work and case studies: their own page, same column, then other
 * pages to try, the contact card and the footer. */
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
  return (
    <PortfolioMotion className="bg-background text-foreground selection:bg-foreground selection:text-background flex min-h-screen w-full justify-center overflow-x-clip">
      <main className="flex w-full max-w-lg flex-col gap-y-14 pt-10 pr-4 pl-10 md:max-w-xl md:gap-y-16 md:px-4 md:pt-14">
        {children}
        <Suggestions locale={locale} path={path} />
        <SectionReveal>
          <ConnectSection copy={copy.contact} />
        </SectionReveal>
      </main>
      <RailNav
        copy={copy.rail}
        locale={locale}
        path={path}
        sections={[...sections, { id: "contact", label: copy.rail.contact }]}
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
      <header id="intro" className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {copy.contactPage.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.contactPage.intro}
        </p>
      </header>
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
