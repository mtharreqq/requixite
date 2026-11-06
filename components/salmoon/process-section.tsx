"use client";

import { useRef } from "react";
import { Check, MousePointer2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { cn } from "@/lib/utils";
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { StepRail, StepText, useSteps } from "@/components/salmoon/step-story";

/** An illustrative interface, not a customer result or a working dashboard. */
function ProcessCanvas({
  step,
  copy,
}: {
  step: number;
  copy: PortfolioCopy["process"];
}) {
  return (
    <div
      className="process-scene bg-muted/50 relative overflow-hidden rounded-2xl p-5 sm:p-6"
      data-step={step}
    >
      <div className="text-muted-foreground mb-8 flex items-center justify-between gap-2 font-sans text-[9px] tracking-wider uppercase">
        <span>{copy.study}</span>
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
    </div>
  );
}

export function ProcessSection({ copy }: { copy: PortfolioCopy["process"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const count = copy.steps.length;
  const { index, overall } = useSteps(ref, count, reduce);
  const steps = copy.steps.map((s) => ({ title: s.title, body: s.desc }));

  return (
    <section id="process" className="flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <SplitReveal
          text={copy.title}
          className="text-foreground text-sm font-bold tracking-wider uppercase"
        />
        <p className="text-muted-foreground text-xs">{copy.intro}</p>
      </div>
      {/* Pinned: scroll plays the four steps one by one. */}
      <div ref={ref} className="process-story" data-reduced={reduce}>
        <div className="process-stage">
          <div className="process-explainer text-foreground grid w-full items-center gap-6 md:grid-cols-[1.05fr_1fr] md:gap-8">
            <ProcessCanvas step={index} copy={copy} />
            <div>
              <StepText
                items={steps}
                index={index}
                reduce={reduce}
                titleClassName="text-foreground text-lg font-medium tracking-tight"
                bodyClassName="text-muted-foreground mt-1.5 text-xs leading-relaxed"
              />
              {!reduce && (
                <div className="mt-5">
                  <StepRail overall={overall} index={index} count={count} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
