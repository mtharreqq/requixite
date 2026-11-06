"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
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

type TileName =
  | "Lovable"
  | "Bolt"
  | "v0"
  | "Replit"
  | "Cursor"
  | "Claude"
  | "ChatGPT"
  | "Antigravity";
const groups: Record<string, TileName[]> = {
  build: ["Lovable", "Bolt", "v0", "Replit"],
  code: ["Cursor", "Claude", "ChatGPT", "Antigravity"],
};

function Glyph({ name }: { name: TileName }) {
  return (
    <Image
      src={`/ai-logos/${name.toLowerCase()}.svg`}
      alt=""
      width={28}
      height={28}
      className="stack-logo"
    />
  );
}

// Same choreography as the RantAI landing page (home-solution.tsx): words
// light one by one, then the gap after a phrase grows open on a spring and
// the logos pop into it.
const SPAN = 0.9;
const TILE = 0.92;
const OVERLAP = 0.3;
const GAP = 0.2;
const pop = { stiffness: 380, damping: 20 };

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
    <motion.span
      className="stack-tile"
      data-tool={name}
      title={name}
      style={{ scale, opacity: scale, rotate, zIndex: index + 1 }}
    >
      <Glyph name={name} />
    </motion.span>
  );
}

function InlineGroup({
  names,
  at,
  unit,
  progress,
}: {
  names: TileName[];
  at: number;
  unit: number;
  progress: MotionValue<number>;
}) {
  const full = GAP + TILE * names.length - OVERLAP * (names.length - 1);
  const target = useTransform(
    progress,
    [at - unit * 0.1, at + unit * 0.25],
    [0, 1],
  );
  const grow = useSpring(target, { stiffness: 260, damping: 30 });
  const width = useTransform(grow, (v) => `${Math.max(0, v) * full}em`);
  return (
    <motion.span
      className="stack-inline"
      aria-hidden="true"
      style={{ "--w": width, "--full": `${full}em` } as never}
    >
      {names.map((name, i) => (
        <Tile
          key={name}
          name={name}
          index={i}
          from={at + unit * 0.25 + i * unit * 0.45}
          unit={unit}
          progress={progress}
        />
      ))}
    </motion.span>
  );
}

function StoryWord({
  text,
  start,
  unit,
  group,
  tail,
  progress,
}: {
  text: string;
  start: number;
  unit: number;
  group?: TileName[];
  tail?: string;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [start, start + unit], [0.5, 1]);
  // Word and its logos never wrap apart.
  return (
    <span className="inline-block whitespace-nowrap">
      <motion.span aria-hidden="true" style={{ opacity }}>
        {text}
      </motion.span>
      {group && (
        <InlineGroup
          names={group}
          at={start + unit}
          unit={unit}
          progress={progress}
        />
      )}
      {tail && (
        <motion.span aria-hidden="true" style={{ opacity }}>
          {tail}
        </motion.span>
      )}
    </span>
  );
}

function Sentence({
  sentence,
  progress,
}: {
  sentence: string;
  progress: MotionValue<number>;
}) {
  // "{build}," joins the word before it: logos, then the trailing comma.
  const words: { word: string; group?: TileName[]; tail?: string }[] = [];
  for (const token of sentence.split(" ")) {
    const marker = token.match(/^\{(\w+)\}(.*)$/);
    const last = words[words.length - 1];
    if (marker && last) {
      last.group = groups[marker[1]];
      last.tail = marker[2];
    } else words.push({ word: token });
  }
  const unit = SPAN / words.length;
  return words.map(({ word, group, tail }, i) => (
    <span key={`${word}-${i}`}>
      <StoryWord
        text={word}
        start={i * unit}
        unit={unit}
        group={group}
        tail={tail}
        progress={progress}
      />
      {i < words.length - 1 && " "}
    </span>
  ));
}

export function StackStory({ copy }: { copy: PortfolioCopy["stack"] }) {
  const ref = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = ref.current;
    const content = stickyRef.current;
    if (!section || !content) return;
    // Center the content itself once it reaches its pin position. A full-height
    // centered wrapper would insert empty space before the story even enters.
    const measure = () => {
      const height = content.getBoundingClientRect().height;
      section.style.setProperty("--stack-content-height", `${height}px`);
      section.dataset.overflow = String(height + 48 > window.innerHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Keep a JS motion value: native scroll timelines can mismeasure sticky targets.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    progress.set(value),
  );
  const line = useTransform(progress, [0, 0.9], [0, 1]);
  return (
    <section
      ref={ref}
      id="stack"
      className="stack-story w-full"
      aria-labelledby="stack-heading"
      data-reduced={Boolean(reduced)}
    >
      <div ref={stickyRef} className="stack-sticky">
        <SplitReveal
          text={copy.title}
          id="stack-heading"
          className="text-sm font-bold tracking-wider uppercase"
        />
        <p className="stack-sentence">
          <span className="sr-only">{copy.sr}</span>
          <Sentence sentence={copy.sentence} progress={progress} />
        </p>
        <div className="stack-footer">
          <p className="text-muted-foreground max-w-[40ch] text-xs leading-relaxed">
            {copy.note}
          </p>
          <div className="stack-progress" aria-hidden="true">
            <motion.span style={{ scaleX: line }} />
          </div>
        </div>
      </div>
    </section>
  );
}
