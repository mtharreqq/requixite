"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Mail,
  Wallet,
} from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import {
  StepRail,
  StepText,
  usePinCenter,
  useSteps,
} from "@/components/salmoon/step-story";
import { SplitReveal } from "@/components/salmoon/split-reveal";

const clamp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));
const px = (from: number) => (t: number) =>
  `${Math.round(from + (24 - from) * t)}px`;

// One step per phase: vibecoded, spacing, color, type. Each fix plays within
// its own step and finishes at 75% of it, so each is seen complete.
const PHASES = 4;
const dial = (s: number, k: number) => clamp(s, k, k + 0.75);

// Settings rows, vibecoded: every icon its own hue, every switch its own size.
const ROWS = [
  {
    Icon: Bell,
    on: true,
    style: { "--hue": "#22d3ee", "--sw": "44px", "--sh": "24px" },
  },
  {
    Icon: Mail,
    on: false,
    style: { "--hue": "#e879f9", "--sw": "34px", "--sh": "18px" },
  },
  {
    Icon: CalendarDays,
    on: true,
    style: { "--hue": "#facc15", "--sw": "40px", "--sh": "22px" },
  },
] as unknown as { Icon: typeof Bell; on: boolean; style: CSSProperties }[];

/** Two texts in one cell: the vibecoded one, then the fixed one with type. */
function Swap({ from, to }: { from: string; to: string }) {
  return (
    <span className="proof-swap">
      <span>{from}</span>
      <span>{to}</span>
    </span>
  );
}

export function ProofSection({ copy }: { copy: PortfolioCopy["proof"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  usePinCenter(ref, stage);
  const reduce = Boolean(useReducedMotion());
  const [tab, setTab] = useState(0);
  const { index, overall } = useSteps(track, PHASES, reduce);

  // The same component throughout; only its CSS dials move (no re-render per
  // frame). Every component reads the same dials: --m guides, --p spacing,
  // --c colour, --f type.
  const spacing = useTransform(overall, (v) => dial(v * PHASES, 1));
  const g13 = useTransform(spacing, px(13));
  const g19 = useTransform(spacing, px(19));
  const g11 = useTransform(spacing, px(11));
  const apply = (v: number) => {
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
  };
  useMotionValueEvent(overall, "change", apply);
  // A newly picked component starts at the current scroll step.
  useLayoutEffect(() => apply(overall.get()));
  const story = [copy, copy.form, copy.list][tab];
  const steps = story.phases.map((title, i) => ({
    title,
    body: story.notes[i],
  }));

  return (
    <section id="proof" className="w-full" aria-labelledby="proof-title">
      {/* Same pin and split as Process: component left, steps right. The
          title pins too, so it stays right above the component. */}
      <div ref={ref} className="process-story" data-reduced={reduce}>
        <div ref={track} className="pin-track" aria-hidden="true" />
        <div ref={stage} className="process-stage">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <SplitReveal
                text={copy.title}
                id="proof-title"
                className="text-foreground text-sm font-bold tracking-wider uppercase"
              />
              <p className="text-muted-foreground text-xs">{copy.intro}</p>
            </div>
            <div className="text-foreground grid w-full items-center gap-6 md:grid-cols-[1.05fr_1fr] md:gap-8">
              <div className="proof-stage" aria-hidden="true">
                {/* Each pick swaps the component in place with a short rise. */}
                <motion.div
                  key={tab}
                  initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {tab === 0 && (
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
                          <motion.span>{g13}</motion.span>
                        </span>
                        <span className="proof-guide proof-guide-left">
                          <motion.span>{g19}</motion.span>
                        </span>
                        <span className="proof-guide proof-guide-right">
                          <motion.span>{g11}</motion.span>
                        </span>
                      </div>
                    </div>
                  )}
                  {tab === 1 && (
                    <div ref={card} className="proof-wallet proof-form">
                      <p className="proof-form-title">
                        <Swap from={copy.form.loud} to={copy.form.title} />
                      </p>
                      <p className="proof-form-banner">{copy.form.banner}</p>
                      <div className="proof-field">
                        <span className="proof-label">{copy.form.email}</span>
                        <span className="proof-input proof-input-bad">
                          {copy.form.emailValue}
                        </span>
                        <span className="proof-hint">{copy.form.error}</span>
                      </div>
                      <div className="proof-field">
                        <span className="proof-label">
                          {copy.form.password}
                        </span>
                        <span className="proof-input">••••••••••</span>
                      </div>
                      <div className="proof-action">
                        <Swap
                          from={copy.form.loudAction}
                          to={copy.form.action}
                        />
                        <ArrowRight className="size-4" />
                      </div>
                    </div>
                  )}
                  {tab === 2 && (
                    <div ref={card} className="proof-wallet proof-list">
                      <p className="proof-list-title">
                        <Swap from={copy.list.loud} to={copy.list.title} />
                      </p>
                      <div className="proof-list-group">
                        {ROWS.map(({ Icon, on, style }, i) => (
                          <div key={i} className="proof-row" style={style}>
                            <span className="proof-row-icon">
                              <Icon className="size-4" />
                            </span>
                            <span className="proof-row-text">
                              <span className="proof-row-title">
                                {copy.list.rows[i][0]}
                              </span>
                              <span className="proof-row-desc">
                                {copy.list.rows[i][1]}
                              </span>
                            </span>
                            <span className="proof-switch" data-on={on}>
                              <span />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
              <div>
                <div
                  role="group"
                  aria-label={copy.title}
                  className="mb-6 flex gap-2"
                >
                  {copy.tabs.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={tab === i}
                      onClick={() => setTab(i)}
                      className={`relative isolate h-8 rounded-full border px-3.5 text-xs transition-colors duration-200 ${tab === i ? "text-background border-transparent" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
                    >
                      {/* Active fill slides between tabs (RantAI filter chips). */}
                      {tab === i && (
                        <motion.span
                          layoutId="proof-tab"
                          className="bg-foreground absolute inset-0 -z-10 rounded-full"
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 34 }
                          }
                        />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
                <motion.div
                  key={tab}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepText
                    items={steps}
                    index={index}
                    reduce={reduce}
                    titleClassName="text-foreground text-lg font-medium tracking-tight"
                    bodyClassName="text-muted-foreground mt-1.5 text-xs leading-relaxed"
                  />
                </motion.div>
                {!reduce && (
                  <div className="mt-5">
                    <StepRail overall={overall} index={index} count={PHASES} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
