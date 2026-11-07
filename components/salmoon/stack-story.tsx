"use client";

import { useRef } from "react";
import Image from "next/image";
import { Sparkle } from "lucide-react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { usePinCenter } from "@/components/salmoon/step-story";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TileName = "Cursor" | "Claude" | "ChatGPT" | "Antigravity";
const groups: Record<string, TileName[]> = {
  ai: ["Cursor", "Claude", "ChatGPT", "Antigravity"],
};

// Same choreography as the RantAI landing page (home-solution.tsx): words
// light one by one and the logos pop in beside their label. Sentences take
// turns in one spot, each with its own scroll beat. Every effect is
// transform, opacity or colour, so nothing reflows.
const END = 0.92;
const GAP = 0.05;
const SPAN = 0.5;
const pop = { stiffness: 380, damping: 20 };
const ease = cubicBezier(0.22, 1, 0.36, 1);

function Tile({
  name,
  index,
  from,
  unit,
  progress,
}: {
  name: TileName;
  index: number;
  from: number;
  unit: number;
  progress: MotionValue<number>;
}) {
  const target = useTransform(progress, [from, from + unit * 0.35], [0, 1]);
  const scale = useSpring(target, pop);
  const angle = index % 2 === 0 ? -6 : 4;
  const rotate = useTransform(scale, [0, 1], [angle - 30, angle]);
  return (
    <TooltipPrimitive.Root>
      <TooltipTrigger asChild>
        <motion.span
          className="stack-tile"
          style={{ scale, opacity: scale, rotate, zIndex: index + 1 }}
        >
          <Image
            src={`/ai-logos/${name.toLowerCase()}.svg`}
            alt=""
            width={28}
            height={28}
            className="stack-logo"
          />
        </motion.span>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={8}
        className="data-[state=instant-open]:animate-none! motion-reduce:animate-none!"
      >
        {name}
      </TooltipContent>
    </TooltipPrimitive.Root>
  );
}

// The sparkle icon every "AI-powered" button wears.
const sparks = [
  { left: "calc(100% - 0.12em)", top: "0.02em", size: 0.42, delay: 0 },
  { left: "0.1em", top: "1.05em", size: 0.26, delay: 0.5 },
  { left: "58%", top: "-0.12em", size: 0.2, delay: 1 },
];

function Spark({
  index,
  from,
  progress,
}: {
  index: number;
  from: number;
  progress: MotionValue<number>;
}) {
  const scale = useSpring(
    useTransform(progress, [from, from + 0.04], [0, 1]),
    pop,
  );
  const { left, top, size, delay } = sparks[index];
  return (
    <motion.span
      className="stack-spark"
      style={
        {
          left,
          top,
          "--s": `${size}em`,
          "--d": `${delay}s`,
          scale,
          opacity: scale,
        } as never
      }
    >
      <Sparkle fill="currentColor" strokeWidth={0} />
    </motion.span>
  );
}

function StoryWord({
  text,
  start,
  unit,
  group,
  slop,
  keep,
  tail,
  punch,
  dim,
  fade,
  progress,
}: {
  text: string;
  start: number;
  unit: number;
  group?: TileName[];
  slop?: boolean;
  keep?: boolean;
  tail?: string;
  /** Set when the punch replaces the kept word's period. */
  punch?: string;
  dim: boolean;
  fade: MotionValue<number>;
  progress: MotionValue<number>;
}) {
  const lit = useTransform(progress, [start, start + unit], [0.5, 1]);
  // In the last sentence every word but {keep:...} dims once it has landed.
  const opacity = useTransform([lit, fade], ([o, f]: number[]) =>
    dim && !keep ? o * (1 - f * 0.7) : o,
  );
  const at = start + unit;
  // "AI slop" lights like a word, then washes into the gradient it mocks.
  const slopFill = useTransform(progress, [at, at + unit * 0.6], [0, 1]);
  const slopPlain = useTransform(
    [opacity, slopFill],
    ([o, f]: number[]) => o * (1 - f),
  );
  // The kept word gets a red squiggle, drawn left to right once the rest
  // dims. A discrete trigger plus spring, so it never stalls half-drawn.
  const draw = useSpring(
    useTransform(fade, (v): number => (v > 0.4 ? 1 : 0)),
    { stiffness: 120, damping: 24 },
  );
  // Then its period turns into the punch: "right." becomes "right?".
  const swap = useTransform(progress, [0.82, 0.9], [0, 1]);
  const q = useSpring(swap, pop);
  const dot = useTransform([lit, swap], ([o, s]: number[]) => o * (1 - s));
  // Word, its logos and its punctuation never wrap apart.
  return (
    <span className="inline-block whitespace-nowrap" aria-hidden="true">
      {slop ? (
        <span className="stack-slop">
          <motion.span
            className="stack-slop-plain"
            style={{ opacity: slopPlain }}
          >
            {text}
          </motion.span>
          <motion.span
            className="stack-slop-fill"
            style={{ opacity: slopFill }}
          >
            {text}
          </motion.span>
          {sparks.map((_, i) => (
            <Spark
              key={i}
              index={i}
              from={at + unit * 0.6 + i * unit * 0.5}
              progress={progress}
            />
          ))}
        </span>
      ) : (
        <motion.span
          className={keep ? "stack-keep" : undefined}
          style={{ opacity }}
        >
          {text}
          {keep && (
            <svg
              className="stack-squiggle"
              viewBox="0 0 100 8"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M2 5 Q6.5 1 11 4.5 T20 4.5 T29 5 T38 4 T47 5 T56 4.5 T65 5 T74 4 T83 5 T92 4.5 T98 4"
                style={{ pathLength: draw, opacity: draw }}
              />
            </svg>
          )}
        </motion.span>
      )}
      {group && (
        <span className="stack-inline">
          {group.map((name, i) => (
            <Tile
              key={name}
              name={name}
              index={i}
              from={at + i * unit * 0.45}
              unit={unit}
              progress={progress}
            />
          ))}
        </span>
      )}
      {tail &&
        (keep && punch ? (
          <span className="stack-end">
            <motion.span style={{ opacity: dot }}>{tail}</motion.span>
            <motion.span className="stack-q" style={{ scale: q, opacity: q }}>
              {punch}
            </motion.span>
          </span>
        ) : (
          <motion.span style={{ opacity }}>{tail}</motion.span>
        ))}
    </span>
  );
}

/** A punchline on its own line, after the last sentence has landed. */
function Punch({
  text,
  progress,
}: {
  text: string;
  progress: MotionValue<number>;
}) {
  const scale = useSpring(useTransform(progress, [0.82, 0.9], [0, 1]), pop);
  const y = useTransform(scale, [0, 1], ["0.3em", "0em"]);
  return (
    <motion.span
      aria-hidden="true"
      className="stack-punch"
      style={{ scale, opacity: scale, y }}
    >
      {text}
    </motion.span>
  );
}

function Line({
  sentence,
  index,
  count,
  punch,
  progress,
}: {
  sentence: string;
  index: number;
  count: number;
  punch: string;
  progress: MotionValue<number>;
}) {
  const seg = END / count;
  const s0 = index * seg;
  const s1 = s0 + seg;
  const first = index === 0;
  const last = index === count - 1;
  // Enter and exit like SplitReveal. The first sentence is already there
  // when the section arrives; the last one stays.
  const enter = first
    ? []
    : [
        [s0, 0, 0.4],
        [s0 + GAP * 0.8, 1, 0],
      ];
  const exit = last
    ? []
    : [
        [s1 - GAP, 1, 0],
        [s1 - GAP * 0.2, 0, -0.3],
      ];
  const frames = [...enter, ...exit];
  if (!frames.length) frames.push([0, 1, 0], [1, 1, 0]);
  const keys = frames.map((f) => f[0]);
  const opacity = useTransform(
    progress,
    keys,
    frames.map((f) => f[1]),
    { ease },
  );
  const y = useTransform(
    progress,
    keys,
    frames.map((f) => f[2]),
    { ease },
  );
  const style = {
    opacity,
    y: useTransform(y, (v) => `${v}em`),
    filter: useTransform(opacity, (v) =>
      v >= 1 ? "none" : `blur(${(1 - v) * 10}px)`,
    ),
    pointerEvents: useTransform(opacity, (v) => (v > 0.5 ? "auto" : "none")),
  };
  // Words light over the first half of the beat, effects play after.
  const local = useTransform(
    progress,
    [first ? 0 : s0 + GAP * 0.8, last ? END : s1 - GAP],
    [0, 1],
  );
  const fade = useTransform(local, [0.62, 0.76], [0, 1]);
  // Split on spaces outside {key:label} markers; "{slop:label}." keeps its
  // trailing punctuation as a tail.
  const words = sentence.split(/ (?![^{]*\})/).map((token) => {
    const marker = token.match(/^\{(\w+):([^}]+)\}(.*)$/);
    return marker
      ? {
          word: marker[2],
          group: groups[marker[1]],
          slop: marker[1] === "slop",
          keep: marker[1] === "keep",
          tail: marker[3],
        }
      : { word: token };
  });
  const hasKeep = words.some((w) => w.keep);
  // "?" swaps in for the kept word's period; a phrase gets its own line.
  const swapsPunch = hasKeep && /^\p{P}+$/u.test(punch);
  const unit = SPAN / words.length;
  return (
    <motion.span className="stack-line" style={style}>
      {words.map(({ word, group, slop, keep, tail }, i) => (
        <span key={`${word}-${i}`}>
          <StoryWord
            text={word}
            start={i * unit}
            unit={unit}
            group={group}
            slop={slop}
            keep={keep}
            tail={tail}
            punch={swapsPunch ? punch : undefined}
            dim={last && hasKeep}
            fade={fade}
            progress={local}
          />
          {i < words.length - 1 && " "}
        </span>
      ))}
      {last && !swapsPunch && <Punch text={punch} progress={local} />}
      {/* Separates sentences when the static fallback shows them inline. */}{" "}
    </motion.span>
  );
}

export function StackStory({ copy }: { copy: PortfolioCopy["stack"] }) {
  const ref = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  usePinCenter(ref, stickyRef);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  // Keep a JS motion value: native scroll timelines can mismeasure sticky targets.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    progress.set(value),
  );
  return (
    <section
      ref={ref}
      id="stack"
      className="stack-story w-full"
      aria-labelledby="stack-heading"
      data-reduced={Boolean(reduced)}
    >
      <div ref={track} className="pin-track" aria-hidden="true" />
      <div ref={stickyRef} className="stack-sticky">
        <SplitReveal
          text={copy.title}
          id="stack-heading"
          className="text-sm font-bold tracking-wider uppercase"
        />
        <TooltipProvider delayDuration={150} skipDelayDuration={300}>
          <p className="stack-sentence">
            <span className="sr-only">{copy.sr}</span>
            {copy.sentences.map((sentence, i) => (
              <Line
                key={sentence}
                sentence={sentence}
                index={i}
                count={copy.sentences.length}
                punch={copy.punch}
                progress={progress}
              />
            ))}
          </p>
        </TooltipProvider>
        <div className="stack-footer">
          <p className="text-muted-foreground max-w-[40ch] text-xs leading-relaxed">
            {copy.note}
          </p>
        </div>
      </div>
    </section>
  );
}
