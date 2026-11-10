"use client";

// What you've sent me, and how far I've answered. It lives on the contact
// page, where the chat is: send from any page's composer and you land
// there, mid-conversation. Kept for the tab (sessionStorage), so a refresh
// or the other language keeps it and my replies don't type again.

import { useSyncExternalStore } from "react";

type Chat = { sent: string[]; answered: number };

const KEY = "requixite:chat";
const EMPTY: Chat = { sent: [], answered: 0 };
const subs = new Set<() => void>();
let chat: Chat | null = null;

function read(): Chat {
  if (chat) return chat;
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    if (v && Array.isArray(v.sent)) {
      const sent = v.sent.filter((s: unknown) => typeof s === "string");
      chat = {
        sent,
        answered: Math.min(Number(v.answered) || 0, sent.length),
      };
    }
  } catch {
    // Storage off (private mode, blocked): the chat lasts the page.
  }
  return (chat ??= EMPTY);
}

function write(next: Chat) {
  chat = next;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  subs.forEach((f) => f());
}

export function sendMessage(text: string) {
  const c = read();
  write({ ...c, sent: [...c.sent, text] });
}

/** I've replied to everything so far. */
export function markAnswered() {
  const c = read();
  if (c.answered !== c.sent.length) write({ ...c, answered: c.sent.length });
}

function subscribe(cb: () => void) {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function useChat() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

// Sent from another page: no sudden jump. Your message shows there first,
// I type, say we're moving to the contact page, then you go. `at`: your
// first message of the move; `said`: my note is in.
type Move = { at: number; said: boolean } | null;
let move: Move = null;
const TYPING_MS = 900;
const READ_MS = 1400;

function setMove(next: Move) {
  move = next;
  subs.forEach((f) => f());
}

export function useMove() {
  return useSyncExternalStore(
    subscribe,
    () => move,
    () => null,
  );
}

export function moveToContact(
  text: string,
  go: () => void,
  composer?: HTMLElement | null,
) {
  const at = read().sent.length;
  sendMessage(text);
  // Moving already: this one just joins the others.
  if (move) return;
  const from = location.pathname;
  setMove({ at, said: false });
  // Left by another link meanwhile: stay there.
  const still = () => location.pathname === from || (setMove(null), false);
  setTimeout(() => {
    if (!still()) return;
    setMove({ at, said: true });
    setTimeout(() => still() && handOff(go, composer), READ_MS);
  }, TYPING_MS);
}

// The move to the contact page as one view transition: the composer stays
// where it is (or glides to its spot there) and the rest crossfades. The
// contact page says when it's in (`landed`), or a timeout lets go.
let release: (() => void) | null = null;

export function handOff(go: () => void, composer?: HTMLElement | null) {
  const root = document.documentElement;
  if (
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    go();
    return;
  }
  if (composer) composer.style.viewTransitionName = "composer";
  root.dataset.handoff = "";
  const t = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
        setTimeout(resolve, 2500);
        go();
      }),
  );
  t.finished.finally(() => {
    delete root.dataset.handoff;
    release = null;
  });
}

export function landed() {
  release?.();
  release = null;
  if (move) setMove(null);
}
