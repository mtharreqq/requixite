"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";

type TileName =
  | "Figma"
  | "React"
  | "Next.js"
  | "TypeScript"
  | "Tailwind CSS"
  | "PostgreSQL";
const groups: TileName[][] = [
  ["Figma"],
  ["React", "Next.js"],
  ["TypeScript", "Tailwind CSS", "PostgreSQL"],
];

const LOGOS: Record<TileName, string> = {
  Figma: "figma",
  React: "react",
  "Next.js": "nextjs",
  TypeScript: "typescript",
  "Tailwind CSS": "tailwindcss",
  PostgreSQL: "postgresql",
};

function Glyph({ name }: { name: TileName }) {
  return (
    <Image
      src={`/brand-logos/${LOGOS[name]}.svg`}
      alt=""
      width={28}
      height={28}
      className="stack-logo"
    />
  );
}

function Tile({
  name,
  index,
  at,
  progress,
}: {
  name: TileName;
  index: number;
  at: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [at, at + 0.07], [0, 1]);
  const transform = useTransform(
    progress,
    [at, at + 0.11],
    [
      `translate(${index * -17}px, 14px) rotate(-12deg) scale(0.82)`,
      `translate(0px, 0px) rotate(${index % 2 === 0 ? -7 : 6}deg) scale(1)`,
    ],
  );
  return (
    <motion.span
      className="stack-tile"
      data-tool={name}
      title={name}
      style={{ opacity, transform }}
    >
      <Glyph name={name} />
    </motion.span>
  );
}

function Phrase({
  text,
  index,
  progress,
}: {
  text: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <StoryWord
          key={`${word}-${i}`}
          text={word}
          at={0.04 + index * 0.26 + (i / words.length) * 0.14}
          progress={progress}
        />
      ))}
      <span className="stack-inline" aria-hidden="true">
        {groups[index].map((name, i) => (
          <Tile
            key={name}
            name={name}
            index={i}
            at={0.19 + index * 0.26 + i * 0.025}
            progress={progress}
          />
        ))}
      </span>{" "}
    </>
  );
}

function StoryWord({
  text,
  at,
  progress,
}: {
  text: string;
  at: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [at, at + 0.07], [0.2, 1]);
  return (
    <>
      <motion.span aria-hidden="true" style={{ opacity }}>
        {text}
      </motion.span>{" "}
    </>
  );
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
        <h2
          id="stack-heading"
          className="text-sm font-bold tracking-wider uppercase"
        >
          {copy.title}
        </h2>
        <p className="stack-sentence" aria-label={copy.phrases.join(" ")}>
          {copy.phrases.map((text, i) => (
            <Phrase key={text} text={text} index={i} progress={progress} />
          ))}
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
