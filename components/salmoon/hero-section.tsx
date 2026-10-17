"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  GithubSvg,
  InstagramSvg,
  LinkedinSvg,
  TwitterVerifiedBadgeSvg,
  XSvg,
} from "@/components/dock-icons";

export function HeroSection() {
  return (
    <section id="home" className="w-full space-y-8 pt-4">
      {/* Title & Identity */}
      <div className="flex items-center gap-3">
        <div className="relative size-9 md:size-10 shrink-0 overflow-hidden rounded-full border border-border/80 shadow-xs bg-muted">
          <Image
            src="/avatar.png"
            alt="Tharreq"
            width={40}
            height={40}
            className="size-full object-cover"
            priority
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-x-1.5">
            <HoverCard openDelay={120} closeDelay={150}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer text-base leading-none font-semibold md:text-lg text-foreground hover:underline decoration-muted-foreground/40 underline-offset-4 transition-colors text-left"
                >
                  Tharreq
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                sideOffset={8}
                className="w-80 p-4 bg-popover/95 backdrop-blur-md border border-border/80 shadow-xl rounded-lg text-foreground"
              >
                <div className="flex items-start gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border/80 shadow-xs bg-muted">
                    <Image
                      src="/avatar.png"
                      alt="Tharreq"
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm leading-tight text-foreground truncate">
                        Tharreq
                      </span>
                      <TwitterVerifiedBadgeSvg className="size-4 shrink-0" />
                    </div>
                    <p className="text-muted-foreground text-xs font-mono truncate">
                      @tooreeq
                    </p>
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed font-sans">
                  Product engineer &amp; designer based in Bandung. Crafting software with sub-pixel polish at Requixite.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <span>📍 Bandung, ID</span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </span>
                </div>

                {/* Social links row */}
                <div className="mt-3.5 pt-3 border-t border-border/60 grid grid-cols-4 gap-1.5">
                  <a
                    href="https://instagram.com/tooreeq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-muted/60 hover:bg-[#E1306C]/10 hover:text-[#E1306C] text-muted-foreground border border-border/40 transition-colors group"
                    title="Instagram @tooreeq"
                  >
                    <InstagramSvg className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-medium">IG</span>
                  </a>
                  <a
                    href="https://x.com/tooreeq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-muted/60 hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] text-muted-foreground border border-border/40 transition-colors group"
                    title="Twitter / X @tooreeq"
                  >
                    <XSvg className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-medium">X</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/mtharreq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-muted/60 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] text-muted-foreground border border-border/40 transition-colors group"
                    title="LinkedIn @mtharreq"
                  >
                    <LinkedinSvg className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/mtharreqq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-muted/60 hover:bg-foreground hover:text-background text-muted-foreground border border-border/40 transition-colors group"
                    title="GitHub @mtharreqq"
                  >
                    <GithubSvg className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-medium">GitHub</span>
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
            <TwitterVerifiedBadgeSvg className="size-4 shrink-0" />
          </div>
          <p className="text-muted-foreground text-xs leading-none font-medium md:text-sm font-mono">
            Product Engineer &amp; Designer &bull; Requixite
          </p>
        </div>
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
