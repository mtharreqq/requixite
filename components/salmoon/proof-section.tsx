"use client";

import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Wallet } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { StepRail, StepText, useSteps } from "@/components/salmoon/step-story";
import { SplitReveal } from "@/components/salmoon/split-reveal";

const clamp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));
const px = (from: number) => (t: number) =>
  `${Math.round(from + (24 - from) * t)}px`;

// One step per phase: vibecoded, spacing, color, type. Each fix plays within
// its own step and finishes at 75% of it, so each is seen complete.
const PHASES = 4;
const dial = (s: number, k: number) => clamp(s, k, k + 0.75);

export function ProofSection({ copy }: { copy: PortfolioCopy["proof"] }) {
  const ref = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const { index, overall } = useSteps(ref, PHASES, reduce);

  // The same card throughout; only its CSS dials move (no re-render per frame).
  const spacing = useTransform(overall, (v) => dial(v * PHASES, 1));
  useMotionValueEvent(overall, "change", (v) => {
    const style = card.current?.style;
    if (!style) return;
    const s = v * PHASES;
    // Measure guides show up at the end of step 1 and leave once spacing settles.
    style.setProperty(
      "--m",
      String(clamp(s, 0.3, 0.7) * (1 - clamp(s, 1.75, 2))),
    );
    style.setProperty("--p", String(dial(s, 1)));
    const colour = dial(s, 2);
    style.setProperty("--c", String(colour));
    // Button text flips at the midpoint so it never matches its own fill.
    style.setProperty("--t", colour < 0.5 ? "0" : "1");
    style.setProperty("--f", String(dial(s, 3)));
  });
  const steps = copy.phases.map((title, i) => ({ title, body: copy.notes[i] }));

  return (
    <section
      ref={ref}
      id="proof"
      className="proof-story w-full"
      aria-labelledby="proof-title"
      data-reduced={reduce}
    >
      <div className="proof-sticky">
        <SplitReveal
          text={copy.title}
          id="proof-title"
          className="text-sm font-bold tracking-wider uppercase"
        />
        <p className="text-muted-foreground mt-3 max-w-[46ch] text-sm leading-relaxed">
          {copy.intro}
        </p>
        <div className="proof-stage" aria-hidden="true">
          <div ref={card} className="proof-wallet">
            <div className="proof-wallet-heading">
              <span className="inline-flex items-center gap-2">
                <Wallet className="size-3.5" />
                {copy.account}
              </span>
              <span className="proof-wallet-status">
                <span className="proof-dot" />
                {copy.synced}
              </span>
            </div>
            <div className="proof-balance">
              <p>{copy.balance}</p>
              <div className="proof-amount">{copy.amount}</div>
              <span className="proof-growth">
                <ArrowUpRight className="size-3.5" />
                {copy.growth}
                <span>{copy.cashflow}</span>
              </span>
            </div>
            <div className="proof-activity">
              <span className="proof-activity-line" />
              <span>{copy.reconciled}</span>
            </div>
            <div className="proof-action">
              {copy.manage}
              <ArrowRight className="size-4" />
            </div>
            <div className="proof-guides">
              <span className="proof-guide-box" />
              <span className="proof-guide proof-guide-top">
                <motion.span>{useTransform(spacing, px(13))}</motion.span>
              </span>
              <span className="proof-guide proof-guide-left">
                <motion.span>{useTransform(spacing, px(19))}</motion.span>
              </span>
              <span className="proof-guide proof-guide-right">
                <motion.span>{useTransform(spacing, px(11))}</motion.span>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <StepText
            items={steps}
            index={index}
            reduce={reduce}
            titleClassName="text-foreground text-lg font-medium tracking-tight"
            bodyClassName="text-muted-foreground mt-1.5 text-xs leading-relaxed"
          />
        </div>
        {!reduce && (
          <div className="mt-5">
            <StepRail overall={overall} index={index} count={PHASES} />
          </div>
        )}
      </div>
    </section>
  );
}
