"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import {
  getPortfolioCopy,
  type Locale,
  type PortfolioCopy,
} from "@/lib/portfolio-copy";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  useTapOpen,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { moveToContact, sendMessage } from "@/lib/conversation";
import { ContactIcons } from "@/components/shared/connect-section";

// The composer pieces the sub-pages share with the home story, apart from it
// so they don't load the whole story.

type Offer = PortfolioCopy["offer"];

/** A message box. On send your message goes to the chat on the contact
 * page, and you with it, unless you're there already. */
export function useDraft() {
  const [text, setText] = useState("");
  const router = useRouter();
  const path = usePathname();
  const contact = path.startsWith("/id") ? "/id/contact" : "/contact";
  const here = path === contact;
  const write = (t: string) => {
    setText(t);
    // Ready before you send, so the move doesn't wait on it.
    if (!here && t.trim()) router.prefetch(contact);
  };
  const send = (e?: React.SyntheticEvent) => {
    const t = text.trim();
    if (!t) return;
    setText("");
    if (here) return sendMessage(t);
    const from = e?.currentTarget ?? document.activeElement;
    moveToContact(
      t,
      () => router.push(contact),
      from instanceof Element ? from.closest<HTMLElement>(".composer") : null,
    );
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(e);
    }
  };
  return { text, setText: write, send, onKeyDown };
}

export function Send({
  label,
  onClick,
  off,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  off: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={off}
          aria-label={label}
          className="composer-send"
        >
          <ArrowUp />
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={2}>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Under every composer: the note, centered. The © line lives in the
 * avatar's menu, out of the chat's way. */
export function Foot({ offer }: { offer: Offer }) {
  return (
    <div className="foot bar:text-[13px] bar:mt-3 mt-2 flex justify-center px-1 text-xs">
      <Note offer={offer} />
    </div>
  );
}

/** "Human, can make mistakes", with the fine print on hover, or a tap. */
function Note({ offer }: { offer: Offer }) {
  const note = useTapOpen();
  return (
    <HoverCard
      open={note.open}
      onOpenChange={note.onOpenChange}
      openDelay={600}
      closeDelay={100}
    >
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="tap-area text-muted-foreground hover:text-foreground cursor-help decoration-dotted underline-offset-4 transition-colors hover:underline focus-visible:underline"
          {...note.tap}
        >
          {offer.note}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        sideOffset={6}
        className="bg-foreground text-background max-w-64 rounded-md border-0 px-3 py-1.5 text-xs text-balance"
      >
        {offer.noteTip}
      </HoverCardContent>
    </HoverCard>
  );
}

const PHONE = "(max-width: 767px)";
/** The long placeholder, or on a phone the short one. The server renders
 * the long one; a phone swaps it after hydration. */
export function usePlaceholder(long: string, short: string) {
  const phone = useSyncExternalStore(
    (cb) => {
      const m = matchMedia(PHONE);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(PHONE).matches,
    () => false,
  );
  return phone ? short : long;
}

/** The story's last composer on its own, without the plans: the sub-pages
 * and the contact page. */
export function AskBox({
  locale,
  title,
  placeholder,
  draft,
  named,
}: {
  locale: Locale;
  title?: string;
  /** Long, and short for phones; the home composer's by default. */
  placeholder?: { placeholder: string; short: string };
  /** Its draft, when something else fills it too (a picked plan). */
  draft?: ReturnType<typeof useDraft>;
  /** The contact page's: where a composer sent from elsewhere lands. */
  named?: boolean;
}) {
  const { review: copy, offer, contact } = getPortfolioCopy(locale);
  const hint = usePlaceholder(
    placeholder?.placeholder ?? copy.cta.placeholder,
    placeholder?.short ?? copy.cta.short,
  );
  const own = useDraft();
  const { text, setText, send, onKeyDown } = draft ?? own;
  return (
    <div>
      <div
        className="composer"
        data-mode="cta"
        style={{
          borderRadius: 22,
          viewTransitionName: named ? "composer" : undefined,
        }}
      >
        <div className="composer-body">
          <label htmlFor="contact-ask" className="sr-only">
            {title ?? copy.cta.title}
          </label>
          <textarea
            id="contact-ask"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={hint}
            className="composer-input"
          />
          <div className="flex min-w-0 items-center [grid-area:tools]">
            <ContactIcons copy={contact} />
          </div>
          <span className="[grid-area:send]">
            <Send label={copy.cta.send} onClick={send} off={!text.trim()} />
          </span>
        </div>
      </div>
      <Foot offer={offer} />
    </div>
  );
}
