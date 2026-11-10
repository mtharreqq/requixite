"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Languages, X } from "lucide-react";
import type { Locale } from "@/lib/portfolio-copy";

/** The visitor's own language pick: proxy.ts honours it over the browser's,
 * and this hint stops asking. */
export const pickLang = (lang: Locale) => {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
};

// In the language it offers, so a reader of it recognises it.
const OFFER = {
  id: { go: "Lihat dalam Bahasa Indonesia", close: "Tutup" },
  en: { go: "View in English", close: "Close" },
};

const noop = () => () => {};

/** A page opened in the other language than the browser's (a shared link):
 * offer the switch, never force it. Closing it counts as picking this one;
 * scrolling on just means not now: it fades and stays away this visit. */
export function LangHint({ locale }: { locale: Locale }) {
  const path = usePathname();
  const want = useSyncExternalStore<Locale | null>(
    noop,
    () =>
      /(?:^|; )lang=/.test(document.cookie)
        ? null
        : navigator.language.toLowerCase().startsWith("id")
          ? "id"
          : "en",
    () => null,
  );
  const [closed, setClosed] = useState(false);
  const [away, setAway] = useState(false);
  useEffect(() => {
    if (!want || want === locale) return;
    const check = () => {
      if (sessionStorage.getItem("lang-hint")) setClosed(true);
      else if (scrollY > 80) {
        sessionStorage.setItem("lang-hint", "1");
        setAway(true);
      }
    };
    check();
    addEventListener("scroll", check, { passive: true });
    return () => removeEventListener("scroll", check);
  }, [want, locale]);
  if (!want || want === locale || closed) return null;
  const href =
    want === "id"
      ? `/id${path === "/" ? "" : path}`
      : path.replace(/^\/id/, "") || "/";
  const t = OFFER[want];
  return (
    <div
      lang={want}
      inert={away}
      className={cn(
        "bg-background/90 side:top-6 fixed top-[calc(max(env(safe-area-inset-top),12px)+3.5rem)] left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border p-1 text-[13px] shadow-sm backdrop-blur-md ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:transition-opacity",
        away
          ? "pointer-events-none opacity-0 duration-300"
          : "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2 duration-500",
      )}
    >
      <Link
        href={href}
        hrefLang={want}
        onClick={() => pickLang(want)}
        className="hover:bg-muted flex h-9 items-center gap-1.5 rounded-full px-3 font-medium whitespace-nowrap transition-colors"
      >
        <Languages aria-hidden className="size-3.5" />
        {t.go}
      </Link>
      <button
        type="button"
        aria-label={t.close}
        onClick={() => {
          pickLang(locale);
          setClosed(true);
        }}
        className="text-muted-foreground hover:text-foreground hover:bg-muted grid size-9 cursor-pointer place-items-center rounded-full transition-colors"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  );
}
