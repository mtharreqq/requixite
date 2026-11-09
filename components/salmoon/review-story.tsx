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
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowUp,
  Check,
  LayoutGrid,
  LoaderCircle,
  MessageCircle,
  Pause,
  Play,
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
import {
  getPortfolioCopy,
  type Locale,
  type PortfolioCopy,
} from "@/lib/portfolio-copy";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { openChat } from "@/lib/chat-events";
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { jumpTo, smoothScrollTo } from "@/components/smooth-scroll";
import { ContactIcons, FooterMeta } from "@/components/salmoon/connect-section";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// One pinned story: you prompt an AI, it hands back a vibecoded dashboard, you
// ask me for help in a comment, I comment faster than you can fix, then I fix
// all of it and the composer comes back as the way to hire me. Pin structure
// after RantAI's home-problem: tall section, sticky 100svh stage, progress
// copied to JS.

type P = MotionValue<number>;
type Copy = PortfolioCopy["review"];
type Offer = PortfolioCopy["offer"];
type Contact = PortfolioCopy["contact"];

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

// Beats, as scroll progress through the pin. The hello and the bridge line
// play before 0, so the story's own beats keep their spacing.
const INTRO = 0.1;
const HELLO_END = -0.055;
const BRIDGE_END = -0.005;
const LOGO_AT = 0.015;
const GROW = [0.035, 0.05];
const TYPE = [0.05, 0.095] as const;
const SENT = 0.1;
const STEP_AT = [0.105, 0.12, 0.135, 0.15];
const BUILT = 0.165;
const FOCUS = 0.175;
// "It works." "It just looks…" "vibecoded.", one part at a time.
const VIBE_STEP = 0.02;
const ASK_GO = 0.285;
const SEL_END = 0.298;
const ASK_PIN = 0.303;
const ASK_POP = 0.308;
const REPLY = 0.32;
const ASK_LEAVE = 0.336;
const JOIN = 0.342;
const PILE_AT = 0.49;
const GIVE_GO = 0.7;
const GIVE_POP = 0.707;
const ONIT = 0.72;
const FIXALL = 0.735;
const CTA = 0.87;
// Where the pin lets go.
const END = 0.92;
// Pauses: scroll keeps going but the story holds still, so a quick flick
// can't skip a beat. [story beat, length]. The pin's height pays for them.
const HOLDS = [
  [0.097, 0.03], // typed, before it sends
  [0.101, 0.02], // sent, before the build starts
  [0.168, 0.015], // built, before the focus
  [REPLY + 0.002, 0.015], // my reply to your question
  [GIVE_POP + 0.003, 0.012], // you give up
  [ONIT + 0.002, 0.012], // I'm on it
] as const;
const SPAN = END + INTRO + HOLDS.reduce((t, [, l]) => t + l, 0);
/** Scroll progress (0–1) to story beat, flat across each hold. */
function toStory(v: number) {
  let u = v * SPAN - INTRO;
  for (const [at, len] of HOLDS) {
    if (u <= at) return u;
    if (u <= at + len) return at;
    u -= len;
  }
  return u;
}
/** Story beat back to scroll progress, for the rail's chapter anchors. */
const toScroll = (at: number) =>
  (at + INTRO + HOLDS.reduce((t, [h, l]) => (h < at ? t + l : t), 0)) / SPAN;
const CAPTION_AT = [
  0,
  FOCUS,
  ASK_GO - 0.005,
  JOIN + 0.01,
  PILE_AT - 0.01,
  GIVE_GO,
  CTA,
  1.1,
];
// Rail chapters inside the story, by the beat they start on.
const CHAPTERS = [
  ["vibecoded", FOCUS],
  ["feedback", JOIN],
  ["handoff", GIVE_GO],
] as const;

type Mode = "big" | "dock" | "cta";
const modeAt = (v: number): Mode =>
  v < SENT ? "big" : v < CTA ? "dock" : "cta";

// A comment: the element it pins to, its spot as a fraction of that element,
// when it opens, when you reply (if you still do), and when it's resolved
// (by you, or by me at the end).
type Spot = {
  a: string;
  x: number;
  y: number;
  at: number;
  re?: number;
  fix: number;
};

// The four you fix, in copy order: spacing, colour, type, alignment.
const MAIN_AT = [0.35, 0.385, 0.42, 0.455];
const MAIN = (
  [
    ["stats", 0.5, 0],
    ["btn", 0.85, 0.1],
    ["title", 1, 0.35],
    ["table", 0.97, 0.04],
  ] as const
).map(([a, x, y], i) => ({
  a,
  x,
  y,
  at: MAIN_AT[i],
  re: MAIN_AT[i] + 0.01,
  fix: MAIN_AT[i] + 0.022,
}));
// The pile: on element edges so the content stays readable, faster and
// faster. You answer the first few, then stop; the rest wait for me.
const PILE = 24;
const KEEP_UP = 3;
const ON = ["stat0", "chart", "table", "stat2", "stat1", "btn", "title"];
const EDGE = [
  [0.96, 0.15],
  [0.04, 1],
  [0.62, 1],
  [0.5, 1],
  [0.02, 0.2],
  [0.8, 1],
];
const pileAt = (i: number) => PILE_AT + 0.19 * Math.sqrt(i / PILE);
const SPOTS: Spot[] = [
  ...MAIN,
  ...Array.from({ length: PILE }, (_, i) => {
    const at = pileAt(i);
    const re = at + Math.min(0.01, (pileAt(i + 1) - at) * 0.6);
    return {
      a: ON[i % ON.length],
      x: EDGE[(i * 5) % EDGE.length][0],
      y: EDGE[(i * 5) % EDGE.length][1],
      at,
      ...(i < KEEP_UP ? { re, fix: re + 0.006 } : { fix: FIXALL + i * 0.0005 }),
    };
  }),
];
// Your thread with me, in the middle of the dashboard so the eye stays put.
// Away while I comment, back when you give up.
const ASK: Spot = { a: "dash", x: 0.5, y: 0.62, at: ASK_PIN, fix: FIXALL };
const askShown = (v: number) =>
  (v > ASK_PIN && v < ASK_LEAVE) || (v > GIVE_GO && v < FIXALL + 0.025);

/** Your cursor: -1 off, 0–1 dragging a selection over the dashboard, 2 at
 * your pin with the selection, 3 back at your pin to give up. */
function selAt(v: number) {
  if (v >= GIVE_GO && v < FIXALL + 0.01) return 3;
  if (v < ASK_GO || v >= ASK_LEAVE) return -1;
  if (v >= SEL_END) return 2;
  return Math.round(clamp(v, ASK_GO + 0.004, SEL_END - 0.003) * 20) / 20;
}

/** The open comment: -2 your question, -3 you give up, -1 none. */
function activeAt(v: number) {
  if (v >= ASK_POP && v < ASK_LEAVE) return -2;
  if (v >= GIVE_POP && v < FIXALL) return -3;
  if (v >= GIVE_GO) return -1;
  let best = -1;
  SPOTS.forEach((s, i) => {
    if (v >= s.at) best = i;
  });
  return best >= 0 && v < SPOTS[best].fix + 0.008 ? best : -1;
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

/** A plan chip; hovering it opens a card that plays what the plan does. */
function PlanChip({
  index,
  plan,
  price,
  onPick,
  enter,
}: {
  index: number;
  plan: Offer["plans"][number];
  price: string;
  onPick: () => void;
  enter: React.ComponentProps<typeof motion.button>;
}) {
  const [run, setRun] = useState(0);
  const Scene = SCENES[index];
  return (
    <HoverCard
      openDelay={150}
      closeDelay={100}
      onOpenChange={(o) => o && setRun((r) => r + 1)}
    >
      <HoverCardTrigger asChild>
        <motion.button
          {...enter}
          type="button"
          onClick={onPick}
          className="composer-chip"
        >
          <span className="font-medium">{plan.name}</span>
          <span className="text-muted-foreground tabular-nums">{price}</span>
        </motion.button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        sideOffset={8}
        className="bg-popover/95 border-border/80 flex w-64 flex-col gap-1.5 rounded-xl p-3 shadow-xl backdrop-blur-md"
      >
        <div
          aria-hidden
          className="bg-muted mb-1.5 grid h-28 place-items-center overflow-hidden rounded-lg"
        >
          <Scene run={run} />
        </div>
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold">{plan.name}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {price}
          </span>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {plan.desc}
        </p>
        <p className="text-muted-foreground/80 text-xs">{plan.time}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

// The plan scenes, from the old offer section. Keyed on `run`: each open
// remounts them from the "before" pose.
const bounce = { type: "spring", stiffness: 300, damping: 22 } as const;
const from = <T,>(run: number, pose: T) => (run ? pose : false);

const Window = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background border-border/80 relative h-20 w-28 rounded-md border p-2 shadow-sm">
    {children}
  </div>
);
const Bar = ({ className = "" }: { className?: string }) => (
  <span className={`bg-foreground/15 block h-1.5 rounded-full ${className}`} />
);

/* Honest take: three numbered notes land on the rough spots. */
function Notes({ run }: { run: number }) {
  const pins = [
    ["left-3 top-1", "1"],
    ["right-2 top-7", "2"],
    ["left-7 bottom-1", "3"],
  ];
  return (
    <Window>
      <Bar className="w-10" />
      <Bar className="mt-2 w-20" />
      <Bar className="mt-1 w-14" />
      <span className="border-foreground/15 mt-3 block h-4 w-12 rounded-sm border" />
      {pins.map(([pos, n], i) => (
        <motion.span
          key={`${run}-${n}`}
          className={`bg-foreground text-background absolute grid size-4 place-items-center rounded-full text-[9px] font-semibold ${pos}`}
          initial={from(run, { scale: 0, opacity: 0 })}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...bounce, delay: 0.15 + i * 0.18 }}
        >
          {n}
        </motion.span>
      ))}
    </Window>
  );
}

/* Polish sprint: an uneven card snaps onto one edge and one rhythm. */
function Snap({ run }: { run: number }) {
  const rows = [
    { x: 7, w: "w-10", d: 0 },
    { x: -5, w: "w-20", d: 0.08 },
    { x: 10, w: "w-14", d: 0.16 },
  ];
  return (
    <Window>
      {rows.map((r, i) => (
        <motion.div
          key={`${run}-${i}`}
          className={i ? "mt-1.5" : ""}
          initial={from(run, { x: r.x })}
          animate={{ x: 0 }}
          transition={{ ...bounce, delay: 0.2 + r.d }}
        >
          <Bar className={r.w} />
        </motion.div>
      ))}
      <motion.span
        key={`${run}-btn`}
        className="mt-3 block h-4 w-12"
        initial={from(run, {
          x: 6,
          borderRadius: 0,
          backgroundColor: "var(--muted)",
        })}
        animate={{
          x: 0,
          borderRadius: 999,
          backgroundColor: "var(--foreground)",
        }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
      />
    </Window>
  );
}

/* Build from scratch: the page goes up block by block. */
function Blocks({ run }: { run: number }) {
  const blocks = [
    "h-1.5 w-full",
    "mt-2 h-5 w-full",
    "mt-1.5 h-4 w-[30%]",
    "mt-1.5 h-4 w-[30%]",
    "mt-1.5 h-4 w-[30%]",
  ];
  return (
    <Window>
      <div className="flex flex-wrap justify-between">
        {blocks.map((b, i) => (
          <motion.span
            key={`${run}-${i}`}
            className={`bg-foreground/15 block rounded-sm ${b}`}
            initial={from(run, { opacity: 0, y: 6 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.09 }}
          />
        ))}
      </div>
    </Window>
  );
}

const SCENES = [Notes, Snap, Blocks];

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
  contact,
  locale,
  p,
  mode,
  onGone,
}: {
  copy: Copy;
  offer: Offer;
  contact: Contact;
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
        <div className="-mx-1 mb-1 flex flex-wrap gap-1.5 p-1">
          {offer.plans.map((pl, i) => (
            <PlanChip
              key={pl.name}
              index={i}
              plan={pl}
              price={prices[i] ? `${offer.from} ${prices[i]}` : offer.free}
              onPick={() => pick(pl.name)}
              enter={later(0.6 + i * 0.08)}
            />
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
          {/* The + only dresses the story's AI chat; the real one has none. */}
          {!cta && (
            <motion.span
              layout="position"
              transition={morph}
              aria-hidden
              className="composer-icon"
            >
              <Plus />
            </motion.span>
          )}
          {cta && (
            // Rather email or DM? Same toolbar as the + and send.
            <motion.div
              {...later(1)}
              className="flex min-w-0 items-center [grid-area:tools]"
            >
              <ContactIcons copy={contact} />
            </motion.div>
          )}
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
        <motion.p {...later(0.9)} className="mt-2 px-1 text-xs">
          <Note offer={offer} />
        </motion.p>
      )}
      {cta && (
        // The story ends here: the same ways on as under the hello.
        <motion.div
          {...later(1.1)}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <p className="text-muted-foreground text-sm">{copy.skip.more}</p>
          <Shortcuts copy={copy} locale={locale} />
        </motion.div>
      )}
    </motion.div>
  );
}

/** "Human, can make mistakes", with the fine print on hover. */
function Note({ offer }: { offer: Offer }) {
  return (
    <Tooltip delayDuration={600}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-help decoration-dotted underline-offset-4 transition-colors hover:underline focus-visible:underline"
        >
          {offer.note}
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="max-w-64 text-balance">
        {offer.noteTip}
      </TooltipContent>
    </Tooltip>
  );
}

/** The story's last composer on its own, without the plans: the sub-pages
 * and the contact page. */
export function AskBox({ locale }: { locale: Locale }) {
  const { review: copy, offer, contact } = getPortfolioCopy(locale);
  const { text, setText, send, onKeyDown } = useDraft();
  return (
    <div>
      <div className="composer" data-mode="cta" style={{ borderRadius: 22 }}>
        <div className="composer-body">
          <label htmlFor="contact-ask" className="sr-only">
            {copy.cta.title}
          </label>
          <textarea
            id="contact-ask"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={copy.cta.placeholder}
            className="composer-input"
          />
          <div className="flex min-w-0 items-center [grid-area:tools]">
            <ContactIcons copy={contact} />
          </div>
          <span className="[grid-area:send]">
            <Send label={copy.cta.send} onClick={send} off={!text.trim()} />
          </span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 text-xs">
        <Note offer={offer} />
        <FooterMeta copy={contact} />
      </div>
    </div>
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
            <p className="dash-extra dash-eyebrow">{copy.dash.eyebrow}</p>
            <p data-a="title" className="dash-title">
              {copy.dash.title}
              {pins("title")}
            </p>
            <p className="dash-label">{copy.dash.range}</p>
            <p className="dash-extra dash-blurb">{copy.dash.blurb}</p>
          </div>
          <span data-a="btn" className="dash-btn">
            <Plus className="size-3.5" /> {copy.dash.action}
            {pins("btn")}
          </span>
        </div>
        <div data-a="stats" className="dash-stats">
          {copy.dash.stats.map(([label, num, delta], i) => (
            <div key={label} data-a={`stat${i}`} className="dash-card">
              <span className="dash-label dash-mono">{label}</span>
              <span className="dash-num">{num}</span>
              <span className="dash-delta dash-mono">
                {delta}
                <span className="dash-extra"> {copy.dash.note}</span>
              </span>
              {pins(`stat${i}`)}
            </div>
          ))}
          {pins("stats")}
        </div>
        <div data-a="chart" className="dash-card">
          <span className="dash-label dash-mono">{copy.dash.chart}</span>
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
              <span className="dash-mono">{date}</span>
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
  const drop = useBeat(p, (v) => (you ? askShown(v) : v > s.at));
  const done = useBeat(p, (v) => !you && v > s.fix, settle);
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
  center,
  children,
}: {
  pin: Box;
  w: number;
  center?: boolean;
  children: React.ReactNode;
}) {
  const width = Math.min(240, w);
  const y = pin.y + pin.h;
  // Above the pin, or below it when the pin sits near the top.
  const above = y > 140;
  return (
    <motion.div
      layout
      className="dash-pop"
      data-above={above}
      style={{
        width,
        left: center
          ? (w - width) / 2
          : Math.min(Math.max(0, pin.x - 12), w - width),
        transformOrigin: center ? "bottom center" : undefined,
        top: above ? y - 36 : y + 8,
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
    dash.current?.toggleAttribute("data-clean", q > 0.5);
    s?.setProperty("--x", String(q));
    if (s)
      ["--p", "--c", "--f", "--a"].forEach((k, i) =>
        s.setProperty(
          k,
          String(
            Math.max(
              q,
              (i === 3 ? 1 : 0.4) * clamp(v, MAIN[i].re, MAIN[i].fix),
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
  contact,
  locale,
  p,
  still,
  onGone,
}: {
  copy: Copy;
  offer: Offer;
  contact: Contact;
  locale: Locale;
  p: P;
  still: boolean;
  onGone: (gone: boolean) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("big");
  const [tick, setTick] = useState(0);
  const [act, setAct] = useState(-1);
  const [sel, setSel] = useState(-1);
  const [reply, setReply] = useState(false);
  const [box, setBox] = useState<{
    pin: Box | null;
    dash: Box | null;
    ask: Box | null;
    w: number;
    h: number;
  }>({ pin: null, dash: null, ask: null, w: 0, h: 0 });

  const read = (v: number) => {
    setMode(modeAt(v));
    const a = activeAt(v);
    setAct(a);
    setSel(selAt(v));
    const re = a >= 0 ? SPOTS[a].re : a === -2 ? REPLY : ONIT;
    setReply(re !== undefined && v >= re);
  };
  useMotionValueEvent(p, "change", read);
  useLayoutEffect(() => read(p.get()));

  const selOn = sel >= 0;
  // The popover sits on its pin and your cursor aims at real elements,
  // measured once per target.
  useLayoutEffect(() => {
    const root = stage.current;
    if (!root) return;
    const find = (q: string) =>
      offsetIn(root.querySelector<HTMLElement>(q), root);
    setBox({
      pin: find(`[data-n="${act <= -2 ? "ask" : act}"]`),
      dash: find(".dash"),
      ask: find('[data-n="ask"]'),
      w: root.offsetWidth,
      h: root.offsetHeight,
    });
  }, [act, selOn, mode, tick]);
  const d = box.dash;
  const drag = Math.min(1, sel);
  const youAt: Point =
    sel < 0 || !d
      ? null
      : sel > 1
        ? box.ask && { x: box.ask.x + 10, y: box.ask.y + box.ask.h + 6 }
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
        contact={contact}
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
              <Popover key={act} pin={box.pin} w={box.w} center={act <= -2}>
                <Msg
                  copy={copy}
                  you={act <= -2}
                  text={
                    act === -2
                      ? copy.chat.ask
                      : act === -3
                        ? copy.chat.giveup
                        : act < MAIN.length
                          ? copy.comments[act]
                          : copy.pile[(act - MAIN.length) % copy.pile.length]
                  }
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
                      you={act >= 0}
                      text={
                        act === -2
                          ? copy.chat.reply
                          : act === -3
                            ? copy.chat.onit
                            : copy.replies[act % copy.replies.length]
                      }
                    />
                  </motion.div>
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
        </>
      )}
    </motion.div>
  );
}

/** Straight to the rest of the page, no story in between. */
function Shortcuts({
  copy,
  locale,
  onPlay,
  className,
}: {
  copy: Copy;
  locale: Locale;
  onPlay?: () => void;
  className?: string;
}) {
  const base = locale === "id" ? "/id" : "";
  const chip = (label: string, tip: string, el: React.ReactElement) => (
    <Tooltip key={label} delayDuration={500}>
      <TooltipTrigger asChild>{el}</TooltipTrigger>
      <TooltipContent sideOffset={6}>{tip}</TooltipContent>
    </Tooltip>
  );
  return (
    <div className={cn("flex flex-wrap justify-center gap-1.5", className)}>
      {onPlay &&
        chip(
          copy.skip.play,
          copy.skip.playTip,
          <button
            type="button"
            onClick={onPlay}
            className="composer-chip inline-flex items-center gap-1.5"
          >
            <Play aria-hidden className="size-3 fill-current" />
            {copy.skip.play}
          </button>,
        )}
      {!onPlay &&
        chip(
          copy.skip.top,
          copy.skip.topTip,
          <button
            type="button"
            onClick={() => jumpTo(0)}
            className="composer-chip inline-flex items-center gap-1.5"
          >
            <ArrowUp aria-hidden className="size-3" />
            {copy.skip.top}
          </button>,
        )}
      {chip(
        copy.skip.about,
        copy.skip.aboutTip,
        <Link
          href={`${base}/about`}
          className="composer-chip composer-chip-ghost"
        >
          {copy.skip.about}
        </Link>,
      )}
      {chip(
        copy.skip.work,
        copy.skip.workTip,
        <Link
          href={`${base}/work`}
          className="composer-chip composer-chip-ghost"
        >
          {copy.skip.work}
        </Link>,
      )}
      {/* At the story's end the contacts are right above. */}
      {onPlay &&
        chip(
          copy.skip.contact,
          copy.skip.contactTip,
          <Link
            href={`${base}/contact`}
            className="composer-chip composer-chip-ghost"
          >
            {copy.skip.contact}
          </Link>,
        )}
    </div>
  );
}

// Autoplay: the whole pin in about 40s, at an even pace, so the holds play
// as pauses. Your own scroll, a scroll key, or any other jump pauses it.
const PLAY_MS = 40000;
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);
type Auto = "off" | "on" | "paused";

function useAutoplay(ref: React.RefObject<HTMLElement | null>) {
  const [auto, setAuto] = useState<Auto>("off");
  useEffect(() => {
    const el = ref.current;
    if (auto !== "on" || !el) return;
    const run = el.offsetHeight - innerHeight;
    const to = el.getBoundingClientRect().top + scrollY + run;
    const speed = run / PLAY_MS;
    const start = performance.now();
    let last = start;
    let y = scrollY;
    let raf = 0;
    const pause = () => setAuto("paused");
    // Clicking anything but the pill (rail, a link) is taking over too.
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-autopill]")) pause();
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (SCROLL_KEYS.has(e.key) && !t.closest("button,a,input,textarea"))
        pause();
    };
    const tick = (now: number) => {
      // Something else moved the page (rail, link, Lenis): let it win.
      if (Math.abs(scrollY - y) > 40) return pause();
      // Eases in over 0.6s and out over the last 0.6s of travel.
      const pace = Math.min(
        1,
        (now - start) / 600,
        Math.max(0.15, (to - y) / (speed * 600)),
      );
      y = Math.min(to, y + speed * pace * Math.min(50, now - last));
      last = now;
      jumpTo(y);
      if (y >= to - 0.5) return setAuto("off");
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    addEventListener("wheel", pause, { passive: true });
    addEventListener("touchmove", pause, { passive: true });
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(raf);
      removeEventListener("wheel", pause);
      removeEventListener("touchmove", pause);
      removeEventListener("keydown", onKey);
    };
  }, [auto, ref]);
  return [auto, setAuto] as const;
}

/** Pause or resume the autoplay, with how far the story has got. */
function AutoPill({
  copy,
  auto,
  show,
  p,
  onToggle,
}: {
  copy: Copy;
  auto: Auto;
  show: boolean;
  p: P;
  onToggle: () => void;
}) {
  const done = useTransform(p, [-INTRO, END], [0, 1]);
  const on = auto === "on";
  const label = on ? copy.skip.pause : copy.skip.resume;
  // A portal: the stage's transforms would pin "fixed" to the stage.
  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          data-autopill
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggle}
                aria-pressed={!on}
                className="bg-background/80 border-border/80 text-muted-foreground hover:text-foreground relative inline-flex h-8 cursor-pointer items-center gap-1.5 overflow-hidden rounded-full border px-3 text-xs font-medium backdrop-blur-md transition-colors"
              >
                {on ? (
                  <Pause aria-hidden className="size-3 fill-current" />
                ) : (
                  <Play aria-hidden className="size-3 fill-current" />
                )}
                {label}
                <motion.span
                  aria-hidden
                  style={{ scaleX: done }}
                  className="bg-foreground/30 absolute inset-x-3 bottom-1 h-px origin-left"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{copy.skip.playTip}</TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Under the hello: the story is a scroll away. */
function Skip({ copy, show }: { copy: Copy; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-x-0 bottom-8 flex flex-col items-center md:bottom-12"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.8 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => smoothScrollTo(scrollY + innerHeight, 1.2)}
                className="text-muted-foreground hover:text-foreground flex cursor-pointer flex-col items-center gap-1 text-sm transition-colors"
              >
                {copy.skip.story}
                <ArrowDown className="size-4 motion-safe:animate-bounce" />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{copy.skip.storyTip}</TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ReviewStory({
  copy,
  offer,
  contact,
  locale,
}: {
  copy: Copy;
  offer: Offer;
  contact: Contact;
  locale: Locale;
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // A JS copy: native scroll timelines can mismeasure sticky targets.
  // Starts on the hello, so the server render opens on it too.
  const p = useMotionValue(-INTRO);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!still) p.set(toStory(v));
  });
  useEffect(() => {
    p.set(still ? 1 : toStory(scrollYProgress.get()));
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
  // The hello plays again whenever you scroll back up to it.
  const [hello, setHello] = useState(true);
  useMotionValueEvent(p, "change", (v) => {
    setHello(v < HELLO_END - 0.02);
    setEnded(v >= END - 0.002);
  });
  const [ended, setEnded] = useState(false);
  const [auto, setAuto] = useAutoplay(ref);
  // At the end, the blank under the centered pricing is pulled back so the
  // next section rises right after it.
  const content = useRef<HTMLDivElement>(null);
  const [slack, setSlack] = useState(0);
  useLayoutEffect(() => {
    const c = content.current;
    if (!c || still) return;
    const ro = new ResizeObserver(() =>
      setSlack(
        Math.max(0, (c.parentElement!.offsetHeight - c.offsetHeight) / 2),
      ),
    );
    ro.observe(c);
    ro.observe(c.parentElement!);
    return () => ro.disconnect();
  }, [still]);
  // The intro line starts in the middle of the screen and makes room as the
  // composer grows. Half the stage (its height class) plus the gap, in CSS,
  // so it is right from the first paint.
  const captionY = useTransform(
    p,
    (v): string =>
      `calc(${1 - ease(clamp(v, GROW[0], GROW[1]))} * (min(36rem, 100svh - 12rem) + 24px) / 2)`,
  );

  return (
    <section
      ref={ref}
      id="review"
      aria-labelledby="review-heading"
      // Pulled up over main's top padding: pinned from the very top, so
      // nothing slides when you scroll back up.
      className={cn(
        "relative w-full",
        !still && "-mt-8 h-[1225svh] md:-mt-12 md:h-[1445svh]",
      )}
      style={{ marginBottom: still ? 0 : -slack }}
    >
      {/* Rail chapters, placed at the scroll spot of their beat. */}
      {!still &&
        CHAPTERS.map(([id, at]) => (
          <div
            key={id}
            id={id}
            aria-hidden
            className="pointer-events-none absolute inset-x-0"
            style={{
              top: `calc((100% - 100svh) * ${toScroll(at)})`,
            }}
          />
        ))}
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
        {!still && <Skip copy={copy} show={hello} />}
        {!still && auto !== "off" && (
          <AutoPill
            copy={copy}
            auto={auto}
            show={!hello && !ended}
            p={p}
            onToggle={() => setAuto(auto === "on" ? "paused" : "on")}
          />
        )}
        <div ref={content} className="flex flex-col gap-6">
          <h1 id="review-heading" className="sr-only">
            {copy.title}
          </h1>
          <p className="sr-only">{copy.sr}</p>
          {still ? (
            <p className="text-[clamp(24px,4.8vw,36px)] leading-tight font-medium tracking-[-0.04em]">
              {copy.cta.title}
            </p>
          ) : (
            // Layout glide outside, scroll offset inside: a layout
            // animation would otherwise wipe the offset.
            // Above the stage: on the hello the caption sits over its blank
            // middle, and the chips under it must stay clickable.
            <motion.div
              layout="position"
              transition={morph}
              className="relative z-10"
            >
              <motion.div style={{ y: captionY }} className="relative">
                <div
                  aria-hidden
                  className="grid grid-cols-1 text-[clamp(24px,4.8vw,36px)] leading-tight font-medium tracking-[-0.04em]"
                >
                  <Caption from={-1} to={HELLO_END} p={p}>
                    {/* First visit: the avatar pops, then the words rise in
                      (RantAI hero timing). From 1%, so it still counts for LCP. */}
                    <motion.span
                      className="mr-[0.25em] inline-block align-[-0.15em]"
                      initial={{ opacity: 0.01, scale: 0.6 }}
                      animate={
                        hello
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0.01, scale: 0.6 }
                      }
                      transition={{ type: "spring", ...pop, delay: 0.1 }}
                    >
                      <Image
                        src="/avatar.png"
                        alt=""
                        width={40}
                        height={40}
                        priority
                        className="block size-[1em] rounded-full"
                      />
                    </motion.span>
                    <SplitReveal
                      as="span"
                      trigger="mount"
                      text={copy.hello[0]}
                      play={hello}
                      delay={0.2}
                      from={0.01}
                    />
                    <br />
                    <SplitReveal
                      as="span"
                      trigger="mount"
                      text={copy.hello[1]}
                      play={hello}
                      delay={0.45}
                      from={0.01}
                      className="text-muted-foreground"
                    />
                  </Caption>
                  <Caption from={HELLO_END} to={BRIDGE_END} p={p}>
                    {copy.bridge}
                  </Caption>
                  <Caption from={BRIDGE_END} to={CAPTION_AT[1]} p={p}>
                    {copy.intro}{" "}
                    <span className="inline-flex align-[0.02em]">
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
                </div>
                {/* Ways on, right under the hello; out of flow so the
                  composer keeps its spot. */}
                <AnimatePresence>
                  {hello && (
                    <motion.div
                      className="absolute inset-x-0 top-full mt-6"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.8 }}
                    >
                      <Shortcuts
                        copy={copy}
                        locale={locale}
                        onPlay={() => setAuto("on")}
                        className="justify-start"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
          <Stage
            copy={copy}
            offer={offer}
            contact={contact}
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
