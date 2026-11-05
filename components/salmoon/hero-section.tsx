"use client";

import Image from "next/image";
import { PolaroidLink } from "@/components/salmoon/portfolio-motion";
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
    position: "50% 45%",
  },
  {
    src: "/work/rantai/products.jpg",
    href: "https://www.rantai.dev/products",
    label: "products",
    rotate: 6,
    position: "85% 40%",
  },
  {
    src: "/work/rantai/blog.jpg",
    href: "https://www.rantai.dev/blog",
    label: "insights ✨",
    rotate: -3,
    position: "75% 40%",
  },
];

export function HeroSection() {
  return (
    <section id="home" className="flex w-full flex-col gap-8 pt-4">
      {/* Title & Identity */}
      <div className="hero-identity flex items-center gap-3">
        <div className="border-border/80 bg-muted relative size-9 shrink-0 overflow-hidden rounded-full border shadow-xs md:size-10">
          <Image
            src="/avatar.png"
            alt="Tharreq"
            width={40}
            height={40}
            className="size-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-x-1.5">
            <HoverCard openDelay={120} closeDelay={150}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  className="text-foreground decoration-muted-foreground/40 cursor-pointer text-left text-base leading-none font-semibold underline-offset-4 transition-colors hover:underline md:text-lg"
                >
                  Tharreq
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                sideOffset={8}
                className="bg-popover/95 border-border/80 text-foreground w-80 rounded-lg border p-4 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <div className="border-border/80 bg-muted relative size-10 shrink-0 overflow-hidden rounded-full border shadow-xs">
                    <Image
                      src="/avatar.png"
                      alt="Tharreq"
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground truncate text-sm leading-tight font-semibold">
                        Tharreq
                      </span>
                      <TwitterVerifiedBadgeSvg className="size-4 shrink-0" />
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      @tooreeq
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-2.5 font-sans text-xs leading-relaxed">
                  Product engineer &amp; designer based in Bandung. Frontend at
                  Telkomsigma, building rantai.dev on the side.
                </p>

                <div className="text-muted-foreground mt-2.5 flex items-center gap-2 text-[11px]">
                  <span>📍 Bandung, ID</span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Available
                  </span>
                </div>

                {/* Social links row */}
                <div className="border-border/60 mt-3.5 grid grid-cols-4 gap-1.5 border-t pt-3">
                  <a
                    href="https://instagram.com/tooreeq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/60 text-muted-foreground border-border/40 group flex flex-col items-center justify-center gap-1 rounded-md border px-1 py-1.5 transition-colors hover:bg-[#E1306C]/10 hover:text-[#E1306C]"
                    title="Instagram @tooreeq"
                  >
                    <InstagramSvg className="size-4 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-medium">IG</span>
                  </a>
                  <a
                    href="https://x.com/tooreeq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/60 text-muted-foreground border-border/40 group flex flex-col items-center justify-center gap-1 rounded-md border px-1 py-1.5 transition-colors hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0]"
                    title="Twitter / X @tooreeq"
                  >
                    <XSvg className="size-4 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-medium">X</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/mtharreq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/60 text-muted-foreground border-border/40 group flex flex-col items-center justify-center gap-1 rounded-md border px-1 py-1.5 transition-colors hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
                    title="LinkedIn @mtharreq"
                  >
                    <LinkedinSvg className="size-4 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/mtharreqq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/60 hover:bg-foreground hover:text-background text-muted-foreground border-border/40 group flex flex-col items-center justify-center gap-1 rounded-md border px-1 py-1.5 transition-colors"
                    title="GitHub @mtharreqq"
                  >
                    <GithubSvg className="size-4 transition-transform group-hover:scale-110" />
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
      <div className="hero-copy text-muted-foreground flex flex-col gap-y-4 font-sans text-sm leading-relaxed md:text-base">
        <p>
          I&apos;m a product engineer and designer based in{" "}
          <span className="text-foreground font-medium">
            Bandung, Indonesia
          </span>
          . I work where design meets code: I take an idea from Figma to
          production and care about every pixel along the way.
        </p>
        <p>
          By day I build internal enterprise apps as a frontend developer at{" "}
          <span className="text-foreground font-medium">Telkomsigma</span>. On
          the side I design and ship the website for{" "}
          <a
            href="https://www.rantai.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground decoration-muted-foreground/40 hover:decoration-foreground font-medium underline underline-offset-4 transition-colors"
          >
            RantAI
          </a>
          , an AI company.
        </p>
        <p>
          AI can scaffold an app in minutes. I focus on what it usually misses:
          consistent spacing, clear hierarchy, considered motion, and the small
          details that make software feel finished and trustworthy.
        </p>
      </div>

      {/* Tilted Polaroid Stack */}
      <div className="hero-polaroids relative w-full max-w-full pt-2">
        <div className="mx-auto flex w-fit flex-row items-center gap-2 -space-x-4 px-4 sm:gap-4 sm:-space-x-6">
          {POLAROIDS.map((card, index) => (
            <PolaroidLink
              key={card.src}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`border-border/70 shrink-0 overflow-hidden rounded-[2px] border shadow-md ${index === 1 ? "z-1" : ""}`}
              rotation={card.rotate}
              aria-label={`RantAI ${card.label}`}
            >
              <div className="bg-card text-card-foreground flex h-fit w-[27vw] flex-col items-center p-1.5 sm:w-32">
                <div className="border-border/50 bg-muted relative aspect-square h-auto w-full overflow-hidden rounded-[1px] border">
                  <Image
                    src={card.src}
                    alt={`RantAI ${card.label} page`}
                    fill
                    sizes="(min-width: 640px) 128px, 27vw"
                    className="object-cover"
                    style={{ objectPosition: card.position }}
                  />
                </div>
                <span className="text-muted-foreground mt-1.5 text-xs tracking-tight sm:text-sm">
                  {card.label}
                </span>
              </div>
            </PolaroidLink>
          ))}
        </div>
      </div>
    </section>
  );
}
