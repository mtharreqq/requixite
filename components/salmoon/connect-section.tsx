"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { GithubSvg, InstagramSvg, LinkedinSvg, XSvg } from "@/components/dock-icons";

const EMAIL = "mtharreq@gmail.com";

const SOCIALS = [
  { label: "X", href: "https://x.com/tooreeq", Icon: XSvg },
  { label: "GitHub", href: "https://github.com/mtharreqq", Icon: GithubSvg },
  { label: "LinkedIn", href: "https://linkedin.com/in/mtharreq/", Icon: LinkedinSvg },
  { label: "Instagram", href: "https://instagram.com/tooreeq", Icon: InstagramSvg },
];

export function ConnectSection() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section id="contact" className="w-full space-y-6 pb-12">
      {/* Contact Card */}
      <div className="bg-card rounded-[18px] border border-border/80 p-5 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.22)] dark:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.6)]">
        <div className="flex items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border/80 bg-muted">
            <Image src="/avatar.png" alt="Tharreq" width={44} height={44} className="size-full object-cover" />
          </div>
          <div className="space-y-0.5">
            <p className="text-foreground text-[15px] leading-tight font-semibold">Tharreq</p>
            <p className="text-muted-foreground text-[13px] leading-tight">Available for new projects</p>
          </div>
        </div>

        <p className="text-foreground my-5 text-[17px] leading-relaxed tracking-[-0.01em]">
          Got an app or prototype that needs a human touch? Send it over. I&apos;ll tell you honestly what I&apos;d fix first.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="bg-foreground text-background inline-flex h-[38px] min-w-[116px] cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-opacity hover:opacity-85 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Copied
              </>
            ) : (
              "Copy email"
            )}
          </button>
          <a
            href={`mailto:${EMAIL}?subject=Project%20Inquiry%20%E2%80%94%20Requixite`}
            className="bg-card text-foreground hover:bg-muted inline-flex h-[38px] items-center rounded-full border border-border/80 px-4 text-[13px] font-medium transition-colors"
          >
            Send email
          </a>

          <div className="ml-auto flex gap-1.5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-muted-foreground hover:text-foreground hover:bg-muted grid size-[38px] place-items-center rounded-full border border-border/80 transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
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
