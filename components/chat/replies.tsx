"use client";

// Your messages in the contact page's chat, and my reply: typing, then where should
// I reply, with Email (your messages in the body) and X (copied for a DM),
// in one bubble like the other pages'.

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { markAnswered, useChat, useMove } from "@/lib/conversation";
import { MenuAvatar } from "@/components/shared/menu-avatar";
import { QuickReply } from "@/components/shared/quick-reply";
import { XSvg } from "@/components/shared/dock-icons";
import { cn } from "@/lib/utils";

const EMAIL = "mtharreq@gmail.com";
const EASE = [0.22, 1, 0.36, 1] as const;
const TYPING_MS = 900;
const icon =
  "text-muted-foreground group-hover:text-foreground size-4 transition-[color,scale] duration-200 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100";

/** My three dots. */
export function TypingBubble({ label }: { label: string }) {
  return (
    <span
      role="status"
      className="bg-muted inline-flex h-9 w-fit items-center gap-1 rounded-[20px] rounded-bl-md px-3.5"
    >
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          aria-hidden
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
  );
}

const mine =
  "bg-foreground text-background w-fit max-w-[min(85%,26rem)] rounded-[20px] rounded-br-md px-3.5 py-2 text-[15px] leading-snug break-words whitespace-pre-wrap";

/** Sent from another page: your message, my dots, then my note that we're
 * moving to the contact page, before the move. Nothing otherwise. */
export function Moving({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const { hero, rail } = getPortfolioCopy(locale);
  const move = useMove();
  const { sent } = useChat();
  const reduce = useReducedMotion();
  const arrive = {
    layout: "position" as const,
    initial: reduce ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.1 } },
    transition: { duration: 0.4, ease: EASE },
  };
  return (
    <AnimatePresence>
      {move && (
        <m.div
          key="moving"
          layout="position"
          exit={{ opacity: 0 }}
          className={cn("flex flex-col gap-3", className)}
        >
          <div className="flex flex-col items-end gap-1">
            {sent.slice(move.at).map((line, i) => (
              <m.p key={i} {...arrive} className={mine}>
                {line}
              </m.p>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <MenuAvatar label={rail.pages.menu} />
            <AnimatePresence mode="popLayout">
              {move.said ? (
                <m.p
                  key="note"
                  {...arrive}
                  role="status"
                  className="bg-muted w-fit max-w-[min(85%,26rem)] rounded-[20px] rounded-bl-md px-3.5 py-2 text-[15px] leading-snug"
                >
                  {hero.chat.moving}
                </m.p>
              ) : (
                <m.span key="typing" {...arrive}>
                  <TypingBubble label={hero.chat.typing} />
                </m.span>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export function Replies({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const { hero, rail } = getPortfolioCopy(locale);
  const chat = hero.chat;
  const { sent, answered } = useChat();
  const reduce = useReducedMotion();
  // Answered up to here, for the tab: what I've replied to doesn't type
  // again, a new message does.
  useEffect(() => {
    if (sent.length === answered) return;
    const t = setTimeout(markAnswered, reduce ? 0 : TYPING_MS);
    return () => clearTimeout(t);
  }, [sent.length, answered, reduce]);
  // Those already here when the page opened (shown on the page you sent
  // them from) sit still; new ones come in.
  const [seen] = useState(sent.length);
  const [copied, setCopied] = useState(false);
  if (!sent.length) return null;
  const typing = answered !== sent.length;
  const text = sent.join("\n\n");
  const arrive = {
    layout: "position" as const,
    initial: reduce ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: EASE },
  };
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col items-end gap-1">
        {sent.map((line, i) => (
          <m.p
            key={i}
            {...arrive}
            initial={i < seen ? false : arrive.initial}
            className={mine}
          >
            {line}
          </m.p>
        ))}
      </div>
      <div className="flex items-end gap-2">
        <MenuAvatar label={rail.pages.menu} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <AnimatePresence mode="popLayout">
            {typing ? (
              <m.span
                key="typing"
                {...arrive}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <TypingBubble label={chat.typing} />
              </m.span>
            ) : (
              <m.div
                key="reply"
                {...arrive}
                className="bg-muted w-[min(85%,26rem)] overflow-hidden rounded-[20px] rounded-bl-md"
              >
                <p className="px-3.5 py-2 text-[15px] leading-snug">
                  {chat.pick}
                </p>
                <nav
                  aria-label={chat.via}
                  className="border-background grid grid-cols-2 border-t"
                >
                  <QuickReply
                    cell
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent(chat.subject)}&body=${encodeURIComponent(text)}`}
                    label="Email"
                    icon={<Mail aria-hidden className={icon} />}
                  />
                  {/* X has no link that fills a DM, so the text goes on the
                      clipboard. */}
                  <QuickReply
                    cell
                    href="https://x.com/tooreeq"
                    target="_blank"
                    rel="noopener noreferrer"
                    label="X/Twitter"
                    icon={<XSvg className={icon} />}
                    onClick={() =>
                      navigator.clipboard?.writeText(text).then(
                        () => setCopied(true),
                        () => {},
                      )
                    }
                    className="border-background border-l"
                  />
                </nav>
              </m.div>
            )}
          </AnimatePresence>
          {copied && !typing && (
            <p role="status" className="text-muted-foreground ml-1 text-xs">
              {chat.copied}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
