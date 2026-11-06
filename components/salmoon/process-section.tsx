"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MousePointer2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { cn } from "@/lib/utils";

/** An illustrative interface, not a customer result or a working dashboard. */
function ProcessCanvas({
  step,
  instant,
  copy,
}: {
  step: number;
  instant: boolean;
  copy: PortfolioCopy["process"];
}) {
  return (
    <div
      className="process-scene bg-muted/50 relative overflow-hidden rounded-2xl p-5 sm:p-6"
      data-step={step}
      data-instant={instant}
    >
      <div className="text-muted-foreground mb-8 flex items-center justify-between gap-2 font-sans text-[9px] tracking-wider uppercase">
        <span>{copy.study}</span>
        <span>0{step + 1} / 04</span>
      </div>
      <div
        aria-hidden="true"
        className="relative mx-auto flex h-48 max-w-64 items-center justify-center"
      >
        <div className="scene-interface border-border bg-background relative w-full rounded-xl border p-3 shadow-sm">
          <div className="border-border/70 mb-3 flex items-center gap-1 border-b pb-2">
            <span className="bg-foreground/30 size-1 rounded-full" />
            <span className="bg-foreground/20 size-1 rounded-full" />
            <span className="bg-foreground/25 ml-3 h-1 w-14 rounded-full" />
          </div>
          <div className="flex gap-3">
            <div className="scene-sidebar bg-muted flex w-7 shrink-0 flex-col gap-2 rounded-md p-2">
              <span className="bg-foreground/30 size-3 rounded-sm" />
              <span className="bg-foreground/10 h-1 w-3" />
              <span className="bg-foreground/10 h-1 w-3" />
              <span className="bg-foreground/10 h-1 w-3" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="scene-heading bg-foreground/80 mb-2 h-2 w-20 rounded-sm" />
              <div className="bg-foreground/20 mb-3 h-1 w-4/5 rounded-full" />
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "scene-tile border-border/70 bg-muted flex h-11 flex-col justify-between rounded-md border p-1.5",
                      `scene-tile-${i}`,
                    )}
                  >
                    <span className="bg-foreground/30 size-2 rounded-sm" />
                    <span className="bg-foreground/20 h-1 w-4/5 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="bg-foreground/15 h-1 w-10 rounded-full" />
                <span className="scene-action bg-primary flex h-5 w-14 items-center justify-center rounded-md">
                  <Check className="scene-action-check text-primary-foreground size-3" />
                </span>
              </div>
            </div>
          </div>
          <div className="scene-guides border-ring/60 pointer-events-none absolute inset-2 rounded-lg border border-dashed" />
          <span className="scene-audit border-destructive/40 bg-background text-destructive absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border text-xs">
            !
          </span>
          <span className="scene-ready border-primary/30 bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border">
            <Check className="size-4" />
          </span>
          <MousePointer2 className="scene-cursor fill-background text-foreground absolute right-4 bottom-3 size-5" />
        </div>
      </div>
      <div className="text-muted-foreground mt-7 flex items-center gap-2 text-[10px]">
        <span
          className={cn(
            "size-1.5 rounded-full",
            step === 3 ? "bg-primary" : "bg-foreground/50",
          )}
        />
        {copy.stages[step]}
      </div>
      <div aria-hidden="true" className="mt-3 grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "bg-primary h-0.5 rounded-full transition-opacity duration-200",
              i <= step ? "opacity-75" : "opacity-15",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ProcessSection({ copy }: { copy: PortfolioCopy["process"] }) {
  const [step, setStep] = useState(0);
  const [instant, setInstant] = useState(false);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const taken = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    let frame = 0;
    let current = 0;
    const update = () => {
      frame = 0;
      if (!media.matches || reduce || taken.current) return;
      const readingLine = window.innerHeight * 0.46;
      let next = 0;
      rows.current.forEach((row, index) => {
        if (row && row.getBoundingClientRect().top <= readingLine) next = index;
      });
      // A small dead band prevents a trackpad from flickering between stages
      // around a boundary. Scroll position selects one deterministic stage.
      if (
        next > current &&
        (rows.current[next]?.getBoundingClientRect().top ?? Infinity) >
          readingLine - 24
      )
        return;
      if (
        next < current &&
        (rows.current[current]?.getBoundingClientRect().top ?? -Infinity) <
          readingLine + 24
      )
        return;
      if (next === current) return;
      current = next;
      setInstant(false);
      setStep(next);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [reduce]);

  return (
    <section id="process" className="flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
          {copy.title}
        </h2>
        <p className="text-muted-foreground text-xs">{copy.intro}</p>
      </div>
      <div className="process-explainer text-foreground grid items-start gap-6 md:grid-cols-[1.05fr_1fr] md:gap-8">
        <div className="process-pin md:sticky">
          <ProcessCanvas step={step} instant={instant} copy={copy} />
        </div>
        <ol className="process-steps grid grid-cols-2 gap-x-4 gap-y-6 md:flex md:flex-col md:gap-14 md:py-5">
          {copy.steps.map((item, index) => (
            <li
              key={item.title}
              data-step={index}
              ref={(node) => {
                rows.current[index] = node;
              }}
              className="relative"
            >
              <button
                type="button"
                aria-pressed={step === index}
                onClick={(event) => {
                  taken.current = true;
                  setInstant(event.detail === 0);
                  setStep(index);
                }}
                className={cn(
                  "group/step focus-visible:outline-ring w-full cursor-pointer rounded-md text-left transition-colors duration-150",
                  step === index
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="mb-2 flex items-center gap-2 font-sans text-[10px]">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      step === index ? "bg-primary" : "bg-foreground/20",
                    )}
                  />
                  0{index + 1}
                </span>
                <span className="block text-sm font-medium tracking-tight">
                  {item.title}
                </span>
              </button>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                {item.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
