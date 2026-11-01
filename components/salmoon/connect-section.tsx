"use client";

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

export function ConnectSection() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function handleCopy() {
    navigator.clipboard.writeText(EMAIL);
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
              Available for new projects
            </p>
          </div>
        </div>

        <p className="text-foreground my-5 text-[17px] leading-relaxed tracking-[-0.01em]">
          Got an app or prototype that needs a human touch? Send it over.
          I&apos;ll tell you honestly what I&apos;d fix first.
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
                  initial={{ opacity: 0, transform: "scale(0.9)", filter: "blur(2px)" }}
                  animate={{ opacity: 1, transform: "scale(1)", filter: "blur(0px)" }}
                  exit={{ opacity: 0, transform: "scale(0.9)", filter: "blur(2px)" }}
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" />
                      Copied
                    </>
                  ) : (
                    "Copy email"
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={`mailto:${EMAIL}?subject=Project%20Inquiry%20%E2%80%94%20Requixite`}
              className="tactile-control bg-card text-foreground hover:bg-muted border-border/80 inline-flex h-[38px] items-center rounded-full border px-4 text-[13px] font-medium transition-colors active:scale-[0.98]"
            >
              Send email
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
                    className="motion-reduce:animate-none! data-[state=instant-open]:animate-none!"
                  >
                    {label}
                  </TooltipContent>
                </TooltipPrimitive.Root>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Footer */}
      <p className="text-muted-foreground text-center text-xs leading-[1.8]">
        Precise. Exquisite. Requisite.
        <br />
        {`© ${new Date().getFullYear()} Requixite • Made in Bandung`}
      </p>
    </section>
  );
}
