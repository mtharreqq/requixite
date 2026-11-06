"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Wallet } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { cn } from "@/lib/utils";

const clamp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));
const px = (from: number) => (t: number) =>
  `${Math.round(from + (24 - from) * t)}px`;

// Scroll windows: one fix at a time, never overlapping.
const SPACING = [0.12, 0.32];
const COLOR = [0.4, 0.6];
const TYPE = [0.68, 0.88];

export function ProofSection({ copy }: { copy: PortfolioCopy["proof"] }) {
  const ref = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Same JS motion value pattern as StackStory: sticky targets mismeasure natively.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!reduced) progress.set(value);
  });
  useEffect(() => {
    if (reduced) progress.set(1);
  }, [reduced, progress]);

  // The same card throughout; only its CSS dials move (no re-render per frame).
  const spacing = useTransform(progress, (p) =>
    clamp(p, SPACING[0], SPACING[1]),
  );
  useMotionValueEvent(progress, "change", (p) => {
    const style = card.current?.style;
    if (!style) return;
    style.setProperty(
      "--m",
      String(clamp(p, 0.06, 0.12) * (1 - clamp(p, 0.32, 0.38))),
    );
    style.setProperty("--p", String(clamp(p, SPACING[0], SPACING[1])));
    const colour = clamp(p, COLOR[0], COLOR[1]);
    style.setProperty("--c", String(colour));
    // Button text flips at the midpoint so it never matches its own fill.
    style.setProperty("--t", colour < 0.5 ? "0" : "1");
    style.setProperty("--f", String(clamp(p, TYPE[0], TYPE[1])));
    setPhase(p < 0.1 ? 0 : p < 0.36 ? 1 : p < 0.64 ? 2 : 3);
  });
  const line = useTransform(progress, [0, 0.9], [0, 1]);

  return (
    <section
      ref={ref}
      id="proof"
      className="proof-story w-full"
      aria-labelledby="proof-title"
      data-reduced={Boolean(reduced)}
    >
      <div className="proof-sticky">
        <h2
          id="proof-title"
          className="text-sm font-bold tracking-wider uppercase"
        >
          {copy.title}
        </h2>
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
        <ol className="proof-phases">
          {copy.phases.map((label, i) => (
            <li
              key={label}
              className={cn(i === phase && "text-foreground")}
              aria-current={i === phase ? "step" : undefined}
            >
              <span>0{i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <div className="stack-progress" aria-hidden="true">
          <motion.span style={{ scaleX: line }} />
        </div>
        <p className="text-muted-foreground mt-4 min-h-[3em] text-xs leading-relaxed">
          {copy.notes[phase]}
        </p>
      </div>
    </section>
  );
}
