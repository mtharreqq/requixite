"use client";

import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { RantaiLive } from "@/components/salmoon/rantai-live";

/** rantai.dev, AI-built to finished, as proof after the pitch. */
export function WorkSection({ copy }: { copy: PortfolioCopy["hero"] }) {
  return (
    <section id="work" className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SplitReveal
          text={copy.work.title}
          className="text-foreground text-sm font-bold tracking-wider uppercase"
        />
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.work.intro}
        </p>
      </div>
      <RantaiLive copy={copy.visual} />
    </section>
  );
}
