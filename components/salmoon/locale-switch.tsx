"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { locales, swapLocalePath, type Locale } from "@/lib/i18n";

function isCurrent(pathname: string, locale: Locale): boolean {
  return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
}

/**
 * Keeps the visitor on the same path in the other locale, including the hash.
 * TODO(copy): Indonesian accessible name for this switch. The visible labels
 * are the locale codes, which are the same in both languages.
 */
export function LocaleSwitch() {
  const pathname = usePathname() || "/en";
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const sync = () => {
      setSuffix(window.location.search + window.location.hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <nav
      aria-label="Language"
      className="absolute top-4 right-0 z-50 flex items-center gap-2 text-xs"
    >
      {locales.map((code) => {
        const current = isCurrent(pathname, code);
        return (
          <a
            key={code}
            href={`${swapLocalePath(pathname, code)}${suffix}`}
            hrefLang={code}
            lang={code}
            aria-current={current ? "page" : undefined}
            className={
              current
                ? "text-foreground inline-flex h-6 min-w-6 items-center justify-center font-medium"
                : "text-muted-foreground hover:text-foreground inline-flex h-6 min-w-6 items-center justify-center transition-[color]"
            }
          >
            {code.toUpperCase()}
          </a>
        );
      })}
    </nav>
  );
}
