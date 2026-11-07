import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCaseStudyCopy } from "@/lib/case-study-copy";
import type { Locale } from "@/lib/portfolio-copy";
import { LanguageSwitch } from "@/components/language-switch";

export function CaseStudyPage({ locale }: { locale: Locale }) {
  const copy = getCaseStudyCopy(locale);
  const home = locale === "id" ? "/id" : "/";
  return (
    <main className="bg-background text-foreground mx-auto flex min-h-screen w-full max-w-lg flex-col gap-12 px-4 pt-10 pb-20 md:max-w-xl md:pt-14">
      <nav className="flex items-center justify-between">
        <Link
          href={home}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          {copy.back}
        </Link>
        <LanguageSwitch
          locale={locale}
          label={locale === "id" ? "Bahasa" : "Language"}
          path="/work/rantai"
        />
      </nav>

      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          {copy.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.description}
        </p>
        <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-2 text-xs">
          {copy.meta.map(([term, value]) => (
            <div key={term}>
              <dt className="text-muted-foreground">{term}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
          <div>
            <dt className="text-muted-foreground">Live</dt>
            <dd>
              <a
                href="https://www.rantai.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium underline-offset-2 hover:underline"
              >
                {copy.visit}
                <ArrowUpRight aria-hidden className="size-3" />
              </a>
            </dd>
          </div>
        </dl>
      </header>

      {copy.shots.map((shot) => (
        <figure key={shot.name} className="flex flex-col gap-3">
          <figcaption className="text-sm font-semibold">{shot.name}</figcaption>
          {(["before", "after"] as const).map((side) => (
            <div key={side} className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs">
                {copy[side]}
              </span>
              <Image
                src={`/work/rantai/${shot[side]}`}
                alt={`${shot.name}, ${copy[side]}`}
                width={1200}
                height={750}
                sizes="(min-width: 768px) 576px, 100vw"
                className="border-border/80 w-full rounded-lg border"
              />
            </div>
          ))}
        </figure>
      ))}

      {copy.sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-3">
          <h2 className="text-sm font-bold tracking-wider uppercase">
            {section.title}
          </h2>
          {section.body?.map((p) => (
            <p
              key={p}
              className="text-muted-foreground text-sm leading-relaxed md:text-base"
            >
              {p}
            </p>
          ))}
          {section.list && (
            <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed marker:text-current/40 md:text-base">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold tracking-wider uppercase">
          {copy.stackTitle}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {copy.stack.map((tech) => (
            <li key={tech} className="bg-muted rounded-full px-3 py-1 text-xs">
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-border/60 flex flex-col gap-3 border-t pt-8">
        <p className="text-lg font-semibold tracking-tight">{copy.cta}</p>
        <Link
          href={`${home === "/" ? "" : home}/#contact`}
          className="bg-foreground text-background hover:bg-foreground/85 inline-flex h-9 w-fit items-center gap-1 rounded-full px-4 text-sm font-medium transition-colors"
        >
          {copy.ctaLink}
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </footer>
    </main>
  );
}
