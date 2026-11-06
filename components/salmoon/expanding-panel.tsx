"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * After the RantAI landing page (platform/expanding-panel.tsx): a dark panel
 * that grows to the full width of the screen as it scrolls into place, then
 * settles back into a card as it scrolls out.
 *
 * The growth is a clip-path on a full-width backdrop, not a change of size:
 * the content keeps one width the whole time, so nothing inside re-wraps and
 * nothing below moves while scrolling.
 */
export function ExpandingPanel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The card is shorter than the screen, so it peaks at the centre instead of
  // RantAI's "start start" (its panels are taller than the screen).
  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ["center center", "end start"],
  });
  // JS copy, mapped straight onto styles (sticky-safe).
  const open = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const k = Math.min(
        Math.min(1, Math.max(0, (enter.get() - 0.5) / 0.5)),
        1 - Math.min(1, Math.max(0, exit.get() / 0.5)),
      );
      open.set(k * k * (3 - 2 * k));
    };
    update();
    const a = enter.on("change", update);
    const b = exit.on("change", update);
    return () => {
      a();
      b();
    };
  }, [enter, exit, open]);

  // Distance from the card to each screen edge: the backdrop reaches the
  // edges, the clip pulls it back to the card.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--l", `${r.left}px`);
      el.style.setProperty(
        "--r",
        `${document.documentElement.clientWidth - r.right}px`,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  // 0 = the card, 1 = full width.
  const k = useTransform(open, (v) => (reduce ? 0 : v));

  return (
    <motion.div
      ref={ref}
      className="dark text-foreground relative isolate p-5"
      style={{ "--k": k } as never}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[calc(-1*var(--r,0px))] left-[calc(-1*var(--l,0px))] -z-10 bg-black [clip-path:inset(0_calc((1-var(--k))*var(--r,0px))_0_calc((1-var(--k))*var(--l,0px))_round_calc((1-var(--k))*18px))]"
      />
      {children}
    </motion.div>
  );
}
