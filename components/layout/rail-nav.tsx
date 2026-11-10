"use client";

import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { SiteMeta } from "@/components/shared/connect-section";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type Ref,
} from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
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
import { smoothScrollTo } from "@/components/layout/smooth-scroll";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Locale } from "@/lib/portfolio-copy";
import { Sheet, sheetRow } from "@/components/ui/sheet";
import { BAR_QUERY } from "@/lib/touch";
import { MENU_OPEN_EVENT } from "@/lib/menu-events";
import { Dialog } from "radix-ui";

/** A tick on the rail: an element id on this page and its label. */
export type RailSection = { id: string; label: string };

const MINOR_PER_SECTION = 2;
const STEP = MINOR_PER_SECTION + 1;
// The point of the viewport (from the top) that counts as "currently reading".
const READ_LINE = 0.4;
// The visitor's own language pick: proxy.ts honours it over the browser's.
const pickLang = (lang: string) => {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
};

/** Where a click on a section scrolls to. Most land with their top at the
 * top; an anchor marked data-on-read-line sits READ_LINE below the spot
 * it stands for (so the rail turns to it right there), so it lands that
 * much higher. */
function scrollTarget(el: HTMLElement) {
  const top = pageTop(el);
  return el.hasAttribute("data-on-read-line")
    ? top - window.innerHeight * READ_LINE
    : top;
}
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
/** A section's top on the page. Inside a page that closes into the chat
 * (data-page-top: where it starts) the page holds still and shrinks at the
 * end, so its sections count from where they sit in it, not on screen. */
function pageTop(el: HTMLElement) {
  const page = el.closest<HTMLElement>("[data-page-top]");
  if (!page) return el.getBoundingClientRect().top + window.scrollY;
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== page; ) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
    // Offsets start inside each parent's border.
    if (n && n !== page) y += n.clientTop;
  }
  return Number(page.dataset.pageTop) + y;
}

function readProgress(ids: string[]): number {
  const vh = window.innerHeight;
  const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
  // The scroll position at which each section reaches the read line,
  // clamped to what is actually reachable.
  const stops = ids.map((id) => {
    const el = document.getElementById(id);
    const top = el ? pageTop(el) : 0;
    return Math.min(Math.max(top - vh * READ_LINE, 0), maxScroll);
  });
  stops[0] = 0;

  // +1: a fractional scrollY at the bottom still counts as there.
  const y = window.scrollY + 1;
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

/** Touch first (phones, tablets): the bottom bar and sheets. */
function useTouch() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(BAR_QUERY);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(BAR_QUERY).matches,
    () => false,
  );
}

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

// Touch only; the side rail drops the box.
const PILL =
  "pointer-events-auto bg-background/85 border-border/80 rounded-full border backdrop-blur-md side:contents";

const PAGES = [
  ["", "home", House],
  ["/about", "about", User],
  ["/work", "work", Briefcase],
  ["/contact", "contact", Mail],
] as const;

const isHere = (path: string, p: string) =>
  path === p || (!!p && path.startsWith(p + "/"));

// ponytail: any earlier entry counts, so a visit that came from another
// site goes back there. Track in-site moves if that ever bites.
function Back({ label, locale }: { label: string; locale: Locale }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() =>
        history.length > 1
          ? router.back()
          : router.push(locale === "id" ? "/id" : "/")
      }
      className="bar:size-10 bar:before:absolute bar:before:-inset-0.5 bar:before:rounded-full text-muted-foreground hover:text-foreground hover:bg-muted side:fixed side:top-6 side:left-6 side:size-9 relative grid cursor-pointer place-items-center rounded-full transition-[scale,color,background-color] duration-150 active:scale-90"
    >
      <ArrowLeft aria-hidden className="size-[18px]" />
    </button>
  );
}

/** The avatar: the site's menu. On a mouse it opens a card on hover; on touch
 * the whole 40px circle is the button (a 2px halo makes it 44px) and it opens
 * a sheet. */
function AvatarButton(props: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className="group bar:size-10 bar:before:absolute bar:before:-inset-0.5 bar:before:rounded-full side:mt-6 side:-ml-1 relative grid cursor-pointer place-items-center rounded-full transition-[scale] duration-150 active:scale-90"
    >
      {/* Touch: 32px in the 40px button, so it reads as the avatar, not
          a dot in a ring. */}
      <span className="ring-border group-hover:ring-foreground/40 group-data-[state=open]:ring-foreground/40 bar:size-8 block size-6 overflow-hidden rounded-full ring-1 transition-[box-shadow] duration-150">
        <Image
          src="/avatar.png"
          alt=""
          width={32}
          height={32}
          className="size-full"
        />
      </span>
    </button>
  );
}

/** The menu as a dialog in the middle of a wide screen, for an avatar of
 * mine clicked outside the rail (the rail's own opens its hover card). */
function MenuDialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="bg-popover text-popover-foreground border-border/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-[60] w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border p-2 shadow-2xl outline-none"
        >
          <Dialog.Title className="text-muted-foreground px-3 pt-2 pb-1 text-[13px] font-medium">
            {title}
          </Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Pages, theme and language, like an app's settings: in a sheet on touch,
 * or a dialog on a wide screen. */
function MenuSheet({
  copy,
  locale,
  path,
  open,
  onOpenChange,
  as = "sheet",
}: {
  copy: RailCopy;
  locale: Locale;
  path: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  as?: "sheet" | "dialog";
}) {
  const { theme, setTheme } = useTheme();
  const base = locale === "id" ? "/id" : "";
  const Shell = as === "dialog" ? MenuDialog : Sheet;
  return (
    <Shell open={open} onOpenChange={onOpenChange} title={copy.pages.menu}>
      <nav aria-label={copy.pages.menu} className="flex flex-col">
        {PAGES.map(([p, key, Icon]) => (
          <Link
            key={p}
            href={base + p || "/"}
            onClick={() => onOpenChange(false)}
            aria-current={isHere(path, p) ? "page" : undefined}
            className={sheetRow}
          >
            <Icon aria-hidden className="text-muted-foreground size-[18px]" />
            {copy.pages[key]}
            {isHere(path, p) && (
              <Check aria-hidden className="ml-auto size-4" />
            )}
          </Link>
        ))}
      </nav>
      <span aria-hidden className="bg-border mx-3 my-2 block h-px" />
      {/* Theme as a segmented control: all three in reach, one tap. */}
      <div
        role="radiogroup"
        aria-label={copy.pages.theme}
        className="bg-muted mx-1 my-1 grid grid-cols-3 gap-1 rounded-2xl p-1"
      >
        {(
          [
            ["light", copy.pages.light, Sun],
            ["dark", copy.pages.dark, Moon],
            ["system", copy.pages.system, Monitor],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={theme === value}
            onClick={() => setTheme(value)}
            className="text-muted-foreground aria-checked:bg-background aria-checked:text-foreground flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl text-[13px] font-medium transition-[background-color,color,scale] duration-150 active:scale-95 aria-checked:shadow-sm"
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </button>
        ))}
      </div>
      <Link
        href={locale === "id" ? path || "/" : `/id${path}`}
        hrefLang={locale === "id" ? "en" : "id"}
        onClick={() => pickLang(locale === "id" ? "en" : "id")}
        lang={locale === "id" ? "en" : "id"}
        className={`${sheetRow} mt-1`}
      >
        <Languages aria-hidden className="text-muted-foreground size-[18px]" />
        {locale === "id" ? "English" : "Bahasa Indonesia"}
      </Link>
      <span aria-hidden className="bg-border mx-3 my-2 block h-px" />
      <SiteMeta className="text-muted-foreground px-3 pt-1 pb-2 text-center text-[13px]" />
    </Shell>
  );
}

/** The site's toolbar, on every page: the avatar opens the pages, theme and
 * language, in a hover card on a mouse and a sheet on touch. */
function Menu({
  copy,
  locale,
  path,
  touch,
}: {
  copy: RailCopy;
  locale: Locale;
  path: string;
  touch: boolean;
}) {
  // Contact is the chat with me: on a wide screen my avatar there (by the
  // bubbles) opens the menu, so the rail doesn't show a second one.
  const avatar = touch || path !== "/contact";
  const [open, setOpen] = useState(false);
  // An avatar elsewhere asked: the sheet on touch, a dialog on a wide screen.
  const [dialog, setDialog] = useState(false);
  useEffect(() => {
    const onOpen = () => (touch ? setOpen(true) : setDialog(true));
    addEventListener(MENU_OPEN_EVENT, onOpen);
    return () => removeEventListener(MENU_OPEN_EVENT, onOpen);
  }, [touch]);
  const base = locale === "id" ? "/id" : "";
  if (touch)
    return (
      <>
        <AvatarButton
          aria-label={copy.pages.menu}
          aria-haspopup="dialog"
          aria-expanded={open}
          data-state={open ? "open" : "closed"}
          onClick={() => setOpen(true)}
        />
        <MenuSheet
          copy={copy}
          locale={locale}
          path={path}
          open={open}
          onOpenChange={setOpen}
        />
      </>
    );
  return (
    <>
      <MenuSheet
        as="dialog"
        copy={copy}
        locale={locale}
        path={path}
        open={dialog}
        onOpenChange={setDialog}
      />
      {avatar && (
        <HoverCard
          open={open}
          onOpenChange={setOpen}
          openDelay={80}
          closeDelay={150}
        >
          <HoverCardTrigger asChild>
            <AvatarButton
              aria-label={copy.pages.menu}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            />
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="end"
            sideOffset={24}
            className="bg-popover/95 border-border/80 w-44 rounded-xl p-1 shadow-xl backdrop-blur-md"
          >
            <nav aria-label={copy.pages.menu} className="flex flex-col">
              {PAGES.map(([p, key, Icon]) => (
                <Link
                  key={p}
                  href={base + p || "/"}
                  onClick={() => setOpen(false)}
                  aria-current={isHere(path, p) ? "page" : undefined}
                  className={row}
                >
                  <Icon aria-hidden className="size-3.5" />
                  {copy.pages[key]}
                </Link>
              ))}
              <span aria-hidden className="bg-border mx-2 my-1 h-px" />
              <ThemeMenu copy={copy.pages} />
              <Link
                href={locale === "id" ? path || "/" : `/id${path}`}
                hrefLang={locale === "id" ? "en" : "id"}
                onClick={() => pickLang(locale === "id" ? "en" : "id")}
                lang={locale === "id" ? "en" : "id"}
                className={row}
              >
                <Languages aria-hidden className="size-3.5" />
                {locale === "id" ? "English" : "Bahasa Indonesia"}
              </Link>
              <span aria-hidden className="bg-border mx-2 my-1 h-px" />
              <SiteMeta className="text-muted-foreground px-2.5 pt-0.5 pb-1.5 text-[11px]" />
            </nav>
          </HoverCardContent>
        </HoverCard>
      )}
    </>
  );
}

/** Touch: the rail folds into a button like the avatar. It opens every
 * section of the page in a sheet, and a ring around it fills as you read. */
function SectionMenu({
  copy,
  sections,
  active,
  open,
  onOpenChange,
  ringRef,
}: {
  copy: RailCopy;
  sections: RailSection[];
  active: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ringRef: Ref<SVGCircleElement>;
}) {
  return (
    <>
      <button
        type="button"
        aria-label={copy.navigation}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
        className="text-muted-foreground aria-expanded:text-foreground relative grid size-10 cursor-pointer place-items-center rounded-full transition-[color,scale] duration-150 before:absolute before:-inset-0.5 before:rounded-full active:scale-90"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="absolute inset-1 size-8 -rotate-90"
        >
          <circle
            cx="12"
            cy="12"
            r="11.5"
            pathLength={1}
            fill="none"
            strokeWidth="1"
            className="stroke-border"
          />
          <circle
            ref={ringRef}
            cx="12"
            cy="12"
            r="11.5"
            pathLength={1}
            fill="none"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            className="stroke-foreground/60"
          />
        </svg>
        {/* Where you are, inside the ring that fills as you read. */}
        <span
          aria-hidden
          className="text-foreground text-[11px] font-medium tabular-nums"
        >
          {active + 1}/{sections.length}
        </span>
      </button>
      <Sheet open={open} onOpenChange={onOpenChange} title={copy.navigation}>
        <nav aria-label={copy.navigation} className="flex flex-col">
          {sections.map((section, i) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={i === active ? "location" : undefined}
              onClick={(e) => {
                const target = document.getElementById(section.id);
                if (!target) return;
                e.preventDefault();
                onOpenChange(false);
                smoothScrollTo(scrollTarget(target));
              }}
              className={sheetRow}
            >
              <span className="text-muted-foreground w-5 text-center tabular-nums">
                {i + 1}
              </span>
              {section.label}
              {i === active && <Check aria-hidden className="ml-auto size-4" />}
            </a>
          ))}
        </nav>
      </Sheet>
    </>
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
  const touch = useTouch();
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ringRef = useRef<SVGCircleElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      // The touch button's ring: how far down the page you are.
      ringRef.current?.setAttribute(
        "stroke-dashoffset",
        `${1 - a.cursor / Math.max((idList.length - 1) * STEP, 1)}`,
      );
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
    const onResize = () => onScroll();

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

  function sectionAt(e: PointerEvent<HTMLDivElement>): number {
    const rect = railRef.current!.getBoundingClientRect();
    const index = Math.round((e.clientY - rect.top - 1) / BAND);
    return Math.min(Math.max(index, 0), sections.length - 1);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrubbing(true);
    hover(sectionAt(e));
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (scrubbing) hover(sectionAt(e));
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!scrubbing) return;
    const target = document.getElementById(sections[sectionAt(e)].id);
    if (target) smoothScrollTo(scrollTarget(target));
    setScrubbing(false);
    hover(null);
  }

  return (
    <nav
      aria-label={copy.navigation}
      // Touch: a top bar of sections, where you are and the avatar, under
      // the status bar, so the bottom stays the composer's. Mouse: anchored
      // at the avatar, so it stays put and the rail grows upward.
      className="side:inset-x-auto side:top-auto side:bottom-[calc(50%-7rem)] side:left-8 side:flex-col side:items-start pointer-events-none fixed inset-x-4 top-[max(env(safe-area-inset-top),12px)] z-50 flex items-center justify-between"
    >
      {/* Touch: the bar's own material: solid behind the buttons, then a
        short fade, so the page slides under it instead of showing through. */}
      <div
        aria-hidden
        className="touch-bar-fade side:hidden pointer-events-none fixed inset-x-0 top-0 -z-10"
      />
      {/* Touch: sections button, where you are, then the avatar. One
        section (Contact): nothing to navigate, just the avatar. */}
      {/* Contact: sending from another page brings you here, so a way back
        sits where the sections would. */}
      {path === "/contact" && (
        <div className={PILL}>
          <Back label={copy.back} locale={locale} />
        </div>
      )}
      {sections.length > 1 && (
        <>
          <div className={`${PILL} side:hidden`}>
            <SectionMenu
              copy={copy}
              sections={sections}
              active={active}
              open={menuOpen}
              onOpenChange={setMenuOpen}
              ringRef={ringRef}
            />
          </div>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setMenuOpen((o) => !o)}
            // Dead center of the bar, whatever the label's length; no border,
            // just enough backdrop to read over the page.
            className="bg-background/70 side:hidden pointer-events-auto absolute left-1/2 flex h-[42px] max-w-[calc(100%-7rem)] -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full px-3 text-xs backdrop-blur-md before:absolute before:inset-x-0 before:-inset-y-px"
          >
            <span
              key={active}
              className="text-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 truncate font-medium duration-300"
            >
              {sections[active]?.label}
            </span>
          </button>
        </>
      )}
      <div
        hidden={sections.length < 2}
        className={`${PILL} bar:hidden px-4 py-2`}
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
                className="bg-foreground block h-0.5 w-8 shrink-0 origin-left rounded-full"
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
                onPointerEnter={(e) =>
                  e.pointerType === "mouse" && hover(index)
                }
                onFocus={() => hover(index)}
                onBlur={() => hover(null)}
                className={`absolute -left-3 flex items-center outline-none group-focus-within/rail:w-44 group-hover/rail:w-44 ${
                  scrubbing ? "w-44" : "w-14"
                }`}
                style={{ top: center - BAND / 2, height: BAND }}
              >
                <span
                  className={`absolute left-11 rounded-md px-1.5 py-0.5 text-xs whitespace-nowrap backdrop-blur-sm transition-[opacity,color,background-color] duration-150 ${
                    isHovered
                      ? "bg-muted text-foreground font-medium opacity-100"
                      : `bg-background/95 ${
                          scrubbing
                            ? "opacity-100"
                            : isActive && flash
                              ? "opacity-100"
                              : isActive && active < lastIndex
                                ? "opacity-100"
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
      </div>

      <div className={`${PILL} ml-auto`}>
        <Menu copy={copy} locale={locale} path={path} touch={touch} />
      </div>
    </nav>
  );
}
