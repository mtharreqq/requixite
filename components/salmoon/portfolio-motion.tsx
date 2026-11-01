"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export function PortfolioMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.reveal = "visible";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -24px 0px", threshold: 0 },
    );

    const revealAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      sections.forEach((section) => {
        section.dataset.reveal = "";
      });
    };

    if (!preference.matches) {
      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          section.dataset.reveal = "visible";
          return;
        }
        section.dataset.reveal = "pending";
        observer.observe(section);
      });
    }

    preference.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", revealAll);
      sections.forEach((section) => {
        section.dataset.reveal = "";
      });
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className={className}>
        {children}
      </div>
    </MotionConfig>
  );
}

export function SectionReveal({ children }: { children: ReactNode }) {
  return (
    <div data-reveal="" className="w-full">
      {children}
    </div>
  );
}

export function Magnetic({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const horizontal = useSpring(0, { stiffness: 240, damping: 20 });
  const vertical = useSpring(0, { stiffness: 240, damping: 20 });

  function reset() {
    horizontal.set(0);
    vertical.set(0);
  }

  return (
    <div
      className="inline-flex"
      onPointerMove={(event) => {
        if (reducedMotion !== false || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        horizontal.set(
          ((event.clientX - bounds.left) / bounds.width - 0.5) * 8,
        );
        vertical.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 8);
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
    >
      <motion.div
        style={{
          x: reducedMotion ? 0 : horizontal,
          y: reducedMotion ? 0 : vertical,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function PolaroidLink({
  rotation,
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<"a">, "style"> & { rotation: number }) {
  const reducedMotion = useReducedMotion();
  const tiltHorizontal = useSpring(0, { stiffness: 220, damping: 22 });
  const tiltVertical = useSpring(0, { stiffness: 220, damping: 22 });

  function reset() {
    tiltHorizontal.set(0);
    tiltVertical.set(0);
  }

  return (
    <motion.a
      {...props}
      tabIndex={props.tabIndex ?? 0}
      className={cn("polaroid-link", className)}
      style={{
        rotate: rotation,
        rotateX: reducedMotion ? 0 : tiltVertical,
        rotateY: reducedMotion ? 0 : tiltHorizontal,
        transformPerspective: 700,
      }}
      onPointerMove={(event) => {
        if (reducedMotion !== false || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        tiltHorizontal.set(
          ((event.clientX - bounds.left) / bounds.width - 0.5) * 12,
        );
        tiltVertical.set(
          -((event.clientY - bounds.top) / bounds.height - 0.5) * 12,
        );
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
      whileHover={reducedMotion === false ? { y: -7, scale: 1.025 } : undefined}
      whileFocus={reducedMotion === false ? { y: -4 } : undefined}
      whileTap={reducedMotion === false ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}
