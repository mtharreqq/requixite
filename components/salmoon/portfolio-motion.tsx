"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  MotionConfig,
  motion,
  useMotionTemplate,
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
          // Already painted by SSR; animating it now would blink it out and back in.
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
  // One transform string instead of x/y shorthands, so the browser can
  // composite it without Framer recomposing transforms on the main thread.
  const transform = useMotionTemplate`translate3d(${horizontal}px, ${vertical}px, 0)`;

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
      <motion.div style={{ transform: reducedMotion ? "none" : transform }}>
        {children}
      </motion.div>
    </div>
  );
}

const HOVER_SPRING = { stiffness: 280, damping: 22 };

export function PolaroidLink({
  rotation,
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<"a">, "style"> & { rotation: number }) {
  const reducedMotion = useReducedMotion();
  const tiltHorizontal = useSpring(0, { stiffness: 220, damping: 22 });
  const tiltVertical = useSpring(0, { stiffness: 220, damping: 22 });
  const lift = useSpring(0, HOVER_SPRING);
  const zoom = useSpring(1, HOVER_SPRING);
  const hovering = useRef(false);
  const transform = useMotionTemplate`perspective(700px) translateY(${lift}px) rotate(${rotation}deg) rotateX(${tiltVertical}deg) rotateY(${tiltHorizontal}deg) scale(${zoom})`;

  function reset() {
    hovering.current = false;
    tiltHorizontal.set(0);
    tiltVertical.set(0);
    lift.set(0);
    zoom.set(1);
  }

  return (
    <motion.a
      {...props}
      tabIndex={props.tabIndex ?? 0}
      className={cn("polaroid-link", className)}
      style={{
        transform: reducedMotion ? `rotate(${rotation}deg)` : transform,
      }}
      onPointerEnter={(event) => {
        if (reducedMotion !== false || event.pointerType !== "mouse") return;
        hovering.current = true;
        lift.set(-7);
        zoom.set(1.025);
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
      onPointerDown={() => {
        if (reducedMotion === false) zoom.set(0.98);
      }}
      onPointerUp={() => {
        if (reducedMotion === false) zoom.set(hovering.current ? 1.025 : 1);
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onFocus={() => {
        if (reducedMotion === false && !hovering.current) lift.set(-4);
      }}
      onBlur={reset}
    >
      {children}
    </motion.a>
  );
}
