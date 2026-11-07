"use client";

import { type ReactNode } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

export function PortfolioMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={className}>{children}</div>
    </MotionConfig>
  );
}

/** RantAI's MotionInView: the section fades up once; its title words reveal on their own. */
export function SectionReveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className="w-full"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
