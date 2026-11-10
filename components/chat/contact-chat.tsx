"use client";

// The contact page as the chat itself: no title, just me. I'm typing, then
// I ask what needs fixing, offer the plans (a tap starts your message) and
// the other pages, each message stacking up over the composer at the
// bottom, like the home page's end.

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { usePrices } from "@/lib/prices";
import { AskBox, useDraft } from "@/components/chat/ask-box";
import { LookAround } from "@/components/layout/close-into-chat";
import { MenuAvatar } from "@/components/shared/menu-avatar";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
// Dots, my question, dots, the nudge, the plans, the other pages. Each in
// milliseconds after the one before.
const STEPS = [1200, 300, 600, 900, 500];
const bubble =
  "bg-muted w-fit max-w-[min(85%,26rem)] rounded-[20px] rounded-bl-md px-3.5 py-2 text-[15px] leading-snug";

export function ContactChat({ locale }: { locale: Locale }) {
  const { review: copy, offer, rail } = getPortfolioCopy(locale);
  const prices = usePrices(locale);
  const draft = useDraft();
  const reduce = useReducedMotion();
  // 0 typing, 1 question, 2 typing, 3 nudge, 4 plans, 5 look around.
  const [step, setStep] = useState(reduce ? 5 : 0);
  useEffect(() => {
    if (reduce) return;
    let at = 0;
    const timers = STEPS.map((ms, i) => {
      at += ms;
      return setTimeout(() => setStep(i + 1), at);
    });
    return () => timers.forEach(clearTimeout);
  }, [reduce]);
  const pick = (name: string) => {
    const text = offer.ask.replace("{plan}", name);
    draft.setText(text);
    requestAnimationFrame(() => {
      const field = document.getElementById(
        "contact-ask",
      ) as HTMLTextAreaElement | null;
      field?.focus();
      field?.setSelectionRange(text.length, text.length);
    });
  };
  const typing = step === 0 || step === 2;
  // In from below; what's already there glides up to make room.
  const arrive = {
    layout: "position" as const,
    initial: reduce ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: EASE },
  };
  return (
    <section
      id="intro"
      aria-labelledby="contact-title"
      // One screen, the chat at its bottom over the composer, clear of the
      // top bar when it grows tall.
      className="bar:pt-[calc(max(env(safe-area-inset-top),12px)+4.5rem)] flex min-h-svh flex-col justify-end gap-3 pt-10 pb-[calc(env(safe-area-inset-bottom)+2.5rem)]"
    >
      <h1 id="contact-title" className="sr-only">
        {copy.cta.title}
      </h1>
      <div className="flex items-end gap-2">
        <MenuAvatar label={rail.pages.menu} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <m.p
            layout="position"
            transition={{ layout: arrive.transition }}
            className="text-muted-foreground ml-1 text-xs"
          >
            Tharreq
          </m.p>
          {step >= 1 && (
            <m.p {...arrive} className={bubble}>
              {copy.cta.title}
            </m.p>
          )}
          {step >= 3 && (
            <m.p {...arrive} className={bubble}>
              {copy.cta.pick}
            </m.p>
          )}
          {step >= 4 && (
            <m.div
              {...arrive}
              className="bg-muted w-[min(85%,26rem)] overflow-hidden rounded-[20px] rounded-bl-md"
            >
              {offer.plans.map((pl, i) => (
                <button
                  key={pl.name}
                  type="button"
                  onClick={() => pick(pl.name)}
                  className={cn(
                    "hover:bg-foreground/[0.04] flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[15px] transition-[background-color,opacity] active:opacity-60",
                    i > 0 && "border-background border-t",
                  )}
                >
                  <span className="font-medium">{pl.name}</span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">
                    {prices[i] ? `${offer.from} ${prices[i]}` : offer.free}
                  </span>
                </button>
              ))}
            </m.div>
          )}
          {step >= 5 && (
            <m.div
              {...arrive}
              className="bg-muted w-[min(85%,26rem)] overflow-hidden rounded-[20px] rounded-bl-md"
            >
              <LookAround locale={locale} path="/contact" />
            </m.div>
          )}
          <AnimatePresence mode="popLayout">
            {typing && (
              <m.span
                key={step}
                {...arrive}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                role="status"
                className="bg-muted inline-flex h-9 w-fit items-center gap-1 rounded-[20px] rounded-bl-md px-3.5"
              >
                <span className="sr-only">{copy.chat.typing}</span>
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
              </m.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AskBox locale={locale} title={copy.cta.title} draft={draft} />
    </section>
  );
}
