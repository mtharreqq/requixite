"use client";

import type { PortfolioCopy } from "@/lib/portfolio-copy";
import { Dialog } from "radix-ui";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Mail, X } from "lucide-react";
import { TwitterVerifiedBadgeSvg, XSvg } from "@/components/dock-icons";
import { CHAT_OPEN_EVENT } from "@/lib/chat-events";

type ChatCopy = PortfolioCopy["hero"]["chat"];

const ease = [0.22, 1, 0.36, 1] as const;
const TYPING_MS = 700;

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

function Typing({ label }: { label: string }) {
  return (
    <div className="flex items-end gap-2">
      <Avatar />
      <span className="bg-muted inline-flex h-8 items-center gap-1 rounded-[18px] rounded-bl-md px-3.5">
        <span className="sr-only">{label}</span>
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
}

// True for TYPING_MS each time `key` changes, so the dots show from the
// very first render after a send instead of flashing the reply first.
function useTyping(key: number, enabled: boolean) {
  const [doneKey, setDoneKey] = useState(-1);
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => setDoneKey(key), TYPING_MS);
    return () => clearTimeout(t);
  }, [key, enabled]);
  return enabled && doneKey !== key;
}

function Thread({
  copy,
  sent,
  animateIntro,
}: {
  copy: ChatCopy;
  sent: string[];
  animateIntro: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const introTyping = useTyping(0, animateIntro && !reduce);
  const replyTyping = useTyping(sent.length, sent.length > 0 && !reduce);
  const [copied, setCopied] = useState(false);

  const rise = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease, delay: i * 0.25 },
  });

  if (introTyping) return <Typing label={copy.typing} />;

  const text = sent.join("\n\n");
  const channels = [
    {
      label: "Email",
      handle: "mtharreq@gmail.com",
      href: `mailto:mtharreq@gmail.com?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(text)}`,
      Icon: Mail,
    },
    {
      label: "X",
      handle: "@tooreeq",
      href: "https://x.com/tooreeq",
      Icon: XSvg,
      // X has no public link that prefills a DM by handle, so carry the
      // text over on the clipboard instead.
      onClick: () => {
        navigator.clipboard?.writeText(text).then(
          () => setCopied(true),
          () => {},
        );
      },
    },
  ];

  return (
    <>
      <div className="flex items-end gap-2">
        <Avatar />
        <div className="space-y-1">
          {copy.greeting.map((line, i) => (
            <motion.p
              key={line}
              {...(animateIntro ? rise(i) : {})}
              className="bg-muted text-foreground w-fit max-w-[16rem] rounded-[18px] rounded-bl-md px-3.5 py-2 text-sm leading-snug"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      {sent.length > 0 && (
        <div className="flex flex-col items-end gap-1">
          {sent.map((line, i) => (
            <motion.p
              key={i}
              initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease }}
              className="bg-foreground text-background w-fit max-w-[16rem] rounded-[18px] rounded-br-md px-3.5 py-2 text-sm leading-snug break-words whitespace-pre-wrap"
            >
              {line}
            </motion.p>
          ))}
        </div>
      )}

      {sent.length > 0 &&
        (replyTyping ? (
          <Typing label={copy.typing} />
        ) : (
          <div className="flex items-end gap-2">
            <Avatar />
            <div className="min-w-0 space-y-2">
              <motion.p
                {...rise(0)}
                className="bg-muted text-foreground w-fit max-w-[16rem] rounded-[18px] rounded-bl-md px-3.5 py-2 text-sm leading-snug"
              >
                {copy.pick}
              </motion.p>
              <motion.ul
                {...rise(1)}
                className="flex flex-wrap gap-1.5"
                aria-label={copy.via}
              >
                {channels.map(({ label, handle, href, Icon, onClick }) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={onClick}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="tactile-control border-border hover:bg-muted inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">{handle}</span>
                    </a>
                  </li>
                ))}
              </motion.ul>
              {copied && (
                <p className="text-muted-foreground text-xs" role="status">
                  {copy.copied}
                </p>
              )}
            </div>
          </div>
        ))}
    </>
  );
}

function Composer({
  copy,
  draft,
  setDraft,
  onSend,
}: {
  copy: ChatCopy;
  draft: string;
  setDraft: (text: string) => void;
  onSend: (text: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const empty = draft.trim() === "";

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // A prefilled draft (e.g. from a pricing plan): size the field to it and
  // put the caret at the end so the visitor can keep typing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    resize();
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  const send = () => {
    if (empty) return;
    onSend(draft.trim());
    setDraft("");
    requestAnimationFrame(resize);
    ref.current?.focus();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="border-border/60 flex items-end gap-2 border-t p-3"
    >
      <label className="sr-only" htmlFor="chat-draft">
        {copy.placeholder}
      </label>
      <textarea
        id="chat-draft"
        ref={ref}
        rows={1}
        value={draft}
        placeholder={copy.placeholder}
        onChange={(e) => {
          setDraft(e.target.value);
          resize();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
          }
        }}
        className="bg-muted placeholder:text-muted-foreground focus-visible:ring-ring/40 max-h-32 min-h-9 flex-1 resize-none rounded-[18px] px-3.5 py-[7px] text-base leading-snug outline-none focus-visible:ring-2 sm:py-2 sm:text-sm"
      />
      <button
        type="submit"
        disabled={empty}
        aria-label={copy.send}
        className="tactile-control bg-foreground text-background grid size-9 shrink-0 place-items-center rounded-full transition-opacity hover:opacity-85 disabled:opacity-30"
      >
        <ArrowUp className="size-4" />
      </button>
    </form>
  );
}

export function ChatDialog({ copy }: { copy: ChatCopy }) {
  // Lives outside Dialog.Content so the conversation survives closing.
  const [sent, setSent] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const prefill = (e as CustomEvent<string | undefined>).detail;
      if (prefill) setDraft(prefill);
      setOpen(true);
    };
    window.addEventListener(CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [sent.length]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setIntroPlayed(true);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
        <Dialog.Content className="bg-popover text-popover-foreground border-border/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2 fixed top-1/2 left-1/2 z-50 flex max-h-[min(36rem,calc(100svh-2rem))] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[22px] border shadow-2xl">
          <header className="border-border/60 flex items-center gap-3 border-b px-4 py-3">
            <Avatar />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Dialog.Title className="flex items-center gap-1 text-sm leading-tight font-semibold">
                Tharreq
                <TwitterVerifiedBadgeSvg className="size-3.5 shrink-0" />
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground text-xs leading-tight">
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
          <div
            ref={scroller}
            className="flex min-h-48 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4"
          >
            <Thread copy={copy} sent={sent} animateIntro={!introPlayed} />
          </div>
          <Composer
            copy={copy}
            draft={draft}
            setDraft={setDraft}
            onSend={(t) => setSent((s) => [...s, t])}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
