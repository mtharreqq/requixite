"use client";

import { type ReactNode } from "react";
import { LazyMotion, MotionConfig, m, useReducedMotion } from "framer-motion";

// The animation engine loads after the page has painted: the server HTML
// already holds every starting style, so nothing waits on it.
const domAnimation = () =>
  import("@/lib/motion-features").then((mod) => mod.domAnimation);
const domMax = () => import("@/lib/motion-features").then((mod) => mod.domMax);

export function PortfolioMotion({
  children,
  className,
  layout,
}: {
  children: ReactNode;
  className?: string;
  /** Layout animations (the home story) need the bigger feature set. */
  layout?: boolean;
}) {
  return (
    <LazyMotion features={layout ? domMax : domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className={className}>{children}</div>
      </MotionConfig>
    </LazyMotion>
  );
}

/** RantAI's MotionInView: the section fades up once; its title words reveal on their own. */
export function SectionReveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      data-reveal
      className="w-full"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
