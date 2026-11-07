"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState, type RefObject } from "react";

/**
 * Pin `content` centred in the viewport (CSS reads --pin-h). Centring the
 * content itself, not a 100svh stage, leaves no empty band when it unpins.
 * Content taller than the viewport sets data-overflow so CSS can unpin it.
 * Scroll progress should target a `.pin-track` child: it spans exactly the
 * pinned stretch, so 0 and 1 land where the pin starts and ends.
 */
export function usePinCenter(
  section: RefObject<HTMLElement | null>,
  content: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const s = section.current;
    const c = content.current;
    if (!s || !c) return;
    const measure = () => {
      const height = c.getBoundingClientRect().height;
      s.style.setProperty("--pin-h", `${height}px`);
      s.dataset.overflow = String(height + 48 > window.innerHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(c);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [section, content]);
}
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { cn } from "@/lib/utils";

// Pinned step stories, after the RantAI landing page (home-problem.tsx).
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll through a pinned section in `count` steps. JS copies (sticky-safe):
 * overall progress, and progress within the current step.
 */
export function useSteps(
  target: RefObject<HTMLElement | null>,
  count: number,
  reduce: boolean,
) {
  const [index, setIndex] = useState(reduce ? count - 1 : 0);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const overall = useMotionValue(0);
  const step = useMotionValue(0);
  useEffect(() => {
    if (reduce) overall.set(1);
  }, [reduce, overall]);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduce) return;
    const v = Math.max(0, Math.min(1, value));
    overall.set(v);
    const i = Math.min(count - 1, Math.floor(v * count));
    step.set(Math.min(1, v * count - i));
    setIndex(i);
  });
  // Reduced motion shows the finished state.
  return { index: reduce ? count - 1 : index, overall, step };
}

/** One rail segment: fills while its step is on screen. */
function RailSegment({
  overall,
  index,
  count,
  active,
}: {
  overall: MotionValue<number>;
  index: number;
  count: number;
  active: boolean;
}) {
  const width = useTransform(
    overall,
    (v) => `${Math.max(0, Math.min(1, v * count - index)) * 100}%`,
  );
  return (
    <span
      className={cn(
        "bg-border relative h-1 overflow-hidden rounded-full transition-[width] duration-500",
        active ? "w-16" : "w-8",
      )}
    >
      <motion.span
        className="bg-foreground absolute inset-y-0 left-0 rounded-full"
        style={{ width }}
      />
    </span>
  );
}

export function StepRail({
  overall,
  index,
  count,
}: {
  overall: MotionValue<number>;
  index: number;
  count: number;
}) {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap tabular-nums">
        <span className="text-foreground">0{index + 1}</span> / 0{count}
      </span>
      <div className="flex gap-2">
        {Array.from({ length: count }, (_, i) => (
          <RailSegment
            key={i}
            overall={overall}
            index={i}
            count={count}
            active={i === index}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The current step's title and body. Every step sits invisible in the same
 * grid cell, so the block is as tall as the longest one and switching never
 * changes its height. All steps stay readable for screen readers.
 */
export function StepText({
  items,
  index,
  reduce,
  titleClassName,
  bodyClassName,
}: {
  items: { title: string; body: string }[];
  index: number;
  reduce: boolean;
  titleClassName: string;
  bodyClassName: string;
}) {
  const item = items[index];
  // Reduced motion: every step, in focus, as a plain list.
  if (reduce)
    return (
      <ol className="space-y-3">
        {items.map((it) => (
          <li key={it.title}>
            <p className={titleClassName}>{it.title}</p>
            <p className={bodyClassName}>{it.body}</p>
          </li>
        ))}
      </ol>
    );
  return (
    <>
      <ol className="sr-only">
        {items.map((it) => (
          <li key={it.title}>
            {it.title}. {it.body}
          </li>
        ))}
      </ol>
      <div className="grid" aria-hidden="true">
        {items.map((it) => (
          <div key={it.title} className="invisible col-start-1 row-start-1">
            <p className={titleClassName}>{it.title}</p>
            <p className={bodyClassName}>{it.body}</p>
          </div>
        ))}
        <AnimatePresence initial={false}>
          <div key={index} className="col-start-1 row-start-1">
            <SplitReveal
              as="p"
              text={item.title}
              trigger="mount"
              className={titleClassName}
            />
            <motion.p
              className={bodyClassName}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={
                reduce
                  ? undefined
                  : { opacity: 0, transition: { duration: 0.2 } }
              }
              transition={{ duration: 0.5, ease, delay: 0.3 }}
            >
              {item.body}
            </motion.p>
          </div>
        </AnimatePresence>
      </div>
    </>
  );
}
