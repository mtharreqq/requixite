# 010 — Animate three state changes that currently teleport

- **Status**: DONE
- **Commit**: e1816d6
- **Severity**: LOW
- **Category**: Missed opportunities
- **Estimated scope**: 3 files (`connect-section.tsx`, `proof-section.tsx`, `rail-nav.tsx`), ~50 lines

## Problem

Three small, occasional, user-triggered state changes swap instantly, which feels abrupt on a site whose pitch is "considered motion":

1. **Copy email** label flips from "Copy email" to "✓ Copied" in one frame; the 2.5 s reset timer is also never cleared on unmount or repeated clicks.

```tsx
// components/salmoon/connect-section.tsx:37-43 — current
const [copied, setCopied] = useState(false);

function handleCopy() {
  navigator.clipboard.writeText(EMAIL);
  setCopied(true);
  setTimeout(() => setCopied(false), 2500);
}
```

```tsx
// components/salmoon/connect-section.tsx:81-88 — current
{copied ? (
  <>
    <Check className="size-3.5" />
    Copied
  </>
) : (
  "Copy email"
)}
```

2. **Proof pins** show their label tooltip with a hard pop (no transition, no origin).

```tsx
// components/salmoon/proof-section.tsx:275-279 — current
{active && (
  <div className="absolute z-30 bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md bg-popover border border-border text-popover-foreground text-[10px] shadow-md">
    {label}
  </div>
)}
```

3. **Theme toggle** icon swaps Sun/Moon instantly.

```tsx
// components/salmoon/rail-nav.tsx:279 — current
{mounted && resolvedTheme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
```

## Target

All three use Framer Motion `AnimatePresence` with `initial={false}` (no animation on first render), the strong ease-out `[0.23, 1, 0.32, 1]`, and full transform strings (see plan 008 rationale). Never scale from 0.

1. Copy email: crossfade with blur mask, 160ms.

```tsx
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
useEffect(() => () => clearTimeout(timer.current), []);

function handleCopy() {
  navigator.clipboard.writeText(EMAIL);
  setCopied(true);
  clearTimeout(timer.current);
  timer.current = setTimeout(() => setCopied(false), 2500);
}

<AnimatePresence mode="popLayout" initial={false}>
  <motion.span
    key={copied ? "copied" : "idle"}
    className="inline-flex items-center gap-1.5"
    initial={{ opacity: 0, transform: "scale(0.9)", filter: "blur(2px)" }}
    animate={{ opacity: 1, transform: "scale(1)", filter: "blur(0px)" }}
    exit={{ opacity: 0, transform: "scale(0.9)", filter: "blur(2px)" }}
    transition={{ duration: 0.16, ease: EASE_OUT }}
  >
    {copied ? (<><Check className="size-3.5" />Copied</>) : "Copy email"}
  </motion.span>
</AnimatePresence>
```

2. Pin tooltip: grows out of the pin, 150ms. **Plan 012 changes the label placement** (`below-end` / `above-start`, no `-translate-x-1/2`); keep 012's classes and origin, and start from `translateY(-4px)` for `below-end` and `translateY(4px)` for `above-start`. The snippet below shows the pre-012 shape for reference only.

```tsx
<AnimatePresence initial={false}>
  {active && (
    <motion.div
      className="absolute z-30 bottom-full mb-1.5 left-1/2 -translate-x-1/2 origin-bottom whitespace-nowrap px-2 py-1 rounded-md bg-popover border border-border text-popover-foreground text-[10px] shadow-md"
      initial={{ opacity: 0, transform: "translateY(4px) scale(0.96)" }}
      animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      exit={{ opacity: 0, transform: "translateY(4px) scale(0.96)" }}
      transition={{ duration: 0.15, ease: EASE_OUT }}
    >
      {label}
    </motion.div>
  )}
</AnimatePresence>
```

3. Theme icon: rotate-crossfade, 200ms.

```tsx
<AnimatePresence mode="popLayout" initial={false}>
  <motion.span
    key={mounted && resolvedTheme === "dark" ? "sun" : "moon"}
    className="grid place-items-center"
    initial={{ opacity: 0, transform: "rotate(-45deg) scale(0.9)" }}
    animate={{ opacity: 1, transform: "rotate(0deg) scale(1)" }}
    exit={{ opacity: 0, transform: "rotate(45deg) scale(0.9)" }}
    transition={{ duration: 0.2, ease: EASE_OUT }}
  >
    {mounted && resolvedTheme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
  </motion.span>
</AnimatePresence>
```

Reduced motion: these components are inside `<MotionConfig reducedMotion="user">` (`portfolio-motion.tsx:70`), so transforms are dropped automatically and opacity remains. `RailNav` is rendered inside `PortfolioMotion` in `app/page.tsx`, so it is covered too.

## Repo conventions to follow

- Import from `"framer-motion"` (as in `proof-section.tsx:4`). `proof-section.tsx` already imports `motion, AnimatePresence`; reuse its `EASE_OUT` if plan 004 already added it instead of redeclaring.
- `connect-section.tsx` and `rail-nav.tsx` need `import { AnimatePresence, motion } from "framer-motion";` and declare `EASE_OUT` locally.

## Steps

1. `connect-section.tsx`: add `useEffect, useRef` to the react import and the framer import; add `EASE_OUT`, the timer ref + cleanup effect, update `handleCopy`, and replace the button's children (lines 81-88) with the Target `AnimatePresence` block. Keep the button's own className (`min-w-[116px]` keeps width stable).
2. `proof-section.tsx`: in `Pin`, replace the `{active && (<div ...>)}` block (lines 275-279) with the Target block (adds `origin-bottom`).
3. `rail-nav.tsx`: add the framer import and `EASE_OUT`; replace the icon expression inside the theme `<button>` (line 279) with the Target block.

## Boundaries

- Do NOT change button sizes, copy, colours or the clipboard call itself.
- Do NOT add an animation on keyboard-triggered theme shortcuts (none exist; do not add one).
- Do NOT add dependencies.
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run lint`, `npm run build` pass.
- **Feel check**:
  - Click "Copy email": label softly swaps to "✓ Copied" without the button changing width; after 2.5 s it swaps back. Click 5 times quickly: it stays "Copied" and resets 2.5 s after the last click.
  - Click a Proof pin: the label rises out of the pin; click again: it sinks back. Switching modes while a pin is open does not leave a ghost label.
  - Toggle theme: icon rotates/crossfades in 200ms; reload shows the correct icon with no animation.
  - Reduced motion emulation: all three only fade.
  - DevTools Animations at 10%: nothing scales from 0, and crossfades are blurred, not doubled.
- **Done when**: none of the three state changes happens in a single frame any more.
