"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { HAS_PUBLISHED_WORK } from "@/data/projects";

const ALL_SECTIONS = [
  { id: "home", label: "Intro" },
  { id: "dilemma", label: "Dilemma" },
  { id: "proof", label: "Proof" },
  { id: "process", label: "Process" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
// No published projects means no Work section, so no rail stop for it either.
const SECTIONS = ALL_SECTIONS.filter((s) => s.id !== "work" || HAS_PUBLISHED_WORK);

const MINOR_PER_SECTION = 3;
const STEP = MINOR_PER_SECTION + 1;
const TICKS = (SECTIONS.length - 1) * STEP + 1;
// The point of the viewport (from the top) that counts as "currently reading".
const READ_LINE = 0.4;
// How many ticks either side of the cursor get pulled out.
const REACH = 2.5;
const HOVER_REACH = 1.5;
// Tick height (2px) + gap (7px).
const TICK_PITCH = 9;
// Each section's hit area spans from halfway to the previous section to halfway to the next.
const BAND = STEP * TICK_PITCH;
// Share of the remaining distance covered each frame. High enough to track a
// scroll in real time, low enough to take the edge off wheel steps.
const EASE = 0.3;

/**
 * Maps scroll position onto the rail: each section sits on a major tick, and
 * the cursor moves linearly between them as the reader scrolls through.
 * The top of the page is always 0 and the bottom is always 1.
 */
function readProgress(): number {
  const vh = window.innerHeight;
  const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
  // The scroll position at which each section reaches the read line,
  // clamped to what is actually reachable.
  const stops = SECTIONS.map(({ id }) => {
    const el = document.getElementById(id);
    const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
    return Math.min(Math.max(top - vh * READ_LINE, 0), maxScroll);
  });
  stops[0] = 0;
  stops[stops.length - 1] = maxScroll;

  const y = window.scrollY;
  const last = stops.length - 1;
  for (let i = 0; i < last; i++) {
    if (y < stops[i + 1]) {
      const span = stops[i + 1] - stops[i] || 1;
      const t = Math.min(Math.max((y - stops[i]) / span, 0), 1);
      return (i + t) / last;
    }
  }
  return 1;
}

function tickStyle(i: number, cursor: number, hoverPos: number, hoverAmount: number, scale: number) {
  const major = i % STEP === 0;
  const scrollPull = Math.max(0, 1 - Math.abs(i - cursor) / REACH);
  const hoverPull = hoverAmount * Math.max(0, 1 - Math.abs(i - hoverPos) / HOVER_REACH);
  const pull = Math.max(scrollPull, hoverPull);
  return {
    width: ((major ? 14 : 9) + pull * 18) * scale,
    opacity: (major ? 0.45 : 0.22) + pull * 0.55,
  };
}

export function RailNav() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  // Touch: press and slide along the rail to pick a section, release to go.
  const [scrubbing, setScrubbing] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Animation state lives outside React so the ticks can update every frame
  // without re-rendering the component.
  const anim = useRef({
    cursor: 0,
    cursorTarget: 0,
    hoverPos: 0,
    hoverTarget: 0,
    hoverAmount: 0,
    hoverAmountTarget: 0,
    scale: 1,
    frame: 0,
  });
  // Starts the animation loop; set once the effect has mounted.
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    setMounted(true);
    const a = anim.current;
    const phone = window.matchMedia("(max-width: 767px)");

    const paint = () => {
      tickRefs.current.forEach((el, i) => {
        if (!el) return;
        const { width, opacity } = tickStyle(i, a.cursor, a.hoverPos, a.hoverAmount, a.scale);
        el.style.width = `${width}px`;
        el.style.opacity = `${opacity}`;
      });
    };

    const step = () => {
      a.cursor += (a.cursorTarget - a.cursor) * EASE;
      a.hoverPos += (a.hoverTarget - a.hoverPos) * EASE;
      a.hoverAmount += (a.hoverAmountTarget - a.hoverAmount) * EASE;
      const settled =
        Math.abs(a.cursorTarget - a.cursor) < 0.005 &&
        Math.abs(a.hoverTarget - a.hoverPos) < 0.005 &&
        Math.abs(a.hoverAmountTarget - a.hoverAmount) < 0.005;
      if (settled) {
        a.cursor = a.cursorTarget;
        a.hoverPos = a.hoverTarget;
        a.hoverAmount = a.hoverAmountTarget;
      }
      paint();
      a.frame = settled ? 0 : requestAnimationFrame(step);
    };
    const kick = () => {
      if (!a.frame) a.frame = requestAnimationFrame(step);
    };

    const onScroll = () => {
      const p = readProgress();
      a.cursorTarget = p * (TICKS - 1);
      // The section the reader is inside, not the nearest tick.
      setActive(Math.min(Math.floor(p * (SECTIONS.length - 1) + 1e-6), SECTIONS.length - 1));
      kick();
    };
    const onResize = () => {
      a.scale = phone.matches ? 0.65 : 1;
      onScroll();
    };

    onResize();
    // Start on the right tick instead of sliding in from the top.
    a.cursor = a.cursorTarget;
    paint();

    kickRef.current = kick;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(a.frame);
      a.frame = 0;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function hover(index: number | null) {
    setHovered(index);
    const a = anim.current;
    if (index === null) {
      a.hoverAmountTarget = 0;
    } else {
      // Appear in place rather than sliding in from the last hovered tick.
      if (a.hoverAmount < 0.05) a.hoverPos = index * STEP;
      a.hoverTarget = index * STEP;
      a.hoverAmountTarget = 1;
    }
    kickRef.current();
  }

  function sectionAt(clientY: number): number {
    const rect = railRef.current!.getBoundingClientRect();
    const index = Math.round((clientY - rect.top - 1) / BAND);
    return Math.min(Math.max(index, 0), SECTIONS.length - 1);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrubbing(true);
    hover(sectionAt(e.clientY));
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (scrubbing) hover(sectionAt(e.clientY));
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!scrubbing) return;
    const target = document.getElementById(SECTIONS[sectionAt(e.clientY)].id);
    target?.scrollIntoView({ behavior: "smooth" });
    setScrubbing(false);
    hover(null);
  }

  return (
    <nav
      aria-label="Section navigation"
      onPointerLeave={() => hover(null)}
      className="group/rail fixed top-1/2 left-3 z-50 flex -translate-y-1/2 flex-col items-start md:left-8"
    >
      <div
        ref={railRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          setScrubbing(false);
          hover(null);
        }}
        className="relative touch-none"
      >
        {/* Ticks (visual only, sized every frame by the effect above) */}
        <div aria-hidden className="flex flex-col gap-[7px]">
          {Array.from({ length: TICKS }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                tickRefs.current[i] = el;
              }}
              className="bg-foreground block h-0.5 rounded-full"
              style={tickStyle(i, 0, 0, 0, 1)}
            />
          ))}
        </div>

        {/* Hit areas: one band per section, edge to edge, so the hover never
            drops while moving between sections. Narrow until the rail is
            hovered, then wide enough to cover the labels. */}
        {SECTIONS.map((section, index) => {
          const center = index * STEP * TICK_PITCH + 1;
          const isActive = index === active;
          const isHovered = index === hovered;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? "location" : undefined}
              onPointerEnter={(e) => e.pointerType === "mouse" && hover(index)}
              onFocus={() => hover(index)}
              onBlur={() => hover(null)}
              className={`absolute -left-3 flex items-center outline-none group-hover/rail:w-44 group-focus-within/rail:w-44 ${
                scrubbing ? "w-44" : "w-10 md:w-14"
              }`}
              style={{ top: center - BAND / 2, height: BAND }}
            >
              <span
                className={`absolute left-9 rounded-md px-1.5 py-0.5 text-xs whitespace-nowrap backdrop-blur-sm transition-[opacity,color,background-color] duration-150 md:left-11 ${
                  isHovered
                    ? "bg-muted text-foreground font-medium opacity-100"
                    : `bg-background/95 shadow-xs ${
                        scrubbing
                          ? "opacity-100"
                          : isActive
                            ? // Wide screens have room beside the content, so the current section stays labelled.
                              "opacity-0 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 lg:bg-transparent lg:shadow-none lg:opacity-100"
                            : "opacity-0 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100"
                      } ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }`}
              >
                {section.label}
              </span>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="text-muted-foreground hover:text-foreground -ml-2 mt-6 grid size-7 cursor-pointer place-items-center rounded-full transition-colors"
        aria-label="Toggle theme"
      >
        {mounted && resolvedTheme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      </button>
    </nav>
  );
}
