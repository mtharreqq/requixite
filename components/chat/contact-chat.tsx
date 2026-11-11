"use client";

// The contact page as the chat itself: no title, just me. I'm typing, then
// I ask what needs fixing, offer the plans (a tap starts your message) and
// the other pages, each message stacking up over the composer at the
// bottom, like the home page's end. Sending from any other page brings you
// here, so this is where the conversation runs: the messages scroll, the
// composer stays.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { usePrices } from "@/lib/prices";
import { AskBox, useDraft } from "@/components/chat/ask-box";
import { LookAround } from "@/components/layout/close-into-chat";
import { MenuAvatar } from "@/components/shared/menu-avatar";
import { Replies, TypingBubble } from "@/components/chat/replies";
import { landed, useChat } from "@/lib/conversation";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
// My question and the nudge are there on arrival (the nudge is the page's
// largest paint), then dots, the plans, the other pages. Each in
// milliseconds after the one before.
const STEPS = [300, 600, 500];
const bubble =
  "bg-muted w-fit max-w-[min(85%,26rem)] rounded-[20px] rounded-bl-md px-3.5 py-2 text-[15px] leading-snug";

export function ContactChat({ locale }: { locale: Locale }) {
  const { review: copy, offer, rail } = getPortfolioCopy(locale);
  const prices = usePrices(locale);
  const draft = useDraft();
  const reduce = useReducedMotion();
  const { sent } = useChat();
  // Here mid-conversation (sent from another page, a refresh): my opening
  // is already there, no typing it again.
  const [arrived] = useState(() => sent.length > 0);
  // 0 question and nudge, 1 typing, 2 plans, 3 look around.
  const [step, setStep] = useState(reduce || arrived ? 3 : 0);
  const shown = sent.length ? 3 : step;
  useEffect(() => {
    if (reduce || arrived) return;
    let at = 0;
    const timers = STEPS.map((ms, i) => {
      at += ms;
      return setTimeout(() => setStep(i + 1), at);
    });
    return () => timers.forEach(clearTimeout);
  }, [reduce, arrived]);
  const scroller = useChatScroll(sent.length);
  // In: the move from the other page can finish.
  useLayoutEffect(landed, []);
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
  const typing = shown === 1;
  // In from below; what's already there glides up to make room.
  const arrive = {
    layout: "position" as const,
    initial: reduce || arrived ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: EASE },
  };
  return (
    <section
      id="intro"
      aria-labelledby="contact-title"
      // One screen: the messages over the composer, scrolling on their own
      // once they outgrow it, under the top bar's fade.
      className="bar:pb-[max(env(safe-area-inset-bottom),12px)] flex h-svh flex-col pb-16"
    >
      <h1 id="contact-title" className="sr-only">
        {copy.cta.title}
      </h1>
      <div
        ref={scroller}
        data-lenis-prevent
        className="chat-scroll -mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4"
      >
        <div className="bar:pt-[calc(max(env(safe-area-inset-top),12px)+4.5rem)] flex min-h-full flex-col justify-end gap-3 pt-10 pb-5">
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
              <m.p {...arrive} initial={false} className={bubble}>
                {copy.cta.title}
              </m.p>
              <m.p {...arrive} initial={false} className={bubble}>
                {copy.cta.pick}
              </m.p>
              {shown >= 2 && (
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
              {shown >= 3 && (
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
                    key={shown}
                    {...arrive}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  >
                    <TypingBubble label={copy.chat.typing} />
                  </m.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Replies locale={locale} />
        </div>
      </div>
      <AskBox locale={locale} title={copy.cta.title} draft={draft} named />
    </section>
  );
}

/** Keeps the newest message in view: at the bottom on the way in, then
 * gliding down as messages come, unless you've scrolled up to read; your
 * own message brings you back down. */
function useChatScroll(sent: number) {
  const ref = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  useLayoutEffect(() => {
    pinned.current = true;
  }, [sent]);
  useEffect(() => {
    const el = ref.current;
    const inner = el?.firstElementChild;
    if (!el || !inner) return;
    let first = true;
    let user = false;
    let t: ReturnType<typeof setTimeout>;
    const touch = () => {
      user = true;
      clearTimeout(t);
      t = setTimeout(() => (user = false), 250);
    };
    const onScroll = () => {
      if (user)
        pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    };
    const ro = new ResizeObserver(() => {
      if (!pinned.current) return;
      const smooth =
        !first && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? "smooth" : "instant",
      });
      first = false;
    });
    ro.observe(inner);
    el.addEventListener("wheel", touch, { passive: true });
    el.addEventListener("touchmove", touch, { passive: true });
    el.addEventListener("keydown", touch);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      clearTimeout(t);
      el.removeEventListener("wheel", touch);
      el.removeEventListener("touchmove", touch);
      el.removeEventListener("keydown", touch);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);
  return ref;
}
