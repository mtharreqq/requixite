"use client";

import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { Dialog } from "radix-ui";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import {
  TwitterVerifiedBadgeSvg,
  WhatsappSvg,
  XSvg,
} from "@/components/dock-icons";

const ease = [0.22, 1, 0.36, 1] as const;

function channels(message: string) {
  const text = encodeURIComponent(message);
  return [
    {
      label: "WhatsApp",
      handle: "+62 822-5640-3992",
      href: `https://wa.me/6282256403992?text=${text}`,
      Icon: WhatsappSvg,
    },
    {
      label: "Email",
      handle: "mtharreq@gmail.com",
      href: `mailto:mtharreq@gmail.com?subject=${text}`,
      Icon: Mail,
    },
    {
      label: "X",
      handle: "@tooreeq",
      href: "https://x.com/tooreeq",
      Icon: XSvg,
    },
  ];
}

function Avatar() {
  return (
    <span className="border-border/80 bg-muted relative block size-8 shrink-0 overflow-hidden rounded-full border">
      <Image
        src="/avatar.png"
        alt=""
        width={32}
        height={32}
        className="size-full object-cover"
      />
    </span>
  );
}

// Typing dots, then the messages: RantAI problem-picker.tsx.
function Thread({ copy }: { copy: PortfolioCopy["hero"]["chat"] }) {
  const reduce = useReducedMotion();
  const [typing, setTyping] = useState(!reduce);
  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), 700);
    return () => clearTimeout(t);
  }, [typing]);

  const rise = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease, delay: i * 0.25 },
  });

  if (typing)
    return (
      <div className="flex items-end gap-2">
        <Avatar />
        <span className="bg-muted inline-flex h-8 items-center gap-1 rounded-[18px] rounded-bl-md px-3.5">
          <span className="sr-only">{copy.typing}</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="bg-muted-foreground/60 size-1.5 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
      </div>
    );

  return (
    <>
      <div className="flex items-end gap-2">
        <Avatar />
        <div className="space-y-1">
          {copy.greeting.map((line, i) => (
            <motion.p
              key={line}
              {...rise(i)}
              className="bg-muted text-foreground w-fit max-w-[16rem] rounded-[18px] rounded-bl-md px-3.5 py-2 text-sm leading-snug"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
      <motion.ul
        {...rise(copy.greeting.length)}
        className="flex flex-col items-end gap-1.5"
        aria-label={copy.via}
      >
        {channels(copy.message).map(({ label, handle, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="tactile-control bg-foreground text-background inline-flex items-center gap-2 rounded-[18px] rounded-br-md px-3.5 py-2 text-sm transition-opacity hover:opacity-85"
            >
              <Icon className="size-4 shrink-0" />
              <span className="font-medium">{label}</span>
              <span className="opacity-60">{handle}</span>
            </a>
          </li>
        ))}
      </motion.ul>
    </>
  );
}

export function ChatDialog({ copy }: { copy: PortfolioCopy["hero"]["chat"] }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="tactile-control bg-foreground text-background ml-auto shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-85">
        {copy.open}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
        <Dialog.Content className="bg-popover text-popover-foreground border-border/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2 fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] border shadow-2xl">
          <header className="border-border/60 flex items-center gap-3 border-b px-4 py-3">
            <Avatar />
            <div className="min-w-0 flex-1">
              <Dialog.Title className="flex items-center gap-1 text-sm leading-tight font-semibold">
                Tharreq
                <TwitterVerifiedBadgeSvg className="size-3.5 shrink-0" />
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {copy.status}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={copy.close}
              className="text-muted-foreground hover:text-foreground hover:bg-muted -mr-1.5 rounded-full p-1.5 transition-colors"
            >
              <X className="size-4" />
            </Dialog.Close>
          </header>
          <div className="flex min-h-56 flex-col gap-4 p-4">
            <Thread copy={copy} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
