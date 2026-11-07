"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Locale, PortfolioCopy } from "@/lib/portfolio-copy";
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { openChat } from "@/lib/chat-events";

// Starting prices per plan, in whole units. Free plan first.
const PRICES = {
  IDR: [0, 1_500_000, 3_000_000],
  USD: [0, 250, 600],
};

// Set by proxy.ts from Vercel's geo header. Missing (dev, other hosts): the
// page language decides.
const country = () => document.cookie.match(/(?:^|; )country=([A-Z]{2})/)?.[1];
const noop = () => () => {};

export function OfferSection({
  copy,
  locale,
}: {
  copy: PortfolioCopy["offer"];
  locale: Locale;
}) {
  const fallback = locale === "id" ? "ID" : "";
  const where = useSyncExternalStore(
    noop,
    () => country() ?? fallback,
    () => fallback,
  );
  const currency = where === "ID" ? "IDR" : "USD";
  const format = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: currency === "IDR" ? "compact" : "standard",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  const RECOMMENDED = 1;

  return (
    <section id="offer" className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SplitReveal
          text={copy.title}
          className="text-foreground text-sm font-bold tracking-wider uppercase"
        />
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.intro}
        </p>
      </div>
      <ul className="flex flex-col gap-8">
        {copy.plans.map((plan, i) => {
          const price = PRICES[currency][i];
          return (
            <Plan key={plan.name} index={i}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-foreground text-sm font-semibold">
                  {plan.name}
                  {i === RECOMMENDED && (
                    <span className="text-muted-foreground ml-2 text-[11px] font-normal">
                      {copy.recommended}
                    </span>
                  )}
                </h3>
                <p className="text-foreground shrink-0 text-sm font-semibold tabular-nums">
                  {price ? (
                    <>
                      <span className="text-muted-foreground mr-1 text-xs font-normal">
                        {copy.from}
                      </span>
                      {format.format(price)}
                    </>
                  ) : (
                    copy.free
                  )}
                </p>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {plan.desc}
              </p>
              <p className="text-muted-foreground/80 text-xs">{plan.time}</p>
              <button
                type="button"
                onClick={() => openChat(copy.ask.replace("{plan}", plan.name))}
                className={`mt-1.5 inline-flex h-8 w-fit cursor-pointer items-center gap-1 rounded-full px-3.5 text-xs font-medium transition-colors ${
                  i === RECOMMENDED
                    ? "bg-foreground text-background hover:bg-foreground/85"
                    : "bg-muted text-foreground hover:bg-muted/70"
                }`}
              >
                {plan.cta}
                <ArrowRight aria-hidden className="size-3" />
              </button>
            </Plan>
          );
        })}
      </ul>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {copy.note}
      </p>
    </section>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring", stiffness: 300, damping: 22 } as const;

/**
 * One plan: a small scene on the left, the text on the right. The scene rests
 * finished, plays as it crosses the middle of the screen, and replays on
 * hover (RantAI's "Why RantAI" tiles).
 */
function Plan({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [run, setRun] = useState(0);
  const centred = useInView(ref, { margin: "-40% 0px -40% 0px" });
  // Plays as it crosses the middle of the screen; hover replays it.
  useEffect(() => {
    if (centred) setRun((r) => r + 1);
  }, [centred]);
  const Scene = SCENES[index];
  return (
    <li
      ref={ref}
      onPointerEnter={(e) => e.pointerType === "mouse" && setRun((r) => r + 1)}
      className="grid gap-4 sm:grid-cols-[9.5rem_1fr]"
    >
      <div
        aria-hidden
        className="bg-muted grid h-28 place-items-center overflow-hidden rounded-xl"
      >
        <Scene run={run} />
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </li>
  );
}

type Scene = { run: number };
// Keyed on `run`: each replay remounts from the "before" pose. run 0 (first
// paint, reduced motion) shows the finished pose with no animation.
const from = <T,>(run: number, pose: T) => (run ? pose : false);

const Window = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background border-border/80 relative h-20 w-28 rounded-md border p-2 shadow-sm">
    {children}
  </div>
);
const Bar = ({ className = "" }: { className?: string }) => (
  <span className={`bg-foreground/15 block h-1.5 rounded-full ${className}`} />
);

/* Honest take: three numbered notes land on the rough spots. */
function Notes({ run }: Scene) {
  const pins = [
    ["left-3 top-1", "1"],
    ["right-2 top-7", "2"],
    ["left-7 bottom-1", "3"],
  ];
  return (
    <Window>
      <Bar className="w-10" />
      <Bar className="mt-2 w-20" />
      <Bar className="mt-1 w-14" />
      <span className="border-foreground/15 mt-3 block h-4 w-12 rounded-sm border" />
      {pins.map(([pos, n], i) => (
        <motion.span
          key={`${run}-${n}`}
          className={`bg-foreground text-background absolute grid size-4 place-items-center rounded-full text-[9px] font-semibold ${pos}`}
          initial={from(run, { scale: 0, opacity: 0 })}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.15 + i * 0.18 }}
        >
          {n}
        </motion.span>
      ))}
    </Window>
  );
}

/* Polish sprint: an uneven card snaps onto one edge and one rhythm. */
function Snap({ run }: Scene) {
  const rows = [
    { x: 7, w: "w-10", d: 0 },
    { x: -5, w: "w-20", d: 0.08 },
    { x: 10, w: "w-14", d: 0.16 },
  ];
  return (
    <Window>
      {rows.map((r, i) => (
        <motion.div
          key={`${run}-${i}`}
          className={i ? "mt-1.5" : ""}
          initial={from(run, { x: r.x })}
          animate={{ x: 0 }}
          transition={{ ...spring, delay: 0.2 + r.d }}
        >
          <Bar className={r.w} />
        </motion.div>
      ))}
      <motion.span
        key={`${run}-btn`}
        className="mt-3 block h-4 w-12"
        initial={from(run, {
          x: 6,
          borderRadius: 0,
          backgroundColor: "var(--muted)",
        })}
        animate={{
          x: 0,
          borderRadius: 999,
          backgroundColor: "var(--foreground)",
        }}
        transition={{ duration: 0.5, ease, delay: 0.45 }}
      />
    </Window>
  );
}

/* Build from scratch: the page goes up block by block. */
function Blocks({ run }: Scene) {
  const blocks = [
    "h-1.5 w-full",
    "mt-2 h-5 w-full",
    "mt-1.5 h-4 w-[30%]",
    "mt-1.5 h-4 w-[30%]",
    "mt-1.5 h-4 w-[30%]",
  ];
  return (
    <Window>
      <div className="flex flex-wrap justify-between">
        {blocks.map((b, i) => (
          <motion.span
            key={`${run}-${i}`}
            className={`bg-foreground/15 block rounded-sm ${b}`}
            initial={from(run, { opacity: 0, y: 6 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.09 }}
          />
        ))}
      </div>
    </Window>
  );
}

const SCENES = [Notes, Snap, Blocks];
