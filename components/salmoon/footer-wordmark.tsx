"use client";

import { useEffect, useRef } from "react";
import { m, useReducedMotion } from "framer-motion";
import { useDesktopMotion } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";

// Ported from the RantAI landing page (layout/footer-motion.tsx).
const ease = [0.22, 1, 0.36, 1] as const;
const letterClass = "inline-block bg-linear-to-b bg-clip-text text-transparent";

/**
 * Letters rise in; near the cursor they lift and darken, so moving across
 * the word sends a soft wave through it. Its parent must crop it
 * (overflow-hidden) and sit inside <main>.
 */
export function FooterWordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktopMotion = useDesktopMotion();
  const letters = Array.from(text);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduce) return;
    const waves = [...root.querySelectorAll<HTMLElement>("[data-wave]")];
    const inks = [...root.querySelectorAll<HTMLElement>("[data-wave-ink]")];
    const current = waves.map(() => 0);
    let pointerX: number | null = null;
    let frame = 0;

    const tick = () => {
      let moving = false;
      const reach = root.clientWidth * 0.18;
      waves.forEach((el, i) => {
        let goal = 0;
        if (pointerX !== null) {
          const r = el.getBoundingClientRect();
          const k = Math.max(
            0,
            1 - Math.abs(pointerX - (r.left + r.width / 2)) / reach,
          );
          goal = k * k * (3 - 2 * k);
        }
        // Ease toward the goal so the wave follows the cursor smoothly.
        current[i] += (goal - current[i]) * 0.12;
        if (Math.abs(goal - current[i]) > 0.002) moving = true;
        el.style.transform = `translateY(${-8 * current[i]}%)`;
        inks[i].style.opacity = String(current[i]);
      });
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      kick();
    };
    const leave = () => {
      pointerX = null;
      kick();
    };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  // Overscroll reveal: the wordmark is cropped by its parent's bottom edge.
  // Scrolling on past the end of the page stretches the parent (with growing
  // resistance) to show the whole word, and the page content lifts by the
  // same amount so the new space stays in view. On release it settles back.
  // RantAI lifts its <footer>, which fills the screen there; here the footer
  // is a few lines under the contact card, so lifting only it slid it over
  // the card. Lifting all of <main> moves everything together.
  useEffect(() => {
    const root = ref.current;
    const panel = root?.parentElement;
    const page = root?.closest("main");
    // Never intercept touch scrolling: Safari must keep its own rubber band.
    if (!root || !panel || !page || !desktopMotion) return;

    let pull = 0; // raw input since the pull started
    let shown = 0; // pixels currently revealed
    let room = 0; // pixels needed to show the whole word
    let frame = 0;
    let release: ReturnType<typeof setTimeout> | undefined;

    const atBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - shown - 4;

    const measure = () => {
      const word = root.firstElementChild?.getBoundingClientRect();
      const edge = panel.getBoundingClientRect().bottom;
      room = word ? Math.max(0, word.bottom - edge) + 40 : 0;
    };

    const apply = () => {
      root.style.marginBottom = shown ? `calc(-0.2em + ${shown}px)` : "";
      // Reaches full solid colour by about three quarters of the way: the
      // rubber band only creeps toward its end.
      const progress = room ? shown / room : 0;
      const solid = Math.min(1, Math.max(0, (progress - 0.1) / 0.65));
      root.style.setProperty("--pull", String(solid));
      page.style.transform = shown ? `translateY(${-shown}px)` : "";
    };

    const tick = () => {
      // Rubber band: easy at first, then harder the further it goes.
      const goal = room * (1 - Math.exp(-pull / (room * 1.4)));
      shown += (goal - shown) * 0.18;
      if (Math.abs(goal - shown) < 0.4) shown = goal;
      apply();
      frame = shown !== goal ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    /** Returns true when this input was used for the pull. */
    const take = (delta: number) => {
      if (pull === 0) {
        if (delta <= 0 || !atBottom()) return false;
        measure();
        if (!room) return false;
      }
      pull = Math.max(0, pull + delta);
      clearTimeout(release);
      release = setTimeout(() => {
        pull = 0;
        kick();
      }, 180);
      kick();
      return true;
    };

    // Capture phase, so the smooth scroller never sees a wheel we used.
    const onWheel = (e: WheelEvent) => {
      if (take(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("wheel", onWheel, {
      capture: true,
      passive: false,
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(release);
      window.removeEventListener("wheel", onWheel, { capture: true });
      root.style.marginBottom = "";
      root.style.removeProperty("--pull");
      page.style.transform = "";
    };
  }, [desktopMotion]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative select-none", className)}
    >
      <m.p
        className="flex justify-center"
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.06 }}
      >
        {letters.map((char, i) => (
          <m.span
            key={`${char}-${i}`}
            className="inline-block"
            variants={{
              hidden: { y: "45%", opacity: 0 },
              shown: {
                y: "0%",
                opacity: 1,
                transition: { duration: 1.1, ease },
              },
            }}
          >
            <span data-wave className="relative inline-block">
              <span
                className={cn(
                  letterClass,
                  "from-foreground/[0.08] to-transparent",
                )}
              >
                {char}
              </span>
              {/* Solid copy that takes over as the visitor pulls past the end */}
              <span
                className="text-foreground absolute inset-0 inline-block"
                style={{ opacity: "var(--pull, 0)" }}
              >
                {char}
              </span>
              {/* Darker copy, faded in as the cursor comes near */}
              <span
                data-wave-ink
                className={cn(
                  letterClass,
                  "from-foreground/[0.42] to-foreground/[0.06] absolute inset-0",
                )}
                style={{ opacity: 0 }}
              >
                {char}
              </span>
            </span>
          </m.span>
        ))}
      </m.p>
    </div>
  );
}
