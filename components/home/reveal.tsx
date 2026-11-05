"use client";

import { useEffect, useRef } from "react";

/**
 * Below-the-fold sections stay visible in HTML. The hidden start state is
 * applied only after this effect runs, and only when the section is not
 * already in the first viewport.
 */
export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "visible";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );

    for (const section of sections) {
      const bounds = section.getBoundingClientRect();
      const inFirstViewport =
        bounds.top < window.innerHeight && bounds.bottom > 0;
      if (inFirstViewport) continue;
      section.dataset.reveal = "pending";
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
