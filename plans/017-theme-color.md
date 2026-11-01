# 017 — theme-color that follows the active theme

- **Status**: TODO
- **Commit**: bdceefd
- **Severity**: LOW
- **Category**: Mobile-native
- **Estimated scope**: 2 files (`app/layout.tsx`, new `providers/theme-color-sync.tsx`)

## Problem

No `theme-color` meta exists, so Safari/Chrome on the phone pick their own toolbar/status-bar colour. The site switches theme by class (next-themes), so a per-`prefers-color-scheme` meta alone would be wrong whenever the user overrides the OS theme.

## Target

1. `app/layout.tsx`: add a Next.js `viewport` export (page background colours: light `oklch(1 0 0)` = `#ffffff`, dark `oklch(0.145 0 0)` ≈ `#0a0a0a`):
   ```ts
   import type { Metadata, Viewport } from "next";
   export const viewport: Viewport = {
     themeColor: [
       { media: "(prefers-color-scheme: light)", color: "#ffffff" },
       { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
     ],
     colorScheme: "light dark",
   };
   ```
2. `providers/theme-color-sync.tsx` (client): on `resolvedTheme` change, set `content` of every `meta[name="theme-color"]` to the colour of the active theme, so a manual toggle wins over the OS:
   ```tsx
   "use client";
   import { useEffect } from "react";
   import { useTheme } from "next-themes";
   const COLORS = { light: "#ffffff", dark: "#0a0a0a" } as const;
   export function ThemeColorSync() {
     const { resolvedTheme } = useTheme();
     useEffect(() => {
       if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
       document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
         m.content = COLORS[resolvedTheme];
       });
     }, [resolvedTheme]);
     return null;
   }
   ```
3. Render `<ThemeColorSync />` inside `<ThemeProvider>` in `layout.tsx`.

## Verification

- `npm run build` passes; page `<head>` contains two `theme-color` metas.
- iPhone Safari: toolbar matches the page in light and dark, including after tapping the theme toggle.
