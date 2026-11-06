"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";

const SCREENS = [
  { src: "/work/rantai/home.jpg", href: "https://www.rantai.dev" },
  { src: "/work/rantai/products.jpg", href: "https://www.rantai.dev/products" },
  { src: "/work/rantai/blog.jpg", href: "https://www.rantai.dev/blog" },
];

export function ProjectShowcase({ copy }: { copy: PortfolioCopy["hero"] }) {
  const [screen, setScreen] = useState(0);
  const reduce = useReducedMotion();
  const panelId = useId();
  const tiltX = useSpring(0, { stiffness: 220, damping: 22 });
  const tiltY = useSpring(0, { stiffness: 220, damping: 22 });
  const transform = useMotionTemplate`perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  function resetTilt() {
    tiltX.set(0);
    tiltY.set(0);
  }
  return (
    <div className="hero-showcase w-full min-w-0 pt-2">
      <div className="showcase-stage relative isolate pt-6 pb-3 sm:pt-8">
        <div
          aria-hidden="true"
          className="showcase-ghost showcase-ghost-left border-border bg-card pointer-events-none absolute top-2 left-1 -z-10 aspect-[16/10] w-[68%] overflow-hidden rounded-lg border opacity-55 shadow-lg"
        >
          <Image
            src={SCREENS[1].src}
            alt=""
            fill
            sizes="(min-width: 768px) 360px, 60vw"
            className="object-cover object-top"
          />
        </div>
        <div
          aria-hidden="true"
          className="showcase-ghost showcase-ghost-right border-border bg-card pointer-events-none absolute top-2 right-1 -z-10 aspect-[16/10] w-[68%] overflow-hidden rounded-lg border opacity-55 shadow-lg"
        >
          <Image
            src={SCREENS[2].src}
            alt=""
            fill
            sizes="(min-width: 768px) 360px, 60vw"
            className="object-cover object-top"
          />
        </div>
        <motion.div
          style={{ transform }}
          onPointerMove={(event) => {
            if (
              reduce !== false ||
              event.pointerType !== "mouse" ||
              !window.matchMedia("(hover: hover) and (pointer: fine)").matches
            )
              return;
            const bounds = event.currentTarget.getBoundingClientRect();
            tiltX.set(
              -((event.clientY - bounds.top) / bounds.height - 0.5) * 5,
            );
            tiltY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 5);
          }}
          onPointerLeave={resetTilt}
          onPointerCancel={resetTilt}
          onBlur={resetTilt}
          className="showcase-frame border-border bg-muted relative mx-auto w-[92%] overflow-hidden rounded-xl border p-1.5 shadow-[0_20px_50px_-24px_rgb(0_0_0/0.5)] sm:p-2"
        >
          <div className="bg-card border-border/70 overflow-hidden rounded-lg border">
            <div className="border-border/60 flex h-9 items-center gap-3 border-b px-3">
              <div aria-hidden="true" className="flex shrink-0 gap-1">
                <span className="bg-muted-foreground/25 size-1.5 rounded-full" />
                <span className="bg-muted-foreground/25 size-1.5 rounded-full" />
                <span className="bg-muted-foreground/25 size-1.5 rounded-full" />
              </div>
              <span className="text-muted-foreground flex-1 truncate text-center font-sans text-[10px]">
                {SCREENS[screen].href.replace("https://www.", "")}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="text-muted-foreground size-3"
              />
            </div>
            <a
              id={panelId}
              href={SCREENS[screen].href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.view}: ${copy.polaroids[screen]}`}
              className="group/screen bg-muted relative block aspect-[16/10] overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={screen}
                  className="absolute inset-0"
                  initial={{
                    opacity: 0,
                    transform: reduce ? "none" : "translateY(6px) scale(1.015)",
                  }}
                  animate={{ opacity: 1, transform: "translateY(0) scale(1)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Image
                    src={SCREENS[screen].src}
                    alt={`${copy.preview}: ${copy.polaroids[screen]}`}
                    fill
                    sizes="(min-width: 768px) 544px, 90vw"
                    priority={screen === 0}
                    className="object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
              <span className="bg-background/95 text-foreground border-border/80 absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] shadow-sm">
                {copy.view}
                <ArrowUpRight className="size-3" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>
      <div
        role="group"
        aria-label={copy.screens}
        className="mt-3 flex flex-wrap justify-center gap-1"
      >
        {SCREENS.map((item, index) => (
          <button
            key={item.src}
            type="button"
            aria-pressed={screen === index}
            aria-controls={panelId}
            onClick={() => setScreen(index)}
            className={`tactile-control rounded-full px-3 py-2 text-[11px] transition-colors duration-150 ${screen === index ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            {copy.polaroids[index]}
          </button>
        ))}
      </div>
    </div>
  );
}
