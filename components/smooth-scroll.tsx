"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useSyncExternalStore } from "react";

// Same as the RantAI landing page (layout/smooth-scroll.tsx): Lenis only for
// mouse/trackpad desktops; touch keeps native inertia.
const DESKTOP_MOTION =
  "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

let activeLenis: Lenis | null = null;
let glide = 0;

/**
 * Without Lenis (phones), glides there frame by frame: native smooth
 * scrolling is not reliable everywhere. A touch or wheel stops it.
 */
function glideTo(y: number, duration: number) {
  cancelAnimationFrame(glide);
  const from = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.max(0, Math.min(max, y));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || Math.abs(to - from) < 2) {
    window.scrollTo(0, to);
    return;
  }
  const stop = () => {
    cancelAnimationFrame(glide);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("wheel", stop);
  };
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("wheel", stop, { passive: true });
  const start = performance.now();
  const ms = duration * 1000;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    // A soft ease in and out, so the middle of a long trip doesn't rush
    const k = (1 - Math.cos(Math.PI * t)) / 2;
    window.scrollTo(0, from + (to - from) * k);
    if (t < 1) glide = requestAnimationFrame(tick);
    else stop();
  };
  glide = requestAnimationFrame(tick);
}

/** Smoothly scrolls to `y`, through Lenis when it is running. */
export function smoothScrollTo(y: number, duration = 0.9) {
  if (activeLenis) activeLenis.scrollTo(y, { duration });
  else glideTo(y, duration);
}

/** Jumps straight to `y`, no glide. */
export function jumpTo(y: number) {
  cancelAnimationFrame(glide);
  if (activeLenis) activeLenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "instant" });
}

/** Enhanced scrolling is for mouse/trackpad desktops; touch keeps native inertia. */
export function useDesktopMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(DESKTOP_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP_MOTION).matches,
    () => false,
  );
}

export function SmoothScroll() {
  const desktopMotion = useDesktopMotion();

  useEffect(() => {
    if (!desktopMotion) return;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: true });
    activeLenis = lenis;
    return () => {
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
    };
  }, [desktopMotion]);

  return null;
}
