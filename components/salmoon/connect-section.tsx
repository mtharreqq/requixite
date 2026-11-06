"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import {
  GithubSvg,
  InstagramSvg,
  LinkedinSvg,
  XSvg,
} from "@/components/dock-icons";
import { Magnetic } from "@/components/salmoon/portfolio-motion";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EMAIL = "mtharreq@gmail.com";
const EASE_OUT = [0.23, 1, 0.32, 1] as const; // matches --ease-out token

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

export function ConnectSection({ copy }: { copy: PortfolioCopy["contact"] }) {
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

  return (
    <section id="contact" className="w-full space-y-6 pb-12">
      {/* Contact Card */}
      <div className="bg-card border-border/80 rounded-[18px] border p-5 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.22)] dark:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.6)]">
        <div className="flex items-center gap-3">
          <div className="border-border/80 bg-muted relative size-11 shrink-0 overflow-hidden rounded-full border">
            <Image
              src="/avatar.png"
              alt="Tharreq"
              width={44}
              height={44}
              className="size-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-foreground text-[15px] leading-tight font-semibold">
              Tharreq
            </p>
            <p className="text-muted-foreground text-[13px] leading-tight">
              {copy.available}
            </p>
          </div>
        </div>

        <p className="text-foreground my-5 text-[17px] leading-relaxed tracking-[-0.01em]">
          {copy.invitation}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Magnetic>
            <button
              type="button"
              onClick={handleCopy}
              className="tactile-control bg-foreground text-background relative inline-flex h-[38px] min-w-[116px] cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-opacity hover:opacity-85 active:scale-[0.98]"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={copied ? "copied" : "idle"}
                  className="inline-flex items-center gap-1.5"
                  initial={{
                    opacity: 0,
                    transform: "scale(0.9)",
                    filter: "blur(2px)",
                  }}
                  animate={{
                    opacity: 1,
                    transform: "scale(1)",
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    transform: "scale(0.9)",
                    filter: "blur(2px)",
                  }}
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" />
                      {copy.copied}
                    </>
                  ) : (
                    copy.copy
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(copy.subject)}`}
              className="tactile-control bg-card text-foreground hover:bg-muted border-border/80 inline-flex h-[38px] items-center rounded-full border px-4 text-[13px] font-medium transition-colors active:scale-[0.98]"
            >
              {copy.send}
            </a>
          </Magnetic>

          {/* One provider for the group: after the first tooltip, the next
              ones open instantly (skip delay) and without the entrance. */}
          <TooltipProvider delayDuration={250} skipDelayDuration={300}>
            <div className="ml-auto flex gap-1.5">
              {SOCIALS.map(({ label, href, Icon }) => (
                <TooltipPrimitive.Root key={label}>
                  <TooltipTrigger asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="social-tactile text-muted-foreground hover:text-foreground hover:bg-muted border-border/80 grid size-[38px] place-items-center rounded-full border transition-colors"
                    >
                      <Icon className="size-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={8}
                    className="data-[state=instant-open]:animate-none! motion-reduce:animate-none!"
                  >
                    {label}
                  </TooltipContent>
                </TooltipPrimitive.Root>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      <p
        role="status"
        className={copyError ? "text-destructive text-xs" : "sr-only"}
      >
        {copyError ? copy.copyFailed : copied ? copy.copied : ""}
      </p>

      {/* Quiet, optional brand context; shared Accordion works on touch and keyboard. */}
      <footer className="text-muted-foreground text-center text-xs leading-[1.8]">
        <p>Precise. Exquisite. Requisite.</p>
        <Accordion type="single" collapsible className="mx-auto mt-1 max-w-xs">
          <AccordionItem value="brand">
            <AccordionTrigger variant="quiet">
              {copy.aboutName}
            </AccordionTrigger>
            <AccordionContent>
              <p className="px-3 pt-2 pb-3 text-xs leading-relaxed">
                {copy.nameMeaning}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="mt-2 text-[10px]">{`© ${new Date().getFullYear()} Requixite • ${copy.made}`}</p>
      </footer>
    </section>
  );
}
