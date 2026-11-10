"use client";

// A sub-page that ends in the chat. You read it as usual; past its end the
// page holds still and its last screen shrinks, like an app you swipe away,
// into a link preview in a chat with me. Then I ask about your app and offer
// the other pages, over the composer at the bottom, the bubbles stacking up
// from below like the home page's end.

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Briefcase, House, Mail, User } from "lucide-react";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { AskBox } from "@/components/chat/ask-box";
import { QuickReply } from "@/components/shared/quick-reply";
import { MenuAvatar } from "@/components/shared/menu-avatar";
import { Moving } from "@/components/chat/replies";
import { cn } from "@/lib/utils";

const ICONS = {
  "": House,
  "/about": User,
  "/work": Briefcase,
  "/contact": Mail,
};
const EASE = [0.22, 1, 0.36, 1] as const;
const icon =
  "text-muted-foreground group-hover:text-foreground size-4 transition-[color,scale] duration-200 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100";
const bubble =
  "bg-muted w-fit max-w-[min(85%,26rem)] rounded-[20px] rounded-bl-md px-3.5 py-2 text-[15px] leading-snug";
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// Slow to start, so the page doesn't jump as it begins to shrink.
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** 0 to 1 as `t` goes from a to b. */
function useBetween(t: MotionValue<number>, a: number, b: number) {
  return useTransform(t, (v) => clamp01((v - a) / (b - a)));
}

// Reduced motion, or a screen too short to pin: the page, then the chat
// under it, no shrinking. Same as the home story's still mode.
const STILL = "(prefers-reduced-motion: reduce), (max-height: 600px)";
function useStill() {
  return useSyncExternalStore(
    (cb) => {
      const q = matchMedia(STILL);
      q.addEventListener("change", cb);
      return () => q.removeEventListener("change", cb);
    },
    () => matchMedia(STILL).matches,
    () => false,
  );
}

/** Offset of `el` inside `root`, as laid out: transforms (a layout glide
 * mid-way) don't count. Offsets start inside each parent's border, so the
 * borders on the way up (the card's 3px frame) are added back. */
function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
    if (n && n !== root) {
      x += n.clientLeft;
      y += n.clientTop;
    }
  }
  return { x, y };
}

/** The other pages to look around, starting after this one; three of
 * them. Case studies count as Work, and offer it first. */
function usePages(locale: Locale, path: string) {
  const { skip } = getPortfolioCopy(locale).review;
  const base = locale === "id" ? "/id" : "";
  const all = [
    ["", skip.home, skip.short.home],
    ["/about", skip.about, skip.short.about],
    ["/work", skip.work, skip.short.work],
    ["/contact", skip.contact, skip.short.contact],
  ] as const;
  const at = all.findIndex(([p]) => p && (path + "/").startsWith(p + "/"));
  const next = [...all.slice(at + 1), ...all.slice(0, at + 1)].filter(
    ([p]) => p !== path,
  );
  // From a case study, its section (Work, the other projects) comes first.
  const parent = next.find(([p]) => p && path.startsWith(p + "/"));
  return (parent ? [parent, ...next.filter((n) => n !== parent)] : next)
    .slice(0, 3)
    .map(([p, label, short]) => ({
      href: base + p || "/",
      label,
      short,
      Icon: ICONS[p],
    }));
}

export function LookAround({ locale, path }: { locale: Locale; path: string }) {
  const { skip } = getPortfolioCopy(locale).review;
  const pages = usePages(locale, path);
  return (
    <>
      <p className="px-3.5 py-2 text-[15px] leading-snug">{skip.more}</p>
      <nav
        // Read without the emoji.
        aria-label={skip.more.replace(/\s*\p{Extended_Pictographic}/gu, "")}
        className="border-background grid grid-cols-3 border-t"
      >
        {pages.map(({ href, label, short, Icon }, i) => (
          <QuickReply
            key={href}
            cell
            href={href}
            label={label}
            short={short}
            icon={<Icon aria-hidden className={icon} />}
            className={i === 1 ? "border-background border-x" : undefined}
          />
        ))}
      </nav>
    </>
  );
}

const Avatar = ({ locale }: { locale: Locale }) => (
  <MenuAvatar label={getPortfolioCopy(locale).rail.pages.menu} />
);

export function CloseIntoChat({
  locale,
  path,
  title,
  children,
}: {
  locale: Locale;
  path: string;
  /** The page's name, on its preview card. */
  title: string;
  children: ReactNode;
}) {
  const { cta } = getPortfolioCopy(locale).review;
  const ask = cta.pages[path] ?? cta;
  const url = `requixite.my.id${locale === "id" ? "/id" : ""}${path}`;
  const still = useStill();

  const root = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  // 0 reading or closing, 1 landed, 2 my question in, 3 look around in.
  const [phase, setPhase] = useState(0);
  const phaseRef = useRef(0);
  // The section's page top, the page's height, the screen, where the card
  // lands (in the screen) at what scale, and its picture's height.
  const [box, setBox] = useState({
    top: 0,
    h: 0,
    vh: 800,
    vw: 400,
    x: 0,
    y: 0,
    s: 0.4,
    sh: 200,
    ready: false,
  });
  useLayoutEffect(() => {
    if (still) return;
    const measure = () => {
      const r = root.current;
      const pg = page.current;
      const st = stage.current;
      const sl = slot.current;
      if (!r || !pg || !st || !sl) return;
      const o = offsetIn(sl, st);
      // Where the card lands: right over the composer, before any bubble
      // has pushed it up.
      const landing = phaseRef.current < 2;
      setBox((b) => ({
        top: r.getBoundingClientRect().top + window.scrollY,
        h: pg.offsetHeight,
        vh: st.offsetHeight,
        vw: st.offsetWidth,
        x: landing ? o.x : b.x,
        y: landing ? o.y : b.y,
        s: sl.offsetWidth / st.offsetWidth,
        sh: sl.offsetHeight,
        ready: true,
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (page.current) ro.observe(page.current);
    if (stage.current) ro.observe(stage.current);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
  }, [still]);

  // Once landed, a still copy of the page's last screen takes over inside
  // the card, so it rides with the card as the bubbles push it up or let it
  // down; the page itself hides until you scroll back. A copy of what's on
  // screen, not a second render: no ids, nothing to focus or click.
  const host = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const h = host.current;
    const pg = page.current;
    if (still || !h || !pg) return;
    if (phase === 0) {
      h.replaceChildren();
      return;
    }
    if (h.firstChild) return;
    const copy = pg.cloneNode(true) as HTMLElement;
    copy.removeAttribute("data-page-top");
    copy.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
    copy.style.cssText = `position:relative;width:${box.vw}px;transform:translateY(${-Math.max(box.h - box.vh, 0)}px)`;
    h.replaceChildren(copy);
  }, [phase, still, box.vw, box.h, box.vh]);

  const lift = Math.max(box.h - box.vh, 0); // where the page holds still
  const CLOSE = box.vh * 1.5; // scroll that closes it into the chat
  const HOLD = box.vh * 0.5; // then the chat holds still
  const { scrollY } = useScroll();
  // 0 reading, 1 closed into the chat.
  const close = useTransform(scrollY, (v) =>
    clamp01((v - box.top - lift) / CLOSE),
  );
  const shrink = useTransform(close, (t) => easeInOut(clamp01(t / 0.6)));
  const sc = useTransform(shrink, (t) => 1 - t * (1 - box.s));
  const tx = useTransform(shrink, (t) => t * box.x);
  const ty = useTransform(shrink, (t) => t * box.y);
  // The page holds with its last screen showing; that screen scales about
  // its own top-left corner into the card's picture, the rest clipped, its
  // bottom third fading. In the page's own pixels, hence the divides.
  const top = lift;
  const clip = useTransform(shrink, (t) => {
    if (t < 0.001) return "none";
    const s = 1 - t * (1 - box.s);
    const cut = Math.max(0, box.vh - box.sh / box.s) * t;
    const r = (t * 20) / s;
    return `inset(${top}px 0 ${cut}px 0 round ${r}px ${r}px 0 0)`;
  });
  const mask = useTransform(shrink, (t) => {
    if (t < 0.01) return "none";
    const vis = box.vh - Math.max(0, box.vh - box.sh / box.s) * t;
    return `linear-gradient(to bottom, #000 ${top + vis - vis * 0.35 * t}px, rgb(0 0 0 / ${1 - t}) ${top + vis}px)`;
  });
  const chatIn = useBetween(close, 0.35, 0.55);
  const fades = useTransform(chatIn, (v) => 1 - v);
  useMotionValueEvent(close, "change", (t) => {
    const next = t < 0.6 ? 0 : t < 0.7 ? 1 : t < 0.82 ? 2 : 3;
    phaseRef.current = next;
    setPhase(next);
  });
  // The card's glide, the same as the page's in it (no spring), so the
  // page never slips off the card while bubbles push it up or let it down.
  const glide = { layout: { duration: 0.4, ease: EASE } };
  // In from below; what's already there glides up to make room.
  const arrive = {
    layout: "position" as const,
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
    transition: { duration: 0.4, ease: EASE, layout: glide.layout },
  };

  if (still)
    return (
      <>
        <div className="flex w-full justify-center">{children}</div>
        <section
          id="contact"
          className="bar:pb-[max(env(safe-area-inset-bottom),12px)] mx-auto flex w-full max-w-lg flex-col gap-3 px-4 pt-6 pb-16 md:max-w-xl"
        >
          <div className="flex items-end gap-2">
            <Avatar locale={locale} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className={bubble}>{ask.title}</p>
              <div className="bg-muted w-[min(85%,26rem)] overflow-hidden rounded-[20px] rounded-bl-md">
                <LookAround locale={locale} path={path} />
              </div>
            </div>
          </div>
          <Moving locale={locale} />
          <AskBox locale={locale} title={ask.title} placeholder={ask} />
        </section>
      </>
    );

  return (
    <div ref={root} className="relative w-full">
      {/* Long pages scroll under soft edges; they go as the chat comes. */}
      <m.div style={{ opacity: fades }} aria-hidden>
        <div className="edge-fade top-0" />
        <div className="edge-fade bottom-0 rotate-180" />
      </m.div>
      {/* The rail's last stop, where the chat has come in (on its read
          line, like the home story's chapters). */}
      <div
        id="contact"
        aria-hidden
        data-on-read-line
        className="pointer-events-none absolute inset-x-0"
        style={{ top: lift + CLOSE * 0.6 + box.vh * 0.4 }}
      />
      {/* The page. Past its end it holds, its last screen on screen, and
          shrinks into the card. */}
      <m.div
        ref={page}
        // For the rail: its sections count from here, not from the screen.
        data-page-top={box.top}
        className="bg-background sticky z-10 flex min-h-svh w-full justify-center"
        style={{
          top: box.ready ? -lift : undefined,
          x: tx,
          y: ty,
          scale: sc,
          transformOrigin: `0px ${top}px`,
          clipPath: clip,
          maskImage: mask,
          WebkitMaskImage: mask,
          // Landed: the still copy in the card has taken over.
          visibility: phase >= 1 ? "hidden" : "visible",
        }}
      >
        {children}
      </m.div>
      <div aria-hidden style={{ height: CLOSE + HOLD }} />

      {/* The chat the page closes into, behind it, over the whole screen. */}
      <m.div
        ref={stage}
        style={{ opacity: chatIn }}
        inert={phase === 0}
        className="fixed inset-0 z-0"
      >
        <div className="bar:pb-[max(env(safe-area-inset-bottom),12px)] mx-auto flex h-full w-full max-w-lg flex-col justify-end gap-3 px-4 pb-16 md:max-w-xl">
          <div className="flex items-end gap-2">
            <Avatar locale={locale} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <m.p
                layout="position"
                transition={glide}
                className="text-muted-foreground ml-1 text-xs"
              >
                Tharreq
              </m.p>
              {/* A link preview. The bubble's grey runs round the white page
                  as a 3px frame; the page lands in the picture. */}
              <m.div
                layout="position"
                transition={glide}
                className="bg-muted border-muted w-[min(72%,18rem)] overflow-hidden rounded-[20px] rounded-bl-md border-[3px]"
              >
                <div
                  ref={slot}
                  className="relative aspect-[16/10] overflow-hidden"
                  // The page's own fade, once it's the still copy.
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, #000 65%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 65%, transparent)",
                  }}
                >
                  <div
                    ref={host}
                    aria-hidden
                    inert
                    className="bg-background pointer-events-none absolute top-0 left-0 origin-top-left overflow-hidden"
                    style={{
                      width: box.vw,
                      height: box.vh,
                      transform: `scale(${box.s})`,
                    }}
                  />
                </div>
                <div className="px-3.5 py-2.5">
                  <p className="text-[15px] leading-snug font-medium">
                    {title}
                  </p>
                  <p className="text-muted-foreground truncate text-[13px]">
                    {url}
                  </p>
                </div>
              </m.div>
              {/* popLayout: a bubble on its way out leaves the layout at
                  once, so the card glides back down with the page. */}
              <AnimatePresence mode="popLayout">
                {phase >= 2 && (
                  <m.p key="ask" {...arrive} className={bubble}>
                    {ask.title}
                  </m.p>
                )}
                {phase >= 3 && (
                  <m.div
                    key="more"
                    {...arrive}
                    className={cn(
                      "bg-muted w-[min(85%,26rem)] overflow-hidden rounded-[20px] rounded-bl-md",
                    )}
                  >
                    <LookAround locale={locale} path={path} />
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Moving locale={locale} />
          <AskBox locale={locale} title={ask.title} placeholder={ask} />
        </div>
      </m.div>
    </div>
  );
}
