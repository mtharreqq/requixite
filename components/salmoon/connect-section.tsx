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
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EMAIL = "mtharreq@gmail.com";
const REPO = "https://github.com/mtharreqq/requixite";
const updated = process.env.NEXT_PUBLIC_UPDATED_AT;
/** Midnight of the date in Jakarta, so "3 days ago" counts calendar days. */
const jakartaDay = (d: Date) =>
  Date.parse(d.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }));

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
      if (navigator.clipboard) await navigator.clipboard.writeText(EMAIL);
      else {
        // Plain http (no secure context) has no Clipboard API.
        const t = document.createElement("textarea");
        t.value = EMAIL;
        t.style.cssText = "position:fixed;opacity:0";
        document.body.append(t);
        t.select();
        const ok = document.execCommand("copy");
        t.remove();
        if (!ok) throw new Error("copy");
      }
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

/** "© 2026 Requixite • v0.8.1": the name opens its meaning, the version
 * opens when the site was last updated and its source. */
export function FooterMeta({ copy }: { copy: PortfolioCopy["contact"] }) {
  const card =
    "bg-popover/95 border-border/80 text-muted-foreground rounded-lg p-4 text-xs leading-relaxed shadow-xl backdrop-blur-md";
  const trigger =
    "hover:text-foreground decoration-muted-foreground/40 cursor-pointer underline decoration-dotted underline-offset-4 transition-colors";
  return (
    <p className="text-muted-foreground text-xs">
      © {new Date().getFullYear()}{" "}
      <HoverCard openDelay={120} closeDelay={150}>
        <HoverCardTrigger asChild>
          <button type="button" aria-label={copy.aboutName} className={trigger}>
            Requixite
          </button>
        </HoverCardTrigger>
        <HoverCardContent side="top" sideOffset={8} className={`${card} w-72`}>
          <p className="text-foreground mb-1 font-medium">
            Precise. Exquisite. Requisite.
          </p>
          {copy.nameMeaning}
        </HoverCardContent>
      </HoverCard>
      {" • "}
      <HoverCard openDelay={120} closeDelay={150}>
        <HoverCardTrigger asChild>
          <button type="button" className={trigger}>
            v{process.env.NEXT_PUBLIC_VERSION}
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="end"
          sideOffset={8}
          className={`${card} flex w-auto items-center gap-3 py-2.5 pr-2.5`}
        >
          {/* Only mounts when open, so "now" is the reader's, not the build's. */}
          {updated && (
            <p>
              {copy.updated}{" "}
              <span className="text-foreground">
                {new Intl.RelativeTimeFormat(copy.dateLocale, {
                  numeric: "auto",
                }).format(
                  (jakartaDay(new Date(updated)) - jakartaDay(new Date())) /
                    86_400_000,
                  "day",
                )}
              </span>
            </p>
          )}
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.source}
            title={copy.source}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5 transition-colors"
          >
            <GithubSvg className="size-4" />
          </a>
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}
