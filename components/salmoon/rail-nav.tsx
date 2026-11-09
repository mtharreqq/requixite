"use client";

import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  House,
  Check,
  ChevronRight,
  Languages,
  Mail,
  Monitor,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { smoothScrollTo } from "@/components/smooth-scroll";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Locale } from "@/lib/portfolio-copy";

/** A tick on the rail: an element id on this page and its label. */
export type RailSection = { id: string; label: string };

const MINOR_PER_SECTION = 2;
const STEP = MINOR_PER_SECTION + 1;
// The point of the viewport (from the top) that counts as "currently reading".
const READ_LINE = 0.4;
// How many ticks either side of the cursor get pulled out.
const REACH = 2.5;
const HOVER_REACH = 1.5;
// Tick height (2px) + gap (7px).
const TICK_PITCH = 9;
// Widest tick: major 14px + full pull 18px. Ticks keep this layout width and
// are scaled on the compositor, so scrolling never triggers layout.
const MAX_TICK = 32;
// Each section's hit area spans from halfway to the previous section to halfway to the next.
const BAND = STEP * TICK_PITCH;
// Share of the remaining distance covered each frame. High enough to track a
// scroll in real time, low enough to take the edge off wheel steps.
const EASE = 0.3;
// How long the new section's label stays up after the reader enters it.
const FLASH_MS = 1200;

/**
 * Maps scroll position onto the rail: each section sits on a major tick, and
 * progress moves linearly between them as the reader scrolls through.
 * The top of the page is always 0 and the bottom is always 1.
 */
function readProgress(ids: string[]): number {
  const vh = window.innerHeight;
  const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
  // The scroll position at which each section reaches the read line,
  // clamped to what is actually reachable.
  const stops = ids.map((id) => {
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

function tickStyle(
  i: number,
  cursor: number,
  hoverPos: number,
  hoverAmount: number,
  scale: number,
) {
  const major = i % STEP === 0;
  const scrollPull = Math.max(0, 1 - Math.abs(i - cursor) / REACH);
  const hoverPull =
    hoverAmount * Math.max(0, 1 - Math.abs(i - hoverPos) / HOVER_REACH);
  const pull = Math.max(scrollPull, hoverPull);
  const width = ((major ? 14 : 9) + pull * 18) * scale;
  return {
    transform: `scaleX(${width / MAX_TICK})`,
    opacity: (major ? 0.45 : 0.22) + pull * 0.55,
  };
}

type RailCopy = PortfolioCopy["rail"];

const row =
  "text-muted-foreground hover:text-foreground hover:bg-muted aria-[current=page]:text-foreground flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-xs transition-colors";

/** Theme, a submenu of the menu: light, dark or whatever the OS says. */
function ThemeMenu({ copy }: { copy: RailCopy["pages"] }) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const Current = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  return (
    <HoverCard
      open={open}
      onOpenChange={setOpen}
      openDelay={0}
      closeDelay={150}
    >
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`${row} data-[state=open]:bg-muted data-[state=open]:text-foreground`}
        >
          <Current aria-hidden className="size-3.5" />
          {copy.theme}
          <ChevronRight aria-hidden className="ml-auto size-3.5" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={8}
        alignOffset={-4}
        className="bg-popover/95 border-border/80 w-40 rounded-xl p-1 shadow-xl backdrop-blur-md"
      >
        <div role="menu" aria-label={copy.theme} className="flex flex-col">
          {(
            [
              ["light", copy.light, Sun],
              ["dark", copy.dark, Moon],
              ["system", copy.system, Monitor],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={`${row} aria-checked:text-foreground`}
            >
              <Icon aria-hidden className="size-3.5" />
              {label}
              {theme === value && (
                <Check aria-hidden className="ml-auto size-3.5" />
              )}
            </button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

/** The site's toolbar, on every page: the avatar on the rail opens the
 * pages, theme and language on hover (or tap). */
function Menu({
  copy,
  locale,
  path,
}: {
  copy: RailCopy;
  locale: Locale;
  path: string;
}) {
  const [open, setOpen] = useState(false);
  const base = locale === "id" ? "/id" : "";
  return (
    <HoverCard
      open={open}
      onOpenChange={setOpen}
      openDelay={80}
      closeDelay={150}
    >
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={copy.pages.menu}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`ring-border data-[state=open]:ring-foreground/40 hover:ring-foreground/40 relative mt-6 -ml-1 block size-6 cursor-pointer overflow-hidden rounded-full ring-1 transition-[box-shadow,scale] duration-150 active:scale-90`}
        >
          <Image src="/avatar.png" alt="" width={24} height={24} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="end"
        sideOffset={24}
        className="bg-popover/95 border-border/80 w-44 rounded-xl p-1 shadow-xl backdrop-blur-md"
      >
        <nav aria-label={copy.pages.menu} className="flex flex-col">
          {(
            [
              ["", copy.pages.home, House],
              ["/about", copy.pages.about, User],
              ["/work", copy.pages.work, Briefcase],
              ["/contact", copy.pages.contact, Mail],
            ] as const
          ).map(([p, label, Icon]) => (
            <Link
              key={p}
              href={base + p || "/"}
              onClick={() => setOpen(false)}
              aria-current={
                path === p || (p && path.startsWith(p + "/"))
                  ? "page"
                  : undefined
              }
              className={row}
            >
              <Icon aria-hidden className="size-3.5" />
              {label}
            </Link>
          ))}
          <span aria-hidden className="bg-border mx-2 my-1 h-px" />
          <ThemeMenu copy={copy.pages} />
          <Link
            href={locale === "id" ? path || "/" : `/id${path}`}
            hrefLang={locale === "id" ? "en" : "id"}
            lang={locale === "id" ? "en" : "id"}
            className={row}
          >
            <Languages aria-hidden className="size-3.5" />
            {locale === "id" ? "English" : "Bahasa Indonesia"}
          </Link>
        </nav>
      </HoverCardContent>
    </HoverCard>
  );
}

export function RailNav({
  copy,
  locale,
  path = "",
  sections,
}: {
  copy: RailCopy;
  locale: Locale;
  /** This page, e.g. "/about". */
  path?: string;
  /** This page's sections, top to bottom. */
  sections: RailSection[];
}) {
  const ticks = (sections.length - 1) * STEP + 1;
  // The last one (contact or pricing) only names itself on hover or flash.
  const lastIndex = sections.length - 1;
  const ids = sections.map((s) => s.id).join(" ");
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState(false);
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
    active: -1,
    flashTimer: undefined as ReturnType<typeof setTimeout> | undefined,
  });
  // Starts the animation loop; set once the effect has mounted.
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const a = anim.current;
    const idList = ids.split(" ");
    const phone = window.matchMedia("(max-width: 767px)");

    const paint = () => {
      tickRefs.current.forEach((el, i) => {
        if (!el) return;
        const { transform, opacity } = tickStyle(
          i,
          a.cursor,
          a.hoverPos,
          a.hoverAmount,
          a.scale,
        );
        el.style.transform = transform;
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
      const p = readProgress(idList);
      // The section the reader is inside, not the nearest tick.
      const last = idList.length - 1;
      const index = Math.min(Math.floor(p * last + 1e-6), last);
      a.cursorTarget = p * last * STEP;
      if (index !== a.active) {
        // Name the new section for a moment, while the wave sits on its tick.
        // Not on load: only when the reader actually moves to another one.
        if (a.active !== -1) {
          setFlash(true);
          clearTimeout(a.flashTimer);
          a.flashTimer = setTimeout(() => setFlash(false), FLASH_MS);
        }
        a.active = index;
        setActive(index);
      }
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
      clearTimeout(a.flashTimer);
      a.frame = 0;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ids]);

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
    return Math.min(Math.max(index, 0), sections.length - 1);
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
    const target = document.getElementById(sections[sectionAt(e.clientY)].id);
    if (target)
      smoothScrollTo(target.getBoundingClientRect().top + window.scrollY);
    setScrubbing(false);
    hover(null);
  }

  return (
    <nav
      aria-label={copy.navigation}
      className="fixed top-1/2 left-3 z-50 flex -translate-y-1/2 flex-col items-start md:left-8"
    >
      <div
        ref={railRef}
        onPointerLeave={() => hover(null)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          setScrubbing(false);
          hover(null);
        }}
        className="group/rail relative touch-none"
      >
        {/* Ticks (visual only, sized every frame by the effect above) */}
        <div aria-hidden className="flex flex-col gap-[7px]">
          {Array.from({ length: ticks }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                tickRefs.current[i] = el;
              }}
              className="bg-foreground block h-0.5 w-8 origin-left rounded-full"
              style={tickStyle(i, 0, 0, 0, 1)}
            />
          ))}
        </div>

        {/* Hit areas: one band per section, edge to edge, so the hover never
            drops while moving between sections. Narrow until the rail is
            hovered, then wide enough to cover the labels. */}
        {sections.map((section, index) => {
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
              className={`absolute -left-3 flex items-center outline-none group-focus-within/rail:w-44 group-hover/rail:w-44 ${
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
                          : isActive && flash
                            ? "opacity-100"
                            : // Phones: the rail sits over the story, so
                              // only the flash.
                              isActive && active < lastIndex
                              ? "opacity-0 group-focus-within/rail:opacity-100 group-hover/rail:opacity-100 md:opacity-100"
                              : "opacity-0 group-focus-within/rail:opacity-100 group-hover/rail:opacity-100"
                      } ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }`}
              >
                {section.label}
              </span>
            </a>
          );
        })}
      </div>

      <Menu copy={copy} locale={locale} path={path} />
    </nav>
  );
}
