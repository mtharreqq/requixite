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

const POLAROIDS = [
  {
    src: "/work/rantai/home.jpg",
    href: "https://www.rantai.dev",
    label: "rantai.dev",
    rotate: -6,
    hoverRotate: -2,
    position: "50% 45%",
  },
  {
    src: "/work/rantai/products.jpg",
    href: "https://www.rantai.dev/products",
    label: "products",
    rotate: 6,
    hoverRotate: 0,
    position: "85% 40%",
  },
  {
    src: "/work/rantai/blog.jpg",
    href: "https://www.rantai.dev/blog",
    label: "insights ✨",
    rotate: -3,
    hoverRotate: 0,
    position: "75% 40%",
  },
];

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
                    <p className="text-muted-foreground text-xs truncate">
                      @tooreeq
                    </p>
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed font-sans">
                  Product engineer &amp; designer based in Bandung. Frontend at Telkomsigma, building rantai.dev on the side.
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground">
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
                    <span className="text-[10px] font-medium">IG</span>
                  </a>
                  <a
                    href="https://x.com/tooreeq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-muted/60 hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] text-muted-foreground border border-border/40 transition-colors group"
                    title="Twitter / X @tooreeq"
                  >
                    <XSvg className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium">X</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/mtharreq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-muted/60 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] text-muted-foreground border border-border/40 transition-colors group"
                    title="LinkedIn @mtharreq"
                  >
                    <LinkedinSvg className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/mtharreqq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-muted/60 hover:bg-foreground hover:text-background text-muted-foreground border border-border/40 transition-colors group"
                    title="GitHub @mtharreqq"
                  >
                    <GithubSvg className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium">GitHub</span>
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
            <TwitterVerifiedBadgeSvg className="size-4 shrink-0" />
          </div>
          <p className="text-muted-foreground text-xs leading-none font-medium md:text-sm">
            Product Engineer &amp; Designer &bull; Requixite
          </p>
        </div>
      </div>

      {/* Bio Paragraphs */}
      <div className="text-muted-foreground flex flex-col gap-y-4 text-sm md:text-base leading-relaxed font-sans">
        <p>
          I&apos;m a product engineer and designer based in{" "}
          <span className="text-foreground font-medium">Bandung, Indonesia</span>. I work where design meets code: I take an idea from Figma to production and care about every pixel along the way.
        </p>
        <p>
          By day I build internal enterprise apps as a frontend developer at{" "}
          <span className="text-foreground font-medium">Telkomsigma</span>. On the side I design and ship the website for{" "}
          <a
            href="https://www.rantai.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            RantAI
          </a>
          , an AI company.
        </p>
        <p>
          AI can scaffold an app in minutes. I focus on what it usually misses: consistent spacing, clear hierarchy, considered motion, and the small details that make software feel finished and trustworthy.
        </p>
      </div>

      {/* Tilted Polaroid Stack */}
      <div className="relative w-full max-w-full pt-2">
        <div className="mx-auto flex w-fit flex-row items-center gap-2 -space-x-4 px-4 sm:gap-4 sm:-space-x-6">
          {POLAROIDS.map((card, i) => (
            <motion.a
              key={card.src}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6, rotate: card.hoverRotate, zIndex: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`shrink-0 overflow-hidden rounded-[2px] shadow-md border border-border/70 ${i === 1 ? "z-1" : ""}`}
              style={{ transform: `rotate(${card.rotate}deg)` }}
              aria-label={`RantAI ${card.label}`}
            >
              <div className="bg-card text-card-foreground flex h-fit flex-col items-center p-1.5 w-[27vw] sm:w-32">
                <div className="relative aspect-square h-auto w-full overflow-hidden rounded-[1px] border border-border/50 bg-muted">
                  <Image
                    src={card.src}
                    alt={`RantAI ${card.label} page`}
                    fill
                    sizes="128px"
                    className="object-cover"
                    style={{ objectPosition: card.position }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground mt-1.5 tracking-tight">
                  {card.label}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
