# 004 — Make the Proof card switch interruptible and smooth

- **Status**: DONE
- **Commit**: e1816d6
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file (`components/salmoon/proof-section.tsx`), ~40 lines

## Problem

Switching between "Raw AI Prototype" and "Requixite Refined":

1. `AnimatePresence mode="wait"` runs exit (200ms) then enter (200ms) in sequence: 400ms total, and clicking again mid-swap queues instead of retargeting.
2. The two cards have different heights, so the stage container snaps to the new height in one frame.
3. The "Micro-Audit Points" text under the card swaps instantly while the card animates: two different speeds for one state change.
4. The refined card plays its enter animation on first mount (often off-screen), which is wasted motion.
5. No easing is specified (`transition={{ duration: 0.2 }}`).

```tsx
// components/salmoon/proof-section.tsx:77-86 — current
<div className="border border-border/70 rounded-xl p-5 sm:p-7 bg-card/40 backdrop-blur-sm relative overflow-hidden flex flex-col items-center">
  <AnimatePresence mode="wait">
    {mode === "slop" ? (
      <motion.div
        key="slop-card"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm relative"
      >
```

(The refined card at lines 152-158 has identical motion props with `key="refined-card"`.)

```tsx
// components/salmoon/proof-section.tsx:226-241 — current
<div className="w-full mt-5 pt-4 border-t border-border/40 text-[11px] text-muted-foreground space-y-1.5">
  {mode === "slop" ? (
    <>
      <p className="text-red-500 font-medium">&bull; Asymmetric padding ...</p>
      ...
    </>
  ) : (
    <>
      ...
    </>
  )}
</div>
```

## Target

- Cards crossfade at the same time with `mode="popLayout"` (exiting card is taken out of flow, so the new one is laid out immediately; rapid clicks retarget).
- Stage height animates to the new card height over 250ms with the strong ease-out.
- Micro-audit text crossfades with the same timing, masked with `filter: blur(2px)` so the two states never visibly double-expose.
- No animation on first mount: `initial={false}` on both `AnimatePresence`.
- Exact values:

```tsx
const EASE_OUT = [0.23, 1, 0.32, 1] as const; // matches --ease-out token (plan 007)

const cardMotion = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.2, ease: EASE_OUT },
};

const textMotion = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(2px)" },
  transition: { duration: 0.2, ease: EASE_OUT },
};
```

Height animation: measure the inner card wrapper with a `ResizeObserver` and animate an outer wrapper's `height`. The pins sit at `-top-2.5` / `-left-2.5` outside each card, so the clipping wrapper gets 12px padding with matching negative margin so pins are not clipped:

```tsx
function useMeasuredHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, height] as const;
}

// in ProofSection
const [cardRef, cardHeight] = useMeasuredHeight<HTMLDivElement>();

<motion.div
  className="-m-3 w-[calc(100%+1.5rem)] overflow-hidden p-3"
  initial={false}
  animate={{ height: cardHeight === "auto" ? "auto" : cardHeight + 24 }}
  transition={{ duration: 0.25, ease: EASE_OUT }}
>
  <div ref={cardRef} className="relative flex w-full flex-col items-center">
    <AnimatePresence mode="popLayout" initial={false}>
      {mode === "slop" ? (
        <motion.div key="slop-card" {...cardMotion} className="w-full max-w-sm relative">
          ...
        </motion.div>
      ) : (
        <motion.div key="refined-card" {...cardMotion} className="w-full max-w-sm relative">
          ...
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</motion.div>
```

Micro-audit block:

```tsx
<div className="relative w-full mt-5 pt-4 border-t border-border/40 text-[11px] text-muted-foreground">
  <AnimatePresence mode="popLayout" initial={false}>
    <motion.div key={mode} {...textMotion} className="space-y-1.5">
      {mode === "slop" ? (<>...existing slop <p>s...</>) : (<>...existing refined <p>s...</>)}
    </motion.div>
  </AnimatePresence>
</div>
```

`height` is a layout property; it is acceptable here because this is an occasional, user-initiated change (not per frame on scroll) and it prevents a visible jump.

## Repo conventions to follow

- Framer Motion is imported from `"framer-motion"` in this file (`proof-section.tsx:4`). Keep that import source; add `useEffect`, `useRef` to the existing `react` import.
- Keep all existing markup, copy and Pin components inside the cards unchanged.

## Steps

1. Add `useEffect, useRef` to the `react` import (line 3).
2. Above `export function ProofSection`, add `EASE_OUT`, `cardMotion`, `textMotion` and `useMeasuredHeight` exactly as in Target.
3. Inside `ProofSection`, add `const [cardRef, cardHeight] = useMeasuredHeight<HTMLDivElement>();`.
4. Wrap the existing `<AnimatePresence>` (line 78) in the `motion.div` height wrapper + inner `div ref={cardRef}` from Target. Change `mode="wait"` to `mode="popLayout"` and add `initial={false}`.
5. On both card `motion.div`s, replace the four props `initial/animate/exit/transition` with `{...cardMotion}`. Keep `key` and `className`.
6. Replace the micro-audit block (lines 226-241) with the Target structure, moving the two existing fragments inside the keyed `motion.div` unchanged.

## Boundaries

- Do NOT change card content, pins, copy, colours, the mode switcher buttons (plan 006 handles their transition), or the Pin tooltip (plan 010).
- Do NOT add dependencies (no `react-use-measure`).
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run lint`, `npm run build` pass; no TypeScript errors on the `as const` easing array.
- **Feel check**:
  - Toggle once: the old card fades/shrinks while the new one fades in at the same time; the stage grows/shrinks smoothly instead of snapping.
  - Click the two buttons alternately as fast as possible for 2 s: the motion always reverses from where it is, never waits for a previous animation to finish, and never shows a blank stage.
  - Pins at the card corners are never clipped during or after the switch.
  - Micro-audit text crossfades in sync with the card; at 10% playback (DevTools > Animations) the two text states are blurred during overlap, not crisply doubled.
  - Reload: the refined card is simply there, no entrance animation.
  - Emulate `prefers-reduced-motion: reduce`: the switch still fades (opacity), without scale.
- **Done when**: `mode="wait"` is gone and all checks pass.
