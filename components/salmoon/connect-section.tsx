"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { GithubSvg, InstagramSvg, LinkedinSvg, XSvg } from "@/components/dock-icons";

export function ConnectSection() {
  const [copied, setCopied] = useState(false);
  const email = "mtharreq@gmail.com";

  function handleCopy() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section id="contact" className="w-full space-y-4 pb-20">
      {/* Header */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold uppercase tracking-wider font-mono">
              Let&apos;s Connect
            </h2>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-y-3 text-sm md:text-base leading-relaxed font-sans">
          <p>
            Have an app or prototype that needs human polish? I am currently available for freelance product design and frontend refinement.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for new projects</span>
          </div>
        </div>
      </div>

      {/* Button Grid matching Salmoon */}
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 pt-1">
        {/* Button 1: Copy Email */}
        <button
          onClick={handleCopy}
          className="group bg-muted text-muted-foreground flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] border border-border/60 transition-colors hover:bg-foreground hover:text-background font-mono text-xs font-medium"
          aria-label="Copy Email"
        >
          {copied ? (
            <>
              <Check className="size-4 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-4" />
              <span>Copy Email</span>
            </>
          )}
        </button>

        {/* Button 2: Mailto */}
        <a
          href={`mailto:${email}?subject=Project%20Inquiry%20%E2%80%94%20Requixite`}
          className="group bg-muted text-muted-foreground flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] border border-border/60 transition-colors hover:bg-foreground hover:text-background font-mono text-xs font-medium"
          aria-label="Send Mail"
        >
          <Mail className="size-4" />
          <span>Email</span>
        </a>

        {/* Button 3: Instagram */}
        <a
          href="https://instagram.com/tooreeq"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-muted text-muted-foreground flex h-12 w-full cursor-pointer items-center justify-center rounded-[2px] border border-border/60 transition-colors hover:bg-[#E1306C] hover:text-white"
          aria-label="Instagram"
        >
          <InstagramSvg className="size-5 transition-transform group-hover:scale-110" />
        </a>

        {/* Button 4: X */}
        <a
          href="https://x.com/tooreeq"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-muted text-muted-foreground flex h-12 w-full cursor-pointer items-center justify-center rounded-[2px] border border-border/60 transition-colors hover:bg-[#1DA1F2] hover:text-white"
          aria-label="Twitter / X"
        >
          <XSvg />
        </a>

        {/* Button 5: GitHub */}
        <a
          href="https://github.com/mtharreqq"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-muted text-muted-foreground flex h-12 w-full cursor-pointer items-center justify-center rounded-[2px] border border-border/60 transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          aria-label="GitHub"
        >
          <GithubSvg />
        </a>

        {/* Button 6: LinkedIn */}
        <a
          href="https://linkedin.com/in/mtharreq/"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-muted text-muted-foreground flex h-12 w-full cursor-pointer items-center justify-center rounded-[2px] border border-border/60 transition-colors hover:bg-[#0077B5] hover:text-white"
          aria-label="LinkedIn"
        >
          <LinkedinSvg />
        </a>
      </div>

      {/* Footer tagline */}
      <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Requixite &bull; Tharreq</span>
        <span className="italic">&ldquo;Precise. Exquisite. Requisite.&rdquo;</span>
      </div>
    </section>
  );
}
