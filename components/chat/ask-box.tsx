"use client";

import { useState } from "react";
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
import { openChat } from "@/lib/chat-events";
import { ContactIcons, FooterMeta } from "@/components/shared/connect-section";

// The composer pieces the sub-pages share with the home story, apart from it
// so they don't load the whole story.

type Offer = PortfolioCopy["offer"];
type Contact = PortfolioCopy["contact"];

/** A message box that opens the chat dialog with its text on send. */
export function useDraft() {
  const [text, setText] = useState("");
  const send = () => {
    const t = text.trim();
    if (!t) return;
    openChat(t);
    setText("");
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };
  return { text, setText, send, onKeyDown };
}

export function Send({
  label,
  onClick,
  off,
}: {
  label: string;
  onClick: () => void;
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
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Under every composer: the note and "© Requixite • v…"; stacked and
 * centered on phones. */
export function Foot({ offer, contact }: { offer: Offer; contact: Contact }) {
  return (
    <div className="bar:gap-3 bar:text-[13px] mt-2 flex flex-col items-center gap-2 px-1 text-xs md:flex-row md:items-baseline md:justify-between md:gap-4">
      <Note offer={offer} />
      <FooterMeta copy={contact} />
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

/** The story's last composer on its own, without the plans: the sub-pages
 * and the contact page. */
export function AskBox({
  locale,
  title,
  placeholder,
}: {
  locale: Locale;
  title?: string;
  placeholder?: string;
}) {
  const { review: copy, offer, contact } = getPortfolioCopy(locale);
  const { text, setText, send, onKeyDown } = useDraft();
  return (
    <div>
      <div className="composer" data-mode="cta" style={{ borderRadius: 22 }}>
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
            placeholder={placeholder ?? copy.cta.placeholder}
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
      <Foot offer={offer} contact={contact} />
    </div>
  );
}
