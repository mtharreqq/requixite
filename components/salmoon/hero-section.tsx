"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section id="home" className="w-full space-y-8 pt-4">
      {/* Title & Identity */}
      <div className="space-y-1">
        <div className="flex items-center gap-x-2">
          <h1 className="text-base leading-none font-semibold md:text-lg text-foreground">
            Tharreq
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#1db7f9"
            stroke="hsl(var(--background))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <p className="text-muted-foreground text-xs leading-none font-medium md:text-sm font-mono">
          Product Engineer &amp; Designer &bull; Requixite
        </p>
      </div>

      {/* Bio Paragraphs */}
      <div className="text-muted-foreground flex flex-col gap-y-4 text-sm md:text-base leading-relaxed font-sans">
        <p>
          I&apos;m a product engineer and designer based in{" "}
          <span className="text-foreground font-medium">Bandung, Indonesia</span>. A sucker for meticulous craft and sub-pixel perfection.
        </p>
        <p>
          In an era where AI can scaffold an entire CRUD app in minutes, I obsess over the 1% that AI routinely overlooks: the harmonic spatial rhythm, concentric squircle radii, tactile micro-physics, and the intentional ergonomics that make software feel human, trustworthy, and joyful.
        </p>
      </div>

      {/* Tilted Polaroid Stack */}
      <div className="relative w-full max-w-full pt-2">
        <div className="mx-auto flex w-fit flex-row items-center gap-2 -space-x-4 px-4 sm:gap-4 sm:-space-x-6">
          {/* Card 1: Cashava */}
          <motion.div
            whileHover={{ y: -6, rotate: -2, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="shrink-0 overflow-hidden rounded-[2px] shadow-md border border-border/70"
            style={{ transform: "rotate(-6deg)" }}
          >
            <div className="bg-card text-card-foreground flex h-fit flex-col items-center p-1.5 w-[27vw] sm:w-32">
              <div className="aspect-square h-auto w-full rounded-[1px] bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex flex-col items-center justify-center p-2 text-center border border-emerald-500/20">
                <span className="text-xl sm:text-2xl mb-1">🌱</span>
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  Cashava
                </span>
                <span className="text-[9px] font-mono text-muted-foreground hidden sm:block">
                  fin-copilot
                </span>
              </div>
              <span className="text-xs sm:text-sm font-mono text-muted-foreground mt-1.5 tracking-tight">
                finance :3
              </span>
            </div>
          </motion.div>

          {/* Card 2: Token Tea */}
          <motion.div
            whileHover={{ y: -6, rotate: 0, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="shrink-0 overflow-hidden rounded-[2px] shadow-md border border-border/70 z-1"
            style={{ transform: "rotate(6deg)" }}
          >
            <div className="bg-card text-card-foreground flex h-fit flex-col items-center p-1.5 w-[27vw] sm:w-32">
              <div className="aspect-square h-auto w-full rounded-[1px] bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex flex-col items-center justify-center p-2 text-center border border-blue-500/20">
                <span className="text-xl sm:text-2xl mb-1">🍵</span>
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  Token Tea
                </span>
                <span className="text-[9px] font-mono text-muted-foreground hidden sm:block">
                  macOS HUD
                </span>
              </div>
              <span className="text-xs sm:text-sm font-mono text-muted-foreground mt-1.5 tracking-tight">
                mac app!!
              </span>
            </div>
          </motion.div>

          {/* Card 3: Ruruuharaa */}
          <motion.div
            whileHover={{ y: -6, rotate: 0, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="shrink-0 overflow-hidden rounded-[2px] shadow-md border border-border/70"
            style={{ transform: "rotate(-3deg)" }}
          >
            <div className="bg-card text-card-foreground flex h-fit flex-col items-center p-1.5 w-[27vw] sm:w-32">
              <div className="aspect-square h-auto w-full rounded-[1px] bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex flex-col items-center justify-center p-2 text-center border border-amber-500/20">
                <span className="text-xl sm:text-2xl mb-1">🦌</span>
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                  Ruru
                </span>
                <span className="text-[9px] font-mono text-muted-foreground hidden sm:block">
                  canvas studio
                </span>
              </div>
              <span className="text-xs sm:text-sm font-mono text-muted-foreground mt-1.5 tracking-tight">
                beads ✨
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
