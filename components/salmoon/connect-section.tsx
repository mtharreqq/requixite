"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import {
  GithubSvg,
  InstagramSvg,
  LinkedinSvg,
  XSvg,
} from "@/components/dock-icons";
import { FooterWordmark } from "@/components/salmoon/footer-wordmark";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EMAIL = "mtharreq@gmail.com";
const REPO = "https://github.com/mtharreqq/requixite";
const updated = process.env.NEXT_PUBLIC_UPDATED_AT;

const SOCIALS = [
  { label: "X", href: "https://x.com/tooreeq", Icon: XSvg },
  { label: "GitHub", href: "https://github.com/mtharreqq", Icon: GithubSvg },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mtharreq/",
    Icon: LinkedinSvg,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/tooreeq",
    Icon: InstagramSvg,
  },
];

function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const [copyError, setCopyError] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      setCopyError(true);
      return;
    }
    setCopyError(false);
    setCopied(true);
    // Repeated clicks restart the 2.5s window instead of stacking timers.
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  }
  return { copied, copyError, handleCopy };
}

/** Email and socials as small icons, for the story's composer toolbar. */
export function ContactIcons({ copy }: { copy: PortfolioCopy["contact"] }) {
  const { copied, copyError, handleCopy } = useCopyEmail();
  const icon =
    "composer-tool grid size-[30px] cursor-pointer place-items-center rounded-full transition-colors";
  const items = [
    {
      label: copied ? copy.copied : copy.copy,
      el: (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copy.copy}
          className={icon}
        >
          {copied ? <Check /> : <Copy />}
        </button>
      ),
    },
    {
      label: copy.send,
      el: (
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent(copy.subject)}`}
          aria-label={copy.send}
          className={icon}
        >
          <Mail />
        </a>
      ),
    },
    ...SOCIALS.map(({ label, href, Icon }) => ({
      label,
      el: (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={icon}
        >
          <Icon className="size-[14px]" />
        </a>
      ),
    })),
  ];
  return (
    <TooltipProvider delayDuration={250} skipDelayDuration={300}>
      <div className="flex items-center">
        {items.map(({ label, el }, i) => (
          <TooltipPrimitive.Root key={i}>
            <TooltipTrigger asChild>{el}</TooltipTrigger>
            <TooltipContent
              sideOffset={8}
              className="data-[state=instant-open]:animate-none! motion-reduce:animate-none!"
            >
              {label}
            </TooltipContent>
          </TooltipPrimitive.Root>
        ))}
      </div>
      <p
        role="status"
        className={copyError ? "text-destructive text-xs" : "sr-only"}
      >
        {copyError ? copy.copyFailed : copied ? copy.copied : ""}
      </p>
    </TooltipProvider>
  );
}

/** The footer, for the pages without the story. */
export function ConnectSection({ copy }: { copy: PortfolioCopy["contact"] }) {
  return (
    <section className="w-full">
      {/* One row: brand left, version right. The name opens its meaning. */}
      <footer className="text-muted-foreground text-[11px] leading-relaxed">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <HoverCard openDelay={120} closeDelay={150}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  aria-label={copy.aboutName}
                  className="hover:text-foreground decoration-muted-foreground/40 cursor-pointer underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Requixite
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                sideOffset={8}
                className="bg-popover/95 border-border/80 text-muted-foreground w-72 rounded-lg p-4 text-xs leading-relaxed shadow-xl backdrop-blur-md"
              >
                <p className="text-foreground mb-1 font-medium">
                  Precise. Exquisite. Requisite.
                </p>
                {copy.nameMeaning}
              </HoverCardContent>
            </HoverCard>
            {` • ${copy.made}`}
          </p>
          {/* Version and last deploy, so it's clear the site is still kept up. */}
          <p>
            <a
              href={`${REPO}/commits/main`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              v{process.env.NEXT_PUBLIC_VERSION}
              {updated &&
                ` • ${copy.updated} ${new Intl.DateTimeFormat(copy.dateLocale, { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(updated))}`}
            </a>
            {" • "}
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {copy.source}
            </a>
          </p>
        </div>
        <div className="relative mt-6 overflow-hidden">
          <FooterWordmark
            text="Requixite"
            className="mb-[-0.2em] text-[clamp(3.5rem,15vw,7.5rem)] leading-[0.85] font-semibold tracking-[-0.06em]"
          />
        </div>
      </footer>
    </section>
  );
}
