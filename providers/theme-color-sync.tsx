"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

// Page background per theme (--background: oklch(1 0 0) / oklch(0.145 0 0)).
const COLORS = { light: "#ffffff", dark: "#0a0a0a" } as const;

/**
 * The theme is switched by class (next-themes), not only by the OS setting,
 * so the per-scheme theme-color metas are overwritten with the active theme's
 * colour. Keeps the phone's status bar / browser toolbar matching the page
 * after a manual toggle.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => {
        meta.content = COLORS[resolvedTheme];
      });
  }, [resolvedTheme]);

  return null;
}
