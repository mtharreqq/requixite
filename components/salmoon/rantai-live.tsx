"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  GraduationCap,
  Layers,
  Github,
  Instagram,
  Linkedin,
  Send,
  Server,
  Moon,
  Wrench,
  Youtube,
} from "lucide-react";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { RantaiPanorama } from "@/components/salmoon/rantai-panorama";

// Both versions of rantai.dev are laid out at desktop size and scaled to fit,
// so the frame reads as the real site at any width.
const W = 1200;
const H = 750;
const ease = [0.22, 1, 0.36, 1] as const;
const live = "/work/rantai/live";

// The old hero's carousel, as it ran on the AI-built site.
const SLIDES = [
  { lines: ["AI Coders", "And Optimizers"], bg: "bg-ai-products" },
  { lines: ["Build. Ship.", "Scale With AI"], bg: "bg-vision-1" },
  { lines: ["Learn AI", "The Hard Way"], bg: "bg-academy" },
];

/** The old site's header, shared by both of its pages. */
function OldNav({ active = 0 }: { active?: number }) {
  return (
    <>
      <span className="absolute -top-6 -left-6 size-12 rounded-full border border-sky-400/70" />
      <div className="absolute top-[24px] left-[22px] flex items-center gap-1 text-[19px] font-black tracking-tight text-sky-200 [-webkit-text-stroke:0.6px_white]">
        <Image
          src={`${live}/rant-ai.png`}
          alt=""
          width={28}
          height={28}
          className="[filter:drop-shadow(0_0_0.6px_#fff)_drop-shadow(0_0_0.6px_#fff)]"
        />
        RantAI
      </div>
      <nav className="absolute top-[22px] right-[22px] flex items-center gap-11 text-[13px] font-semibold">
        {["Home", "Academy", "Services", "Platforms"].map((item, i) => (
          <span key={item} className="relative">
            {item}
            {i === active && (
              <span className="absolute inset-x-0 -bottom-1.5 h-0.5 bg-sky-400" />
            )}
          </span>
        ))}
        <span className="flex items-center gap-7">
          <span className="h-8 w-px bg-white/15" />
          <Moon className="size-4" />
        </span>
      </nav>
    </>
  );
}

/**
 * The AI-built site, rebuilt from public/work/rantai/before.jpg: still the
 * vibecoded look (heavy caps, glow, loose spacing), but alive like the real
 * thing was, so the polished one wins on craft, not on being static.
 */
function OldSite() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [slide, setSlide] = useState(1);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      3200,
    );
    return () => clearInterval(id);
  }, [inView, reduce]);
  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden bg-[#0a0b10] text-white"
    >
      {/* Backdrop per slide, darkened so the caps stay readable. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={reduce ? undefined : { scale: 1.08 }}
            transition={{ duration: 6, ease: "linear" }}
          >
            <Image
              src={`${live}/${SLIDES[slide].bg}.jpg`}
              alt=""
              fill
              sizes="56rem"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <span className="absolute inset-0 bg-[#0a0b10]/75" />
      <span className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <OldNav />
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={slide}
          className="absolute top-[222px] left-4 text-[80px] leading-[1.4] font-black tracking-[0.04em] uppercase"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {SLIDES[slide].lines[0]}
          <br />
          <span className="pl-20">{SLIDES[slide].lines[1]}</span>
        </motion.p>
      </AnimatePresence>
      {[ChevronLeft, ChevronRight].map((Icon, i) => (
        <span
          key={i}
          className={`absolute top-[380px] grid size-[54px] place-items-center rounded-full border border-white/25 ${i ? "right-[30px]" : "left-[30px]"}`}
        >
          <Icon className="size-4" />
        </span>
      ))}
      <p className="absolute top-[496px] left-[15px] flex items-center gap-3 text-[13px] tracking-[0.3em]">
        <span className="relative py-1.5 pl-2">
          <span className="absolute inset-y-0 left-0 w-[90px] bg-white/10" />
          <span className="relative">RANTAI SERVICES</span>
        </span>
        <motion.span
          animate={reduce ? undefined : { x: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <ArrowRight className="size-4" />
        </motion.span>
      </p>
      <ul className="absolute bottom-10 left-[43px] flex gap-[7px]">
        {[Linkedin, Github, Instagram, Youtube, Send].map((Icon, i) => (
          <li
            key={i}
            className="grid size-10 place-items-center rounded-full border border-white/10"
          >
            <Icon className="size-3.5" />
          </li>
        ))}
      </ul>
      <p className="absolute right-10 bottom-[50px] flex items-end gap-2 leading-none">
        <span className="text-[54px] font-extralight text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.7)]">
          {slide + 1}
        </span>
        <span className="pb-1 text-[13px] text-white/60">/</span>
        <span className="text-[44px] font-bold">{SLIDES.length}</span>
      </p>
    </div>
  );
}

const OLD_PRODUCTS = [
  {
    Icon: GraduationCap,
    name: "RantAI Academy",
    body: "Advanced education in Software, AI, Simulation, and Blockchain covering scientific disciplines",
  },
  {
    Icon: Wrench,
    name: "RantAI Services",
    body: "Technology consulting services for revitalizing outdated applications.",
  },
  {
    Icon: Layers,
    name: "RantAI Platforms",
    body: "Interactive simulations and advanced tools for diverse scientific models.",
  },
];

/** The AI-built products page, rebuilt from products-before.jpg. */
function OldProducts() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0b10] text-white">
      <span className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <span className="absolute inset-x-0 top-0 h-[80px] border-b border-white/5 bg-white/[0.03]" />
      <OldNav active={-1} />
      <p className="absolute inset-x-0 top-[96px] text-center text-[13px] tracking-[0.7em] text-sky-400">
        BEST FEATURES
      </p>
      <p className="absolute inset-x-0 top-[128px] text-center text-[76px] font-black tracking-[0.03em] [text-shadow:0_10px_0_rgb(255_255_255/0.08)]">
        PRODUCTS.
      </p>
      <ul className="absolute inset-x-[15px] top-[312px] bottom-[22px] grid grid-cols-3 gap-[30px]">
        {OLD_PRODUCTS.map(({ Icon, name, body }, i) => (
          <motion.li
            key={name}
            className="flex flex-col items-center border border-white/[0.07] px-14 pt-16 text-center"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 * i, ease: "easeOut" }}
          >
            <Icon className="size-7 text-sky-400" strokeWidth={2.5} />
            <span className="mt-12 text-[18px] font-semibold">{name}</span>
            <span className="mt-5 text-[15px] leading-[30px] text-white/75">
              {body}
            </span>
            <span className="mt-auto mb-16 flex items-center gap-2 text-[13px] tracking-[0.3em]">
              <span className="relative py-2 pl-2">
                <span className="absolute inset-y-0 left-0 w-[74px] bg-white/10" />
                <span className="relative">SEE PRODUCT</span>
              </span>
              <ArrowRight className="size-4" />
            </span>
          </motion.li>
        ))}
      </ul>
      <span className="absolute right-[30px] bottom-[34px] grid size-11 place-items-center rounded-full border-2 border-sky-400 border-l-transparent">
        <ChevronUp className="size-4 text-sky-400" />
      </span>
    </div>
  );
}

/** The polished site's header; the current page gets the pill. */
function NewNav({ active = -1 }: { active?: number }) {
  return (
    <nav className="flex h-[48px] items-center px-7">
      <span className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
        <Image src={`${live}/rant-ai.png`} alt="" width={24} height={24} />
        RantAI
      </span>
      <span className="ml-10 flex gap-1 text-[13px] text-neutral-600">
        {["Products", "Services", "Academy", "Insights", "Company"].map(
          (item, i) => (
            <span
              key={item}
              className={`rounded-full px-3 py-1.5 ${i === active ? "bg-neutral-100 text-neutral-900" : ""}`}
            >
              {item}
            </span>
          ),
        )}
      </span>
      <span className="ml-auto flex rounded-full bg-neutral-100 p-0.5 text-[11px] font-medium">
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">EN</span>
        <span className="px-2.5 py-1 text-neutral-400">ID</span>
      </span>
      <span className="ml-2 flex h-9 items-center gap-2 rounded-full bg-black px-4 text-[13px] font-medium text-white">
        Contact us
        <ArrowUpRight className="size-3.5" />
      </span>
    </nav>
  );
}

/** The polished site: RantAI's home-hero, copied from rant-ai-landing-page. */
function NewSite({ play }: { play: boolean }) {
  return (
    <div className="absolute inset-0 bg-white text-neutral-900">
      <NewNav />
      <div className="dark absolute inset-x-[13px] top-[48px] bottom-[13px] isolate flex flex-col items-center justify-end overflow-hidden rounded-[28px] bg-black pb-6 text-center text-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <RantaiPanorama />
        </div>
        {/* Mounted when the sweep starts, so the entrance plays as it appears. */}
        {play && (
          <div className="flex flex-col items-center">
            {/* One reveal per line: SplitReveal's "\n" break is viewport-based,
              and this scene is always desktop width. */}
            {["AI systems for", "real‑world operations."].map((line, k) => (
              <SplitReveal
                key={line}
                as="span"
                text={line}
                trigger="mount"
                delay={0.15 + k * 0.18}
                className="block text-[92px] leading-[0.94] font-medium tracking-[-0.05em]"
              />
            ))}
            <motion.span
              className="mt-6 block max-w-[500px] text-[17px] leading-relaxed text-white/70"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
            >
              Agents, data platforms, and engineering teams for enterprise and
              government, built to run in production.
            </motion.span>
            <motion.span
              className="mt-8 flex gap-3 text-[14px] font-medium"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
            >
              <span className="flex h-11 items-center gap-2 rounded-full bg-white px-6 text-black">
                Talk to our team <ArrowUpRight className="size-4" />
              </span>
              <span className="flex h-11 items-center gap-2 rounded-full border border-white/20 px-6">
                Explore products <ArrowRight className="size-4" />
              </span>
            </motion.span>
            <motion.span
              className="mt-10 flex items-center gap-10 border-t border-white/10 pt-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.7 }}
            >
              <span className="text-[11px] font-medium tracking-[0.08em] text-white/60">
                PARTNERS
              </span>
              {["nqrust", "ventures", "bohrlabs"].map((name) => (
                <Image
                  key={name}
                  src={`${live}/${name}.png`}
                  alt=""
                  width={84}
                  height={56}
                  className="opacity-75 brightness-0 invert"
                />
              ))}
            </motion.span>
          </div>
        )}
        <span className="absolute top-6 right-6 text-[11px] font-medium tracking-[0.08em] text-white/50">
          SCROLL TO EXPLORE
        </span>
      </div>
    </div>
  );
}

/** Rise-in used by the polished products page, as RantAI's bento tiles. */
function rise(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  };
}

const TILE =
  "relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_20px_50px_-36px_rgba(0,0,0,0.4)]";

/** The polished products page: RantAI's products hero and bento. */
function NewProducts({ play }: { play: boolean }) {
  return (
    <div className="absolute inset-0 bg-white text-neutral-900">
      <NewNav active={0} />
      {play && (
        <>
          <div className="absolute top-[170px] left-[47px] w-[460px]">
            <motion.span
              {...rise(0.1)}
              className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-neutral-500"
            >
              <span className="size-0 border-t-[7px] border-l-[7px] border-t-sky-500 border-l-transparent" />
              PRODUCTS
            </motion.span>
            {["AI products built", "for real operations."].map((line, k) => (
              <SplitReveal
                key={line}
                as="span"
                text={line}
                trigger="mount"
                delay={0.15 + k * 0.18}
                className={`block text-[54px] leading-[1.02] font-medium tracking-[-0.045em] ${k ? "" : "mt-4"}`}
              />
            ))}
            <motion.span
              {...rise(0.35)}
              className="mt-6 block max-w-[290px] text-[16px] leading-relaxed text-neutral-500"
            >
              Four products that work together, from your data to the agents
              that act on it.
            </motion.span>
            <motion.span
              {...rise(0.5)}
              className="mt-8 flex gap-2.5 text-[14px] font-medium"
            >
              <span className="flex h-11 items-center gap-2 rounded-full bg-black px-6 text-white">
                Request a demo <ArrowUpRight className="size-4" />
              </span>
              <span className="flex h-11 items-center gap-2 rounded-full border border-neutral-200 px-6">
                See them in action <ArrowRight className="size-4" />
              </span>
            </motion.span>
          </div>
          {/* Tiles run off the right and bottom on purpose, as on rantai.dev. */}
          <div className="absolute top-[108px] right-[47px] h-[386px] w-[515px] overflow-hidden rounded-[28px] bg-[#eef3ff]">
            <div className="absolute top-[34px] -right-14 -bottom-14 left-[34px] flex gap-3">
              <div className="flex w-[60%] flex-col gap-3">
                <motion.div {...rise(0.35)} className={`${TILE} basis-[58%]`}>
                  <Image
                    src={`${live}/rantai-agents-chat.webp`}
                    alt=""
                    fill
                    sizes="20rem"
                    className="object-cover object-top-left"
                  />
                </motion.div>
                <motion.div {...rise(0.55)} className={`${TILE} flex-1`}>
                  <Image
                    src={`${live}/lake-dashboard.webp`}
                    alt=""
                    fill
                    sizes="20rem"
                    className="object-cover object-[0%_18%]"
                  />
                </motion.div>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <motion.div {...rise(0.45)} className={`${TILE} basis-[40%]`}>
                  <Image
                    src={`${live}/rantai-claw-console.webp`}
                    alt=""
                    fill
                    sizes="12rem"
                    className="object-cover object-left"
                  />
                </motion.div>
                <motion.div
                  {...rise(0.6)}
                  className="flex basis-[24%] flex-col justify-between rounded-2xl bg-[#8b5cf6] p-4 text-white"
                >
                  <span className="text-[12px] font-medium text-white/85">
                    RantAI LLMOps
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="text-[30px] leading-none font-medium tracking-[-0.03em]">
                      +18%
                    </span>
                    <span className="text-[11px] text-white/75">
                      after fine-tuning
                    </span>
                  </span>
                </motion.div>
                <motion.div
                  {...rise(0.75)}
                  className="flex flex-1 flex-col gap-3 rounded-2xl bg-neutral-950 p-4 text-white"
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium">
                    <Server className="size-4 text-white/70" />
                    Runs on your infrastructure
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
          <motion.div
            {...rise(0.8)}
            className="absolute inset-x-0 top-[590px] flex flex-col items-center"
          >
            <span className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-neutral-500">
              <span className="size-0 border-t-[7px] border-l-[7px] border-t-sky-500 border-l-transparent" />
              HOW IT FITS TOGETHER
            </span>
            <span className="mt-4 text-[60px] leading-none font-medium tracking-[-0.045em]">
              One request, four products.
            </span>
          </motion.div>
        </>
      )}
    </div>
  );
}

/**
 * Hero: rantai.dev as AI built it, live code rather than screenshots. The
 * frame pins near the top and scrolling sweeps it into the polished site.
 * The sweep runs over the spacer below it: from the moment the whole frame
 * is in view until the pin lets go.
 */
export function RantaiLive({
  copy,
}: {
  copy: PortfolioCopy["hero"]["visual"];
}) {
  const reduce = Boolean(useReducedMotion());
  const spacer = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [play, setPlay] = useState(false);
  const [polished, setPolished] = useState(false);
  const [page, setPage] = useState(0);
  const url = ["rantai.dev", "rantai.dev/products"][page];
  const { scrollYProgress } = useScroll({
    target: spacer,
    offset: ["start end", "end end"],
  });
  // Copied into a plain motion value: sticky-safe, and reduced motion pins it.
  const x = useMotionValue(0);
  // Desktop lift: the frame rises while the sweep plays, then settles back.
  const lift = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    // Lift over the first 22%, sweep from 25% to 78%, settle over the last 20%.
    x.set(Math.min(1, Math.max(0, (p - 0.25) / 0.53)) * 100);
    const k = Math.min(1, Math.max(0, Math.min(p / 0.22, (1 - p) / 0.2)));
    lift.set(k * k * (3 - 2 * k));
  });
  useMotionValueEvent(x, "change", (v) => {
    if (v > 0) setPlay(true);
    setPolished(v >= 50);
  });
  useEffect(() => {
    if (reduce) x.set(100);
  }, [reduce, x]);
  const clipPath = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(x, (v) => `${v}%`);
  const lineOpacity = useTransform(x, (v) => (v > 0 && v < 100 ? 1 : 0));

  useEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Breakout wrapper: the frame's own transform is taken by its entrance.
  return (
    <div className="w-full lg:ml-[50%] lg:w-[min(56rem,calc(100vw-8rem))] lg:-translate-x-1/2">
      {/* Pinned about mid-screen (frame is ~18rem tall on phones, ~38rem on
          desktop) while the spacer scrolls past. */}
      <div className="sticky top-[calc(50svh-10.5rem)] z-10 md:top-[max(1.5rem,calc(50svh-20.5rem))]">
        <motion.div
          className={`relative ${reduce ? "" : "md:origin-top md:scale-[calc(0.86+0.14*var(--k))]"}`}
          style={{ "--k": lift } as React.CSSProperties}
        >
          {/* Shadow wraps the frame only, not the tabs below it. */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl opacity-(--k) shadow-[0_48px_120px_-32px_rgb(0_0_0/0.6)] max-md:hidden"
            />
            <figure className="hero-live border-border/80 bg-muted/50 w-full overflow-hidden rounded-xl border shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)]">
              <div className="flex h-10 items-center gap-3 px-3">
                <span className="flex gap-1.5 max-sm:hidden" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="bg-foreground/15 size-2.5 rounded-full"
                    />
                  ))}
                </span>
                <a
                  href={`https://www.${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background text-muted-foreground hover:text-foreground rounded-md px-2.5 py-0.5 text-[11px] transition-colors"
                >
                  {url}
                </a>
                {/* Says which version is on screen; flips halfway through the sweep. */}
                {/* Both labels share one cell, so the swap never shifts the bar. */}
                <span
                  aria-hidden
                  className="ml-auto grid px-2.5 py-1 text-[11px] font-medium whitespace-nowrap"
                >
                  {[copy.before, copy.after].map((label, i) => {
                    const on = polished === (i === 1);
                    return (
                      <motion.span
                        key={label}
                        className={`col-start-1 row-start-1 text-right ${i ? "text-foreground" : "text-muted-foreground"}`}
                        initial={false}
                        animate={
                          on
                            ? { opacity: 1, y: "0em", filter: "blur(0px)" }
                            : {
                                opacity: 0,
                                y: i === 1 ? "0.6em" : "-0.6em",
                                filter: "blur(4px)",
                              }
                        }
                        transition={{ duration: 0.45, ease }}
                      >
                        {label}
                      </motion.span>
                    );
                  })}
                </span>
                <a
                  href={`https://www.${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-full py-1 pr-1 text-[11px] font-medium underline-offset-2 transition-colors hover:underline"
                >
                  <span className="max-sm:sr-only">{copy.visit}</span>
                  <ArrowUpRight aria-hidden className="size-3" />
                </a>
              </div>
              <div
                ref={box}
                aria-hidden
                className={`relative aspect-[8/5] w-full overflow-hidden ${polished ? "bg-white" : "bg-[#0a0b10]"}`}
              >
                <div
                  className="absolute top-0 left-0 origin-top-left"
                  style={{
                    width: W,
                    height: H,
                    transform: `scale(${scale})`,
                    visibility: scale ? "visible" : "hidden",
                  }}
                >
                  {page ? <OldProducts /> : <OldSite />}
                  <motion.div className="absolute inset-0" style={{ clipPath }}>
                    {page ? (
                      <NewProducts play={play} />
                    ) : (
                      <NewSite play={play} />
                    )}
                  </motion.div>
                </div>
                <motion.span
                  className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_16px_2px_rgb(255_255_255/0.7)]"
                  style={{ left, opacity: lineOpacity }}
                />
              </div>
              <figcaption className="sr-only">{copy.label}</figcaption>
            </figure>
          </div>
          <div
            role="group"
            aria-label={copy.label}
            className="mt-3 flex justify-center gap-2"
          >
            {copy.pages.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={page === i}
                onClick={() => setPage(i)}
                className={`h-8 rounded-full border px-3.5 text-xs transition-colors duration-200 ${page === i ? "bg-foreground text-background border-foreground" : "bg-background border-border text-foreground/70 hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
            <Link
              href={copy.caseStudyHref}
              className="text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-1 px-2 text-xs font-medium transition-colors"
            >
              {copy.caseStudy}
              <ArrowRight aria-hidden className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>
      {!reduce && <div ref={spacer} aria-hidden className="h-[170svh]" />}
    </div>
  );
}
