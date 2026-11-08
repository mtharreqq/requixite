"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import {
  ArrowUp,
  Check,
  LayoutGrid,
  LoaderCircle,
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import {
  AnimatePresence,
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Locale, PortfolioCopy } from "@/lib/portfolio-copy";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { openChat } from "@/lib/chat-events";
import { cn } from "@/lib/utils";

// One pinned story: you prompt an AI, it hands back a vibecoded dashboard, you
// ask me for help in a comment, I comment faster than you can fix, then I fix
// all of it and the composer comes back as the way to hire me. Pin structure
// after RantAI's home-problem: tall section, sticky 100svh stage, progress
// copied to JS.

type P = MotionValue<number>;
type Copy = PortfolioCopy["review"];
type Offer = PortfolioCopy["offer"];

const ease = cubicBezier(0.22, 1, 0.36, 1);
const pop = { stiffness: 380, damping: 20 };
const settle = { stiffness: 260, damping: 26 };
const EASE = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring", stiffness: 260, damping: 30 } as const;
// The composer's big moves: slow enough to follow.
const morph = { duration: 0.7, ease: EASE };
// The dashboard first shows as a small card in the chat.
const PREVIEW = 0.55;
const PAD = 8;
const cursorSpring = { type: "spring", stiffness: 140, damping: 22 } as const;
const clamp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

// Beats, as scroll progress through the pin.
const LOGO_AT = 0.008;
const GROW = [0.035, 0.05];
const TYPE = [0.05, 0.1] as const;
const SENT = 0.1;
const STEP_AT = [0.105, 0.12, 0.135, 0.15];
const BUILT = 0.165;
const FOCUS = 0.175;
// "It works." "It just looks…" "vibecoded.", one part at a time.
const VIBE_STEP = 0.02;
const ASK_GO = 0.285;
const SEL_END = 0.305;
const ASK_PIN = 0.312;
const ASK_POP = 0.32;
const REPLY = 0.335;
const ASK_LEAVE = 0.35;
const JOIN = 0.36;
const GIVE_GO = 0.775;
const GIVE_POP = 0.785;
const ONIT = 0.8;
const FIXALL = 0.815;
const CTA = 0.95;
const CAPTION_AT = [
  0,
  FOCUS,
  ASK_GO - 0.005,
  JOIN + 0.01,
  0.55,
  GIVE_GO,
  CTA,
  1.1,
];

type Mode = "big" | "dock" | "cta";
const modeAt = (v: number): Mode =>
  v < SENT ? "big" : v < CTA ? "dock" : "cta";

// A comment: the element it pins to, its spot as a fraction of that element,
// when the cursor heads there, when the pin drops, when its text opens, and
// when it's resolved (by you, or by me at the end).
type Spot = {
  a: string;
  x: number;
  y: number;
  go: number;
  at: number;
  pop: number;
  fix: number;
};

// The four you fix, in copy order: spacing, colour, type, alignment.
const MAIN_AT = [0.385, 0.425, 0.465, 0.505];
const MAIN = (
  [
    ["stats", 0.5, 0],
    ["btn", 0.85, 0.1],
    ["title", 1, 0.35],
    ["table", 0.97, 0.04],
  ] as const
).map(([a, x, y], i) => ({ a, x, y, at: MAIN_AT[i], fix: MAIN_AT[i] + 0.03 }));
// The pile: on element edges so the content stays readable, faster and
// faster. You keep up with every third one; the rest wait for me.
const PILE = 36;
const ON = ["stat0", "chart", "table", "stat2", "stat1", "btn", "title"];
const EDGE = [
  [0.96, 0.15],
  [0.04, 1],
  [0.62, 1],
  [0.5, 1],
  [0.02, 0.2],
  [0.8, 1],
];
const RAW = [
  ...MAIN,
  ...Array.from({ length: PILE }, (_, i) => {
    const at = 0.56 + 0.2 * Math.sqrt(i / PILE);
    return {
      a: ON[i % ON.length],
      x: EDGE[(i * 5) % EDGE.length][0],
      y: EDGE[(i * 5) % EDGE.length][1],
      at,
      fix: i % 3 === 0 ? at + 0.02 : FIXALL + i * 0.0005,
    };
  }),
];
// Cursor first, then the pin, then its text. The lead shrinks as the pile
// speeds up.
const SPOTS: Spot[] = RAW.map((s, i) => {
  const lead = Math.min(0.012, (s.at - (i ? RAW[i - 1].at : JOIN)) * 0.6);
  return { ...s, go: s.at - lead, pop: s.at + lead * 0.6 };
});
// Your thread with me, pinned where your selection ends: bottom-right.
const ASK: Spot = {
  a: "dash",
  x: 0.97,
  y: 1,
  go: SEL_END,
  at: ASK_PIN,
  pop: ASK_POP,
  fix: FIXALL,
};

/** Latest spot whose `key` beat has passed. */
function latest(v: number, key: "go" | "pop") {
  let best = -1;
  SPOTS.forEach((s, i) => {
    if (v >= s[key] && (best < 0 || s[key] >= SPOTS[best][key])) best = i;
  });
  return best;
}

/** The open comment: -2 your question, -3 you give up, -1 none. */
function activeAt(v: number) {
  if (v >= ASK_POP && v < ASK_LEAVE + 0.01) return -2;
  if (v >= GIVE_POP && v < FIXALL) return -3;
  if (v >= GIVE_GO) return -1;
  const best = latest(v, "pop");
  return best >= 0 && v < SPOTS[best].fix ? best : -1;
}

/** What my cursor points at. */
function thSel(v: number) {
  if (v < JOIN || v >= GIVE_GO) return null;
  const best = latest(v, "go");
  return `[data-n="${Math.max(0, best)}"]`;
}

/** Your cursor: -1 off, 0–1 dragging a selection, 2 at your pin with the
 * selection, 3 back at your pin to give up. */
function selAt(v: number) {
  if (v >= GIVE_GO && v < FIXALL + 0.01) return 3;
  if (v < ASK_GO || v >= ASK_LEAVE) return -1;
  if (v >= SEL_END) return 2;
  return Math.round(clamp(v, ASK_GO + 0.006, SEL_END) * 20) / 20;
}

// Rows knocked out of line until the alignment fix.
const ROW_OFF = [
  ["-24px", "-14px"],
  ["-6px", "0px"],
  ["-40px", "-28px"],
];

// Inline logo tiles, after RantAI's home-solution.
const LOGOS = [
  ["cursor", -8],
  ["claude", 6],
  ["chatgpt", -4],
  ["antigravity", 8],
] as const;

// Starting prices per plan, in whole units. Free plan first.
const PRICES = {
  IDR: [0, 1_500_000, 3_000_000],
  USD: [0, 250, 600],
};
// Set by proxy.ts from Vercel's geo header. Missing (dev, other hosts): the
// page language decides.
const country = () => document.cookie.match(/(?:^|; )country=([A-Z]{2})/)?.[1];
const noop = () => () => {};

const STILL = "(prefers-reduced-motion: reduce), (max-height: 600px)";
/** Reduced motion or a short screen: show the finished state, unpinned. */
function useStill() {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(STILL);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(STILL).matches,
    () => false,
  );
}

/** Spring to 1 while `on(v)` holds: discrete beats, never stuck halfway. */
function useBeat(p: P, on: (v: number) => boolean, s = pop) {
  return useSpring(
    useTransform(p, (v): number => (on(v) ? 1 : 0)),
    s,
  );
}

type Box = { x: number; y: number; w: number; h: number };
/** Layout box inside `root`, ignoring transforms (so mid-animation is fine). */
function offsetIn(el: HTMLElement | null, root: HTMLElement): Box | null {
  if (!el) return null;
  let x = 0;
  let y = 0;
  for (let e: HTMLElement | null = el; e && e !== root; ) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function Caption({
  from,
  to,
  children,
  p,
}: {
  from: number;
  to: number;
  children: React.ReactNode;
  p: P;
}) {
  // Enter and leave like SplitReveal: fade, rise, unblur.
  const shown = useTransform(
    p,
    [from, from + 0.02, to - 0.02, to],
    [0, 1, 1, 0],
    { ease },
  );
  return (
    <motion.p
      className="[grid-area:1/1] max-md:filter-none!"
      style={{
        opacity: shown,
        y: useTransform(shown, [0, 1], ["0.4em", "0em"]),
        filter: useTransform(shown, (v) =>
          v >= 1 ? "none" : `blur(${(1 - v) * 10}px)`,
        ),
      }}
    >
      {children}
    </motion.p>
  );
}

function Part({
  at,
  p,
  children,
}: {
  at: number;
  p: P;
  children: React.ReactNode;
}) {
  const shown = useTransform(p, [at, at + 0.015], [0, 1], { ease });
  return (
    <motion.span
      className="max-md:filter-none!"
      style={{
        opacity: shown,
        filter: useTransform(shown, (v) =>
          v >= 1 ? "none" : `blur(${(1 - v) * 8}px)`,
        ),
      }}
    >
      {children}
    </motion.span>
  );
}

function Tile({
  name,
  rotate,
  i,
  p,
}: {
  name: string;
  rotate: number;
  i: number;
  p: P;
}) {
  const shown = useBeat(p, (v) => v > LOGO_AT + i * 0.006);
  return (
    <motion.span
      className={cn(
        "relative inline-flex size-[0.92em] shrink-0 items-center justify-center rounded-[0.24em] bg-white shadow-[0_0.08em_0.2em_rgba(0,0,0,0.18)] ring-[0.04em] ring-white",
        i > 0 && "-ml-[0.3em]",
      )}
      style={{
        zIndex: i + 1,
        scale: shown,
        opacity: shown,
        rotate: useTransform(shown, [0, 1], [rotate - 30, rotate]),
      }}
    >
      <Image
        src={`/ai-logos/${name}.svg`}
        alt=""
        width={40}
        height={40}
        className="h-[0.55em] w-auto"
      />
    </motion.span>
  );
}

function usePrices(locale: Locale) {
  const fallback = locale === "id" ? "ID" : "";
  const where = useSyncExternalStore(
    noop,
    () => country() ?? fallback,
    () => fallback,
  );
  const currency = where === "ID" ? "IDR" : "USD";
  const format = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: currency === "IDR" ? "compact" : "standard",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return PRICES[currency].map((n) => (n ? format.format(n) : ""));
}

/** A message box that opens the chat dialog with its text on send. */
function useDraft() {
  const [text, setText] = useState("");
  const send = () => {
    const t = text.trim();
    if (!t) return;
    openChat(t);
    setText("");
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };
  return { text, setText, send, onKeyDown };
}

function Send({
  label,
  onClick,
  off,
}: {
  label: string;
  onClick: () => void;
  off: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={off}
          aria-label={label}
          className="composer-send"
        >
          <ArrowUp />
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
}

// ponytail: the last form and the floating bar open the chat dialog with a
// draft. When the site gets its AI feature, this becomes the real input.
function Composer({
  copy,
  offer,
  locale,
  p,
  mode,
  onGone,
}: {
  copy: Copy;
  offer: Offer;
  locale: Locale;
  p: P;
  mode: Mode;
  onGone: (gone: boolean) => void;
}) {
  const chars = Array.from(copy.prompt);
  const typed = useTransform(p, (v) =>
    chars.slice(0, Math.round(clamp(v, ...TYPE) * chars.length)).join(""),
  );
  // Lit once the prompt is typed, dim while docked, the real button at the end.
  const ready = useTransform(p, (v): number =>
    v >= CTA || (v >= TYPE[1] - 0.004 && v < SENT) ? 1 : 0.35,
  );
  const prices = usePrices(locale);
  const field = useRef<HTMLTextAreaElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const { text, setText, send, onKeyDown } = useDraft();
  const cta = mode === "cta";
  // The floating bar takes over once this one scrolls away above.
  useEffect(() => {
    const el = box.current;
    if (!cta || !el) return;
    const io = new IntersectionObserver(([e]) =>
      onGone(!e.isIntersecting && e.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => {
      io.disconnect();
      onGone(false);
    };
  }, [cta, onGone]);
  const pick = (name: string) => {
    const draft = offer.ask.replace("{plan}", name);
    setText(draft);
    requestAnimationFrame(() => {
      field.current?.focus();
      field.current?.setSelectionRange(draft.length, draft.length);
    });
  };
  const swap = {
    layout: "position" as const,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, delay: 0.25 },
  };
  // Pricing comes in after the dashboard has gone: box, then plans, then note.
  const later = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay },
  });
  return (
    <motion.div
      ref={box}
      style={{
        scale: useTransform(p, GROW, [0.6, 1], { ease }),
        opacity: useTransform(p, GROW, [0, 1]),
        y: useTransform(p, GROW, [24, 0], { ease }),
      }}
    >
      {cta && (
        <div className="-mx-1 mb-1 flex gap-1.5 overflow-x-auto p-1 [scrollbar-width:none]">
          {offer.plans.map((pl, i) => (
            <Tooltip key={pl.name}>
              <TooltipTrigger asChild>
                <motion.button
                  {...later(0.6 + i * 0.08)}
                  type="button"
                  onClick={() => pick(pl.name)}
                  className="composer-chip"
                >
                  <span className="font-medium">{pl.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {prices[i] ? `${offer.from} ${prices[i]}` : offer.free}
                  </span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                {pl.desc} · {pl.time}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
      {/* One box all the way: prompt, follow-up bar, then your message. The
          parts glide to their new spots; only the text swaps. */}
      <motion.div
        layout
        transition={morph}
        inert={!cta}
        className="composer"
        data-mode={mode}
        style={{ borderRadius: 22 }}
      >
        <div className="composer-body">
          {cta ? (
            <>
              <label htmlFor="review-ask" className="sr-only">
                {copy.cta.title}
              </label>
              <motion.textarea
                key="cta"
                {...swap}
                ref={field}
                id="review-ask"
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={copy.cta.placeholder}
                className="composer-input"
              />
            </>
          ) : (
            <motion.p
              key={mode}
              {...swap}
              aria-hidden
              className="composer-input"
            >
              {mode === "big" ? (
                <>
                  <motion.span>{typed}</motion.span>
                  <span className="composer-caret" />
                </>
              ) : (
                copy.followup
              )}
            </motion.p>
          )}
          <motion.span
            layout="position"
            transition={morph}
            aria-hidden
            className="composer-icon"
          >
            <Plus />
          </motion.span>
          <motion.span
            layout="position"
            transition={morph}
            className="[grid-area:send]"
            style={{ opacity: ready }}
          >
            <Send
              label={copy.cta.send}
              onClick={send}
              off={cta && !text.trim()}
            />
          </motion.span>
        </div>
      </motion.div>
      {cta && (
        <motion.p
          {...later(0.9)}
          className="text-muted-foreground mt-2 px-1 text-xs"
        >
          {offer.note}
        </motion.p>
      )}
    </motion.div>
  );
}

/** "Ask me anything", pinned to the bottom once the pricing box is gone. */
function FloatBar({ copy, show }: { copy: Copy; show: boolean }) {
  const { text, setText, send, onKeyDown } = useDraft();
  return (
    <div
      inert={!show}
      className={cn(
        "fixed right-4 bottom-3 left-10 z-[45] mx-auto max-w-[34rem] transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:bottom-5 md:left-4",
        !show && "translate-y-[calc(100%+2rem)] opacity-0",
      )}
    >
      <div className="composer" data-mode="float">
        <div className="composer-body">
          <label htmlFor="review-float" className="sr-only">
            {copy.float.label}
          </label>
          <input
            id="review-float"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={copy.float.placeholder}
            autoComplete="off"
            className="composer-input"
          />
          <Send label={copy.cta.send} onClick={send} off={!text.trim()} />
        </div>
      </div>
    </div>
  );
}

function DashBody({
  copy,
  dashRef,
  pins,
}: {
  copy: Copy;
  dashRef: React.Ref<HTMLDivElement>;
  pins: (a: string) => React.ReactNode;
}) {
  return (
    <div ref={dashRef} className="dash">
      <div className="dash-rail">
        <LayoutGrid />
        <Wallet />
        <Users />
        <Settings />
      </div>
      <div className="dash-main">
        <div className="dash-head">
          <div>
            <p data-a="title" className="dash-title">
              {copy.dash.title}
              {pins("title")}
            </p>
            <p className="dash-label">{copy.dash.range}</p>
          </div>
          <span data-a="btn" className="dash-btn">
            <Plus className="size-3.5" /> {copy.dash.action}
            {pins("btn")}
          </span>
        </div>
        <div data-a="stats" className="dash-stats">
          {copy.dash.stats.map(([label, num, delta], i) => (
            <div key={label} data-a={`stat${i}`} className="dash-card">
              <span className="dash-label">{label}</span>
              <span className="dash-num">{num}</span>
              <span className="dash-delta">{delta}</span>
              {pins(`stat${i}`)}
            </div>
          ))}
          {pins("stats")}
        </div>
        <div data-a="chart" className="dash-card">
          <span className="dash-label">{copy.dash.chart}</span>
          <div className="dash-bars">
            {[38, 52, 44, 61, 48, 70, 57, 66, 74, 62, 81, 92].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          {pins("chart")}
        </div>
        <div data-a="table" className="dash-card">
          {copy.dash.rows.map(([name, date, amount], i) => (
            <div
              key={name}
              data-a={`row${i}`}
              className="dash-row"
              style={
                {
                  "--off": ROW_OFF[i][0],
                  "--off2": ROW_OFF[i][1],
                } as React.CSSProperties
              }
            >
              <b>{name}</b>
              <span>{date}</span>
              <em>{amount}</em>
              {pins(`row${i}`)}
            </div>
          ))}
          {pins("table")}
        </div>
      </div>
      {pins("dash")}
    </div>
  );
}

function YouAvatar({ name, size }: { name: string; size: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-orange-500 font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {name[0]}
    </span>
  );
}

function CommentPin({
  s,
  n,
  p,
  you,
}: {
  s: Spot;
  n: number | "ask";
  p: P;
  you?: string;
}) {
  const drop = useBeat(p, (v) => v > s.at);
  const done = useBeat(p, (v) => v > s.fix, settle);
  const gone = useBeat(p, (v) => v > s.fix + 0.025, {
    stiffness: 260,
    damping: 30,
  });
  const scale = useTransform([drop, gone], ([d, g]: number[]) =>
    Math.max(0, d * (1 - g)),
  );
  return (
    <motion.span
      data-n={n}
      className="dash-pin"
      style={{
        left: `${s.x * 100}%`,
        top: `${s.y * 100}%`,
        scale,
        opacity: scale,
      }}
    >
      {you ? (
        <YouAvatar name={you} size={22} />
      ) : (
        <Image
          src="/avatar.png"
          alt=""
          width={24}
          height={24}
          loading="eager"
        />
      )}
      <motion.span className="dash-pin-done" style={{ opacity: done }}>
        <Check />
      </motion.span>
    </motion.span>
  );
}

function Msg({ copy, you, text }: { copy: Copy; you?: boolean; text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs">
        {you ? (
          <YouAvatar name={copy.you} size={18} />
        ) : (
          <Image
            src="/avatar.png"
            alt=""
            width={18}
            height={18}
            loading="eager"
            className="rounded-full"
          />
        )}
        <span className="font-medium">{you ? copy.you : "Tharreq"}</span>
        <span className="text-muted-foreground">{copy.now}</span>
      </div>
      <p>{text}</p>
    </div>
  );
}

function Popover({
  pin,
  w,
  children,
}: {
  pin: Box;
  w: number;
  children: React.ReactNode;
}) {
  const width = Math.min(240, w);
  const y = pin.y + pin.h;
  // Above the pin, or below the cursor when the pin sits near the top.
  const above = y > 140;
  return (
    <motion.div
      layout
      className="dash-pop"
      data-above={above}
      style={{
        width,
        left: Math.min(Math.max(0, pin.x - 12), w - width),
        top: above ? y - 36 : y + 40,
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
    >
      {children}
    </motion.div>
  );
}

type Point = { x: number; y: number } | null;

function Cursor({
  name,
  color,
  at,
  home,
  w,
}: {
  name: string;
  color: string;
  at: Point;
  home: { x: number; y: number };
  w: number;
}) {
  return (
    <motion.div
      className="dash-cursor"
      data-flip={!!at && at.x > w - 110}
      style={{ "--cur": color } as React.CSSProperties}
      initial={false}
      animate={at ? { ...at, opacity: 1 } : { ...home, opacity: 0 }}
      transition={cursorSpring}
    >
      <svg viewBox="3 3 19 19">
        <path d="M4.6 5.4a1.2 1.2 0 0 1 1.6-1.6l14 5.8a1 1 0 0 1-.1 1.9l-5.9 1.6a2 2 0 0 0-1.4 1.4l-1.6 5.9a1 1 0 0 1-1.9.1z" />
      </svg>
      <span>{name}</span>
    </motion.div>
  );
}

/** The AI's answer: build steps, then a small dashboard that grows into
 * focus while the chat above it folds away. */
function Answer({
  copy,
  p,
  onSettle,
}: {
  copy: Copy;
  p: P;
  onSettle: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const dash = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLParagraphElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  // Sent: your prompt rises straight up from where you typed it.
  useLayoutEffect(() => {
    const b = bubble.current;
    const stage = b?.closest<HTMLElement>("[data-stage]");
    const o = stage && offsetIn(b, stage);
    if (!b || !stage || !o || p.get() >= FOCUS || matchMedia(STILL).matches)
      return;
    animate(b, { y: [stage.offsetHeight / 2 - o.y - o.h / 2, 0] }, morph);
  }, [p]);
  useLayoutEffect(() => {
    const r = root.current;
    const d = dash.current;
    if (!r || !d) return;
    const ro = new ResizeObserver(() =>
      setSize({ w: r.offsetWidth, h: d.offsetHeight }),
    );
    ro.observe(r);
    ro.observe(d);
    return () => ro.disconnect();
  }, []);
  const built = useBeat(p, (v) => v > BUILT, settle);
  const polished = useBeat(p, (v) => v > FIXALL, settle);
  const commenting = useBeat(p, (v) => v > MAIN_AT[0] - 0.01, settle);
  const [step, setStep] = useState(0);
  const [focus, setFocus] = useState(false);
  const read = (v: number) => {
    setStep(STEP_AT.filter((at) => v >= at).length + (v >= BUILT ? 1 : 0));
    setFocus(v >= FOCUS);
  };
  useMotionValueEvent(p, "change", read);
  useLayoutEffect(() => read(p.get()));

  // Your fixes get spacing, colour and type only part of the way; mine take
  // all of them. Alignment is either fixed or not.
  const apply = () => {
    const s = dash.current?.style;
    const v = p.get();
    const q = polished.get();
    if (s)
      ["--p", "--c", "--f", "--a"].forEach((k, i) =>
        s.setProperty(
          k,
          String(
            Math.max(
              q,
              (i === 3 ? 1 : 0.4) * clamp(v, MAIN[i].fix - 0.02, MAIN[i].fix),
            ),
          ),
        ),
      );
  };
  useMotionValueEvent(p, "change", apply);
  useMotionValueEvent(polished, "change", apply);
  useLayoutEffect(apply);

  const open = useTransform(p, (v) => {
    const n = SPOTS.filter((s) => v > s.at && v <= s.fix).length;
    return v > FIXALL && n === 0
      ? copy.resolved
      : copy.open.replace("{n}", `${n}`);
  });
  const pins = (a: string) => (
    <>
      {SPOTS.map(
        (s, i) => s.a === a && <CommentPin key={i} s={s} n={i} p={p} />,
      )}
      {a === ASK.a && <CommentPin s={ASK} n="ask" p={p} you={copy.you} />}
    </>
  );
  const done = step > STEP_AT.length;
  const rise = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease },
  };

  const fold = { duration: 0.6, ease: EASE };
  // The small preview card zooms into the full dashboard.
  const card = focus
    ? { width: size.w, height: "auto", padding: 0 }
    : {
        width: size.w * PREVIEW + 2 * PAD,
        height: size.h * PREVIEW + 2 * PAD,
        padding: PAD,
      };

  return (
    <div ref={root} className="flex flex-col">
      <motion.div
        initial={false}
        animate={
          focus ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }
        }
        transition={fold}
        // Unclipped while open, so your message can fly up into it.
        style={{ overflow: focus ? "hidden" : "visible" }}
        onAnimationComplete={onSettle}
      >
        <div className="flex flex-col gap-3 pb-3 text-sm">
          <p
            ref={bubble}
            className="bg-foreground text-background ml-auto w-fit max-w-[85%] rounded-[18px] rounded-br-md px-3.5 py-2 leading-snug"
          >
            {copy.prompt}
          </p>
          <div className="flex flex-col gap-1.5">
            <p className="text-muted-foreground flex items-center gap-2">
              {done ? (
                <Check className="size-4" />
              ) : (
                <LoaderCircle className="size-4 motion-safe:animate-spin" />
              )}
              {copy.building}
            </p>
            {copy.steps.slice(0, step).map((label, i) => (
              <motion.p
                key={label}
                {...rise}
                className="text-muted-foreground flex items-center gap-2 pl-6 text-xs"
              >
                {i < step - 1 ? (
                  <Check className="size-3.5" />
                ) : (
                  <LoaderCircle className="size-3.5 motion-safe:animate-spin" />
                )}
                {label}
              </motion.p>
            ))}
          </div>
          {done && (
            <motion.p {...rise} className="flex items-center gap-2">
              <Sparkles className="size-4" />
              {copy.reply}
            </motion.p>
          )}
        </div>
      </motion.div>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ height: focus ? "auto" : 0 }}
        transition={fold}
      >
        <div className="text-muted-foreground flex justify-end pb-2 text-xs">
          <motion.span
            className="inline-flex items-center gap-1.5"
            style={{ opacity: commenting }}
          >
            <MessageCircle className="size-3.5" />
            <motion.span className="tabular-nums">{open}</motion.span>
          </motion.span>
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: built, y: useTransform(built, [0, 1], [16, 0]) }}
      >
        <motion.div
          initial={false}
          animate={size.w ? card : { width: "100%" }}
          transition={fold}
          onAnimationComplete={onSettle}
          className={cn(
            "rounded-2xl ring-1 transition-[box-shadow,background-color] duration-500",
            focus
              ? "ring-transparent"
              : "bg-card ring-border overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
          )}
        >
          <motion.div
            initial={false}
            animate={{ scale: focus ? 1 : PREVIEW }}
            transition={fold}
            style={{ width: size.w || "100%", originX: 0, originY: 0 }}
          >
            <DashBody copy={copy} dashRef={dash} pins={pins} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Stage({
  copy,
  offer,
  locale,
  p,
  still,
  onGone,
}: {
  copy: Copy;
  offer: Offer;
  locale: Locale;
  p: P;
  still: boolean;
  onGone: (gone: boolean) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("big");
  const [tick, setTick] = useState(0);
  const [sel, setSel] = useState(-1);
  const [th, setTh] = useState<string | null>(null);
  const [act, setAct] = useState(-1);
  const [reply, setReply] = useState(false);
  const [box, setBox] = useState<{
    dash: Box | null;
    ask: Box | null;
    th: Box | null;
    pin: Box | null;
    w: number;
    h: number;
  }>({ dash: null, ask: null, th: null, pin: null, w: 0, h: 0 });

  const read = (v: number) => {
    setMode(modeAt(v));
    setSel(selAt(v));
    setTh(thSel(v));
    setAct(activeAt(v));
    setReply(v < GIVE_GO ? v >= REPLY : v >= ONIT);
  };
  useMotionValueEvent(p, "change", read);
  useLayoutEffect(() => read(p.get()));

  const selOn = sel >= 0;
  // Cursors and the popover aim at real elements, measured once per target.
  useLayoutEffect(() => {
    const root = stage.current;
    if (!root) return;
    const find = (sel: string | null) =>
      sel ? offsetIn(root.querySelector<HTMLElement>(sel), root) : null;
    const ask = find('[data-n="ask"]');
    setBox({
      dash: find(".dash"),
      ask,
      th: find(th),
      pin: act <= -2 ? ask : act >= 0 ? find(`[data-n="${act}"]`) : null,
      w: root.offsetWidth,
      h: root.offsetHeight,
    });
  }, [selOn, th, act, mode, tick]);

  const pointAt = (b: Box | null): Point =>
    b && { x: b.x + 10, y: b.y + b.h + 6 };
  const d = box.dash;
  const drag = Math.min(1, sel);
  const youAt: Point =
    sel < 0 || !d
      ? null
      : sel > 1
        ? pointAt(box.ask)
        : { x: d.x + drag * d.w, y: d.y + drag * d.h };

  // The dashboard leaves with the scroll before pricing comes in.
  const leave = useTransform(p, [CTA - 0.035, CTA - 0.005], [1, 0]);
  const leaveY = useTransform(leave, [0, 1], [-24, 0]);
  const leaveScale = useTransform(leave, [0, 1], [0.97, 1]);

  return (
    <motion.div
      ref={stage}
      data-stage
      layout="position"
      transition={morph}
      aria-hidden={mode === "big" || mode === "dock"}
      className={cn(
        "relative flex flex-col gap-4",
        !still && mode !== "cta" && "h-[min(36rem,calc(100svh-12rem))]",
        mode === "dock" ? "justify-between" : "justify-center",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {(mode === "dock" || still) && (
          <motion.div
            key="answer"
            className="min-h-0 flex-1"
            style={
              still
                ? undefined
                : {
                    opacity: leave,
                    y: leaveY,
                    scale: leaveScale,
                  }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Answer copy={copy} p={p} onSettle={() => setTick((t) => t + 1)} />
          </motion.div>
        )}
      </AnimatePresence>
      <Composer
        copy={copy}
        offer={offer}
        locale={locale}
        p={p}
        mode={mode}
        onGone={onGone}
      />
      {!still && (
        <>
          <AnimatePresence>
            {sel >= 0 && sel <= 2 && d && (
              <motion.div
                className="dash-sel"
                style={{ left: d.x, top: d.y }}
                initial={{ width: 0, height: 0 }}
                animate={{ width: drag * d.w, height: drag * d.h }}
                exit={{ opacity: 0 }}
                transition={cursorSpring}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {act !== -1 && box.pin && (
              <Popover key={act} pin={box.pin} w={box.w}>
                {act <= -2 ? (
                  <>
                    <Msg
                      copy={copy}
                      you
                      text={act === -2 ? copy.chat.ask : copy.chat.giveup}
                    />
                    {reply && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={spring}
                        className="border-t pt-2"
                      >
                        <Msg
                          copy={copy}
                          text={act === -2 ? copy.chat.reply : copy.chat.onit}
                        />
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Msg
                    copy={copy}
                    text={
                      act < MAIN.length
                        ? copy.comments[act]
                        : copy.pile[(act - MAIN.length) % copy.pile.length]
                    }
                  />
                )}
              </Popover>
            )}
          </AnimatePresence>
          <Cursor
            name={copy.you}
            color="#f97316"
            at={youAt}
            home={{ x: box.w * 0.3, y: box.h }}
            w={box.w}
          />
          <Cursor
            name="Tharreq"
            color="#0d99ff"
            at={pointAt(box.th)}
            home={{ x: box.w, y: 0 }}
            w={box.w}
          />
        </>
      )}
    </motion.div>
  );
}

export function ReviewStory({
  copy,
  offer,
  locale,
}: {
  copy: Copy;
  offer: Offer;
  locale: Locale;
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // A JS copy: native scroll timelines can mismeasure sticky targets.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!still) p.set(v);
  });
  useEffect(() => {
    p.set(still ? 1 : scrollYProgress.get());
  }, [still, p, scrollYProgress]);
  // Once the pricing box scrolls away, a floating "ask me anything" bar
  // takes over. It steps aside once the footer shows, so the wordmark stays
  // clear.
  const [gone, setGone] = useState(false);
  const [away, setAway] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setAway(e.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);
  // The intro line starts in the middle of the screen and makes room as the
  // composer grows. At the end, the blank under the centered pricing is
  // pulled back so the next section rises right after it.
  const content = useRef<HTMLDivElement>(null);
  const drop = useMotionValue(0);
  const [slack, setSlack] = useState(0);
  useLayoutEffect(() => {
    const c = content.current;
    const st = c?.querySelector<HTMLElement>("[data-stage]");
    if (!c || !st || still) return;
    const ro = new ResizeObserver(() => {
      drop.set((st.offsetHeight + 24) / 2);
      setSlack(
        Math.max(0, (c.parentElement!.offsetHeight - c.offsetHeight) / 2),
      );
    });
    ro.observe(c);
    ro.observe(st);
    ro.observe(c.parentElement!);
    return () => ro.disconnect();
  }, [still, drop]);
  const captionY = useTransform(
    [p, drop],
    ([v, d]: number[]) => d * (1 - ease(clamp(v, GROW[0], GROW[1]))),
  );

  return (
    <section
      ref={ref}
      id="review"
      aria-labelledby="review-heading"
      className={cn("relative w-full", !still && "h-[1100svh] md:h-[1300svh]")}
      style={{ marginBottom: still ? 0 : -slack }}
    >
      {/* #offer lands where the pin ends: the plans above the composer. */}
      <div
        id="offer"
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0",
          !still && "h-svh",
        )}
      />
      <div
        className={cn(
          "flex flex-col gap-6",
          !still && "sticky top-0 h-svh justify-center",
        )}
      >
        <div ref={content} className="flex flex-col gap-6">
          <h2 id="review-heading" className="sr-only">
            {copy.title}
          </h2>
          <p className="sr-only">{copy.sr}</p>
          {still ? (
            <p className="text-[clamp(24px,4.8vw,36px)] leading-tight font-medium tracking-[-0.04em]">
              {copy.cta.title}
            </p>
          ) : (
            <motion.div
              aria-hidden
              layout="position"
              transition={morph}
              style={{ y: captionY }}
              className="grid grid-cols-1 text-[clamp(24px,4.8vw,36px)] leading-tight font-medium tracking-[-0.04em]"
            >
              <Caption from={CAPTION_AT[0]} to={CAPTION_AT[1]} p={p}>
                {copy.intro}{" "}
                <span className="inline-flex align-[-0.12em]">
                  {LOGOS.map(([name, r], i) => (
                    <Tile key={name} name={name} rotate={r} i={i} p={p} />
                  ))}
                </span>
              </Caption>
              <Caption from={CAPTION_AT[1]} to={CAPTION_AT[2]} p={p}>
                {copy.vibe.map((part, i) => (
                  <Fragment key={part}>
                    {i > 0 && " "}
                    <Part at={FOCUS + i * VIBE_STEP} p={p}>
                      {part}
                    </Part>
                  </Fragment>
                ))}
              </Caption>
              {[...copy.captions, copy.cta.title].map((text, i) => (
                <Caption
                  key={text}
                  from={CAPTION_AT[i + 2]}
                  to={CAPTION_AT[i + 3]}
                  p={p}
                >
                  {text}
                </Caption>
              ))}
            </motion.div>
          )}
          <Stage
            copy={copy}
            offer={offer}
            locale={locale}
            p={p}
            still={still}
            onGone={setGone}
          />
        </div>
      </div>
      <FloatBar copy={copy} show={gone && !away} />
    </section>
  );
}
