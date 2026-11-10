"use client";

import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { useEffect, useRef, useState } from "react";
import { AtSign, Check, Copy, Mail } from "lucide-react";
import { Sheet, sheetRow } from "@/components/ui/sheet";
import {
  GithubSvg,
  InstagramSvg,
  LinkedinSvg,
  XSvg,
} from "@/components/shared/dock-icons";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EMAIL = "mtharreq@gmail.com";

const SOCIALS = [
  {
    label: "X",
    handle: "@tooreeq",
    href: "https://x.com/tooreeq",
    Icon: XSvg,
  },
  {
    label: "GitHub",
    handle: "mtharreqq",
    href: "https://github.com/mtharreqq",
    Icon: GithubSvg,
  },
  {
    label: "LinkedIn",
    handle: "mtharreq",
    href: "https://linkedin.com/in/mtharreq/",
    Icon: LinkedinSvg,
  },
  {
    label: "Instagram",
    handle: "@tooreeq",
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

/** Phones: the same ways in as one button, listed in a bottom sheet with
 * their names and handles, so the toolbar keeps to a single control. */
function ContactSheet({ copy }: { copy: PortfolioCopy["contact"] }) {
  const [open, setOpen] = useState(false);
  const { copied, copyError, handleCopy } = useCopyEmail();
  const icon = "text-muted-foreground size-[18px] shrink-0";
  const handle = "text-muted-foreground ml-auto truncate text-[13px]";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="composer-tool text-muted-foreground relative flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm transition-colors before:absolute before:-inset-1 before:rounded-full md:hidden"
      >
        <AtSign aria-hidden className="size-4" />
        {copy.more}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title={copy.more}>
        <div className="flex flex-col">
          <button type="button" onClick={handleCopy} className={sheetRow}>
            {copied ? (
              <Check aria-hidden className={icon} />
            ) : (
              <Copy aria-hidden className={icon} />
            )}
            {copied ? copy.copied : copy.copy}
            <span className={handle}>{EMAIL}</span>
          </button>
          {copyError && (
            <p role="status" className="text-destructive px-3 pb-1 text-xs">
              {copy.copyFailed}
            </p>
          )}
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(copy.subject)}`}
            onClick={() => setOpen(false)}
            className={sheetRow}
          >
            <Mail aria-hidden className={icon} />
            {copy.send}
          </a>
          <span aria-hidden className="bg-border mx-3 my-2 block h-px" />
          {SOCIALS.map(({ label, handle: h, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={sheetRow}
            >
              <Icon className={icon} />
              {label}
              <span className={handle}>{h}</span>
            </a>
          ))}
        </div>
      </Sheet>
    </>
  );
}

/** Email and socials as small icons, for the story's composer toolbar. */
export function ContactIcons({ copy }: { copy: PortfolioCopy["contact"] }) {
  const { copied, copyError, handleCopy } = useCopyEmail();
  const icon =
    "composer-tool grid size-[30px] cursor-pointer place-items-center rounded-full transition-colors bar:relative bar:size-9 bar:before:absolute bar:before:-inset-1 bar:before:rounded-full";
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
      <ContactSheet copy={copy} />
      {/* On touch, room for each icon's 44px halo without stealing its
          neighbour's taps. */}
      <div className="bar:gap-2 flex items-center max-md:hidden">
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

/** "© 2026 Requixite • v0.9.0", the site's fine print, in the avatar's
 * menu. */
export function SiteMeta({ className }: { className?: string }) {
  return (
    <p className={className}>
      © {new Date().getFullYear()} Requixite • v
      {process.env.NEXT_PUBLIC_VERSION}
    </p>
  );
}
