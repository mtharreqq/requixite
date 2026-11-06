"use client";

import type { PortfolioCopy } from "@/lib/portfolio-copy";
import Image from "next/image";
import { ProjectShowcase } from "@/components/salmoon/project-showcase";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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

export function HeroSection({ copy }: { copy: PortfolioCopy["hero"] }) {
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
            priority
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
                  {copy.profile}
                </p>

                <div className="text-muted-foreground mt-2.5 flex items-center gap-2 text-[11px]">
                  <span>📍 Bandung, ID</span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    {copy.available}
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
            {copy.role}
          </p>
        </div>
      </div>

      <div className="hero-copy space-y-5">
        <h1
          aria-label={copy.headline.join(" ")}
          className="text-foreground text-[clamp(1.9rem,5.4vw,3rem)] leading-[1.12] font-medium tracking-[-0.055em]"
        >
          {copy.headline.map((line, index) => (
            <span key={line} aria-hidden="true" className="hero-line-mask">
              <span
                className={`hero-line ${index === 1 ? "text-muted-foreground" : ""}`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base">
          {copy.summary}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs">
          <a
            href="#work"
            className="text-foreground inline-flex items-center gap-1.5 rounded-sm font-medium underline-offset-4 hover:underline"
          >
            {copy.explore}
            <ArrowDownRight className="size-3.5" />
          </a>
          <a
            href="#contact"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-sm transition-colors"
          >
            {copy.contact}
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
      <ProjectShowcase copy={copy} />
    </section>
  );
}
