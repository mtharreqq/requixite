"use client";

import Image from "next/image";
import {
  motion,
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
  Github,
  Instagram,
  Linkedin,
  Send,
  Square,
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

/** The AI-built site, rebuilt from public/work/rantai/before.jpg. */
function OldSite() {
  return (
    <div className="absolute inset-0 bg-[#0a0b10] text-white">
      <span className="absolute -top-6 -left-6 size-12 rounded-full border border-sky-400/70" />
      <div className="absolute top-[26px] left-[22px] flex items-center gap-1.5 text-[17px] font-bold tracking-tight text-sky-400">
        <span className="grid size-5 place-items-center rounded-[5px] border-2 border-sky-400 text-[10px] leading-none">
          R
        </span>
        RantAI
      </div>
      <nav className="absolute top-[22px] right-[22px] flex items-center gap-11 text-[13px] font-semibold">
        <span>Home</span>
        <span>Academy</span>
        <span>Services</span>
        <span>Platforms</span>
        <span className="flex items-center gap-7">
          <span className="h-8 w-px bg-white/15" />
          <Square className="size-3" strokeWidth={2.5} />
        </span>
      </nav>
      <p className="absolute top-[222px] left-4 text-[80px] leading-[1.4] font-black tracking-[0.04em] uppercase">
        AI Coders
        <br />
        <span className="pl-20">And Optimizers</span>
      </p>
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
        <ArrowRight className="size-4" />
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
          2
        </span>
        <span className="pb-1 text-[13px] text-white/60">/</span>
        <span className="text-[44px] font-bold">3</span>
      </p>
    </div>
  );
}

/** The polished site: RantAI's home-hero, copied from rant-ai-landing-page. */
function NewSite({ play }: { play: boolean }) {
  return (
    <div className="absolute inset-0 bg-white text-neutral-900">
      <nav className="flex h-[48px] items-center px-7">
        <span className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <Image src={`${live}/rant-ai.png`} alt="" width={24} height={24} />
          RantAI
        </span>
        <span className="ml-14 flex gap-7 text-[13px] text-neutral-600">
          <span>Products</span>
          <span>Services</span>
          <span>Academy</span>
          <span>Insights</span>
          <span>Company</span>
        </span>
        <span className="ml-auto flex rounded-full bg-neutral-100 p-0.5 text-[11px] font-medium">
          <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">
            EN
          </span>
          <span className="px-2.5 py-1 text-neutral-400">ID</span>
        </span>
        <span className="ml-2 flex h-9 items-center gap-2 rounded-full bg-black px-4 text-[13px] font-medium text-white">
          Contact us
          <ArrowUpRight className="size-3.5" />
        </span>
      </nav>
      <div className="dark absolute inset-x-[13px] top-[48px] bottom-1 isolate flex flex-col items-center justify-end overflow-hidden rounded-[28px] bg-black pb-6 text-center text-white">
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
  const { scrollYProgress } = useScroll({
    target: spacer,
    offset: ["start end", "end end"],
  });
  // Copied into a plain motion value: sticky-safe, and reduced motion pins it.
  const x = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    // Hold the old site a moment, finish before the pin lets go.
    x.set(Math.min(1, Math.max(0, (p - 0.1) / 0.75)) * 100);
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
      <div className="sticky top-[calc(50svh-9rem)] z-10 md:top-[max(1.5rem,calc(50svh-19rem))]">
        <figure className="hero-live border-border/80 bg-muted/50 w-full overflow-hidden rounded-xl border shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)]">
          <div className="border-border/80 flex h-10 items-center gap-3 border-b px-3">
            <span className="flex gap-1.5 max-sm:hidden" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="bg-foreground/15 size-2.5 rounded-full"
                />
              ))}
            </span>
            <a
              href="https://www.rantai.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background text-muted-foreground hover:text-foreground rounded-md px-2.5 py-0.5 text-[11px] transition-colors"
            >
              rantai.dev
            </a>
            {/* Says which version is on screen; flips halfway through the sweep. */}
            <span
              aria-hidden
              className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${polished ? "text-foreground" : "text-muted-foreground"}`}
            >
              {polished ? copy.after : copy.before}
            </span>
            <a
              href="https://www.rantai.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background hover:bg-foreground/85 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
            >
              {copy.visit}
              <ArrowUpRight aria-hidden className="size-3" />
            </a>
          </div>
          <div
            ref={box}
            aria-hidden
            className="relative aspect-[8/5] w-full overflow-hidden bg-[#0a0b10]"
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
              <OldSite />
              <motion.div className="absolute inset-0" style={{ clipPath }}>
                <NewSite play={play} />
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
      {!reduce && <div ref={spacer} aria-hidden className="h-[110svh]" />}
    </div>
  );
}
