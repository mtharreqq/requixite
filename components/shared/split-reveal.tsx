"use client";

import { Fragment } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";

// Ported from the RantAI landing page (shared/split-reveal.tsx).
type Tag = "h1" | "h2" | "h3" | "p" | "span";

const ease = [0.22, 1, 0.36, 1] as const;

const unitVariants: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(10px)" },
  shown: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
  exit: {
    opacity: 0,
    y: "-0.3em",
    filter: "blur(10px)",
    transition: { duration: 0.35, ease },
  },
};

export function SplitReveal({
  text,
  as = "h2",
  trigger = "view",
  play = true,
  delay = 0,
  stagger = 0.06,
  from = 0,
  appear = true,
  className,
  id,
}: {
  text: string;
  as?: Tag;
  trigger?: "view" | "mount";
  /** With trigger "mount": false hides the words again, true replays them. */
  play?: boolean;
  delay?: number;
  stagger?: number;
  /** Starting opacity. The hero uses 0.01: fully transparent text does not count for LCP. */
  from?: number;
  /** false: the first render shows the words as-is (server HTML included),
   * so they paint before hydration. Later play changes still animate. */
  appear?: boolean;
  className?: string;
  id?: string;
}) {
  const reduce = Boolean(useReducedMotion());
  const MotionTag = m[as] as typeof m.h2;
  const containerVariants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
    exit: { transition: { staggerChildren: stagger / 2 } },
  };
  const variants: Variants = from
    ? { ...unitVariants, hidden: { ...unitVariants.hidden, opacity: from } }
    : unitVariants;
  // A "\n" in the text forces a line break from the sm breakpoint up.
  const lines = text.split("\n").map((line) => line.trim().split(" "));
  const label = text.replace(/\s*\n\s*/g, " ");

  return (
    <MotionTag
      id={id}
      data-reveal
      className={className}
      variants={containerVariants}
      initial={reduce || !appear ? false : "hidden"}
      exit={reduce ? undefined : "exit"}
      {...(trigger === "mount"
        ? { animate: play ? "shown" : "hidden" }
        : { whileInView: "shown", viewport: { once: true, amount: 0.4 } })}
    >
      {/* The whole sentence for screen readers; the animated words below
          are hidden from them. */}
      <span className="sr-only">{label}</span>
      {lines.map((words, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && (
            <>
              {" "}
              <br className="hidden sm:block" />
            </>
          )}
          {words.map((word, wordIndex) => (
            <Fragment key={`${word}-${wordIndex}`}>
              <span
                aria-hidden="true"
                className="inline-block whitespace-nowrap"
              >
                <m.span
                  // Blurring every word is heavy for phone GPUs: there the
                  // words only fade and rise.
                  className="inline-block max-md:filter-none!"
                  variants={variants}
                >
                  {word}
                </m.span>
              </span>
              {wordIndex < words.length - 1 && " "}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </MotionTag>
  );
}
