import Link from "next/link";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { CloseIntoChat } from "@/components/layout/close-into-chat";
import { RailNav, type RailSection } from "@/components/layout/rail-nav";
import { ContactChat } from "@/components/chat/contact-chat";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PortfolioMotion } from "@/components/shared/portfolio-motion";
import { cn } from "@/lib/utils";

/** About, Work and case studies: their own page, same column. Past its end
 * it closes into the chat with me (CloseIntoChat): a preview card of it, my
 * question, the other pages, the composer. Contact is just the composer. */
export function SubPage({
  locale,
  path,
  title = "",
  sections,
  children,
}: {
  locale: Locale;
  path: string;
  /** The page's name, on its preview card in the chat. */
  title?: string;
  /** This page's sections for the rail; contact is added at the end. */
  sections: RailSection[];
  children: React.ReactNode;
}) {
  const copy = getPortfolioCopy(locale);
  // The contact page is only its composer: nothing to scroll to.
  const bare = path === "/contact";
  const main = (
    <main
      className={cn(
        "tablet:max-w-2xl tablet:px-8 flex w-full max-w-lg flex-col gap-y-14 px-4 md:max-w-xl md:gap-y-16 md:px-4",
        // Contact is one screen, its chat at the bottom: no padding round
        // it. Long pages: clear of the top bar, and room under the last
        // line, so you scroll on past the end a little before it closes.
        bare
          ? ""
          : "bar:pt-[calc(max(env(safe-area-inset-top),12px)+4.5rem)] pt-10 pb-[35svh] md:pt-14 print:p-0",
      )}
    >
      {children}
    </main>
  );
  return (
    <PortfolioMotion
      layout
      className="bg-background text-foreground selection:bg-foreground selection:text-background flex min-h-screen w-full justify-center overflow-x-clip"
    >
      {bare ? (
        main
      ) : (
        <CloseIntoChat locale={locale} path={path} title={title}>
          {main}
        </CloseIntoChat>
      )}
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

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  return (
    <SubPage
      locale={locale}
      path="/contact"
      sections={[{ id: "intro", label: copy.rail.intro }]}
    >
      {/* No title: the page is the chat with me, over the composer. */}
      <ContactChat locale={locale} />
    </SubPage>
  );
}

export function WorkPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  return (
    <SubPage
      locale={locale}
      path="/work"
      title={copy.workPage.title}
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
        <p className="text-muted-foreground text-[15px] leading-relaxed md:text-base">
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
                sizes="(min-width: 768px) 640px, 100vw"
                className="border-border/80 w-full rounded-lg border transition-opacity group-hover:opacity-90"
              />
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-semibold">{p.name}</h2>
                <span className="text-muted-foreground side:text-xs text-[13px]">
                  {p.client} · {p.year}
                </span>
              </div>
              <p className="text-muted-foreground side:text-sm text-[15px] leading-relaxed">
                {p.summary}
              </p>
              <span className="text-muted-foreground group-hover:text-foreground side:text-xs inline-flex items-center gap-1 text-sm font-medium transition-colors">
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
