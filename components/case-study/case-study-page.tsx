import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getCaseStudyCopy } from "@/lib/case-study-copy";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { RantaiLiveLazy } from "@/components/case-study/rantai-live-lazy";
import { SubPage } from "@/components/layout/sub-page";

export function CaseStudyPage({ locale }: { locale: Locale }) {
  const copy = getCaseStudyCopy(locale);
  return (
    <SubPage
      locale={locale}
      path="/work/rantai"
      sections={[
        { id: "intro", label: getPortfolioCopy(locale).rail.intro },
        ...copy.sections.map((s, i) => ({ id: `part-${i}`, label: s.title })),
        { id: "stack", label: copy.stackTitle },
      ]}
    >
      <header id="intro" className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          {copy.title}
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed md:text-base">
          {copy.description}
        </p>
        <dl className="side:text-xs mt-2 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
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

      <RantaiLiveLazy copy={getPortfolioCopy(locale).hero.visual} />

      {copy.shots.map((shot) => (
        <figure key={shot.name} className="flex flex-col gap-3">
          <figcaption className="side:text-sm text-[15px] font-semibold">
            {shot.name}
          </figcaption>
          {(["before", "after"] as const).map((side) => (
            <div key={side} className="flex flex-col gap-1.5">
              <span className="text-muted-foreground side:text-xs text-[13px]">
                {copy[side]}
              </span>
              <Image
                src={`/work/rantai/${shot[side]}`}
                alt={`${shot.name}, ${copy[side]}`}
                width={1200}
                height={750}
                sizes="(min-width: 768px) 640px, 100vw"
                className="border-border/80 w-full rounded-lg border"
              />
            </div>
          ))}
        </figure>
      ))}

      {copy.sections.map((section, i) => (
        <section
          key={section.title}
          id={`part-${i}`}
          className="flex flex-col gap-3"
        >
          <h2 className="text-sm font-bold tracking-wider uppercase">
            {section.title}
          </h2>
          {section.body?.map((p) => (
            <p
              key={p}
              className="text-muted-foreground text-[15px] leading-relaxed md:text-base"
            >
              {p}
            </p>
          ))}
          {section.list && (
            <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed marker:text-current/40 md:text-base">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section id="stack" className="flex flex-col gap-3">
        <h2 className="text-sm font-bold tracking-wider uppercase">
          {copy.stackTitle}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {copy.stack.map((tech) => (
            <li
              key={tech}
              className="bg-muted side:py-1 side:text-xs rounded-full px-3 py-1.5 text-[13px]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>
    </SubPage>
  );
}
