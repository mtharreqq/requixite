"use client";

import Image from "next/image";
import { useEffect, useState, type ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioCopy } from "@/lib/portfolio-copy";

type Copy = PortfolioCopy["hero"]["visual"];

/**
 * The case study's demo as a still first. The live rebuild (two whole sites,
 * the panorama, the scroll sweep) loads on the first scroll, touch, pointer
 * move or key press, then takes over in place. Loading it on `load` instead
 * blocked slow phones' main thread right after the first paint. No entrance:
 * the still is the page's LCP.
 * ponytail: the still mirrors RantaiLive's frame markup by hand; change both
 * together, or extract a shared frame if it drifts again.
 */
export function RantaiLiveLazy({ copy }: { copy: Copy }) {
  const [Live, setLive] = useState<ComponentType<{ copy: Copy }> | null>(null);

  useEffect(() => {
    let gone = false;
    const events = ["scroll", "wheel", "touchstart", "pointermove", "keydown"];
    const start = async () => {
      for (const e of events) window.removeEventListener(e, start);
      const mod = await import("@/components/case-study/rantai-live");
      if (!gone) setLive(() => mod.RantaiLive);
    };
    for (const e of events)
      window.addEventListener(e, start, { once: true, passive: true });
    // Opened mid-page (reload, back button): the demo is already in reach.
    if (window.scrollY > 0) start();
    return () => {
      gone = true;
      for (const e of events) window.removeEventListener(e, start);
    };
  }, []);

  if (Live) return <Live copy={copy} />;

  return (
    <div className="w-full lg:ml-[50%] lg:w-[min(56rem,calc(100vw-8rem))] lg:-translate-x-1/2">
      <div className="sticky top-[calc(50svh-10.5rem)] z-10 md:top-[max(1.5rem,calc(50svh-20.5rem))]">
        <div className="relative md:origin-top md:scale-[0.86] motion-reduce:md:scale-100">
          <figure className="border-border/80 bg-muted/50 w-full overflow-hidden rounded-xl border shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)]">
            <div className="flex h-10 items-center gap-3 px-3">
              <span className="flex gap-1.5 max-sm:hidden" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="bg-foreground/15 size-2.5 rounded-full"
                  />
                ))}
              </span>
              <a
                href="https://www.rantai.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background text-muted-foreground hover:text-foreground rounded-md px-2.5 py-0.5 text-[11px] transition-colors"
              >
                rantai.dev
              </a>
              <span
                aria-hidden
                className="ml-auto grid px-2.5 py-1 text-[11px] font-medium whitespace-nowrap"
              >
                <span className="text-muted-foreground col-start-1 row-start-1 text-right">
                  {copy.before}
                </span>
                <span className="col-start-1 row-start-1 opacity-0">
                  {copy.after}
                </span>
              </span>
              <a
                href="https://www.rantai.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-full py-1 pr-1 text-[11px] font-medium underline-offset-2 transition-colors hover:underline"
              >
                <span className="max-sm:sr-only">{copy.visit}</span>
                <ArrowUpRight aria-hidden className="size-3" />
              </a>
            </div>
            <div className="relative aspect-[8/5] w-full overflow-hidden bg-[#0a0b10]">
              <Image
                src="/work/rantai/before.jpg"
                alt=""
                fill
                preload
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="sr-only">{copy.label}</figcaption>
          </figure>
          <div
            role="group"
            aria-label={copy.label}
            className="mt-3 flex justify-center gap-2"
          >
            {copy.pages.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={i === 0}
                className={`h-8 rounded-full border px-3.5 text-xs ${i === 0 ? "bg-foreground text-background border-foreground" : "bg-background border-border text-foreground/70"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden className="h-[170svh] motion-reduce:hidden" />
    </div>
  );
}
