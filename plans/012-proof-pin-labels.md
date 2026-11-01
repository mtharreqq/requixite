# 012 — Proof pin labels: never clipped by the stage

- **Status**: TODO
- **Commit**: bdceefd
- **Severity**: HIGH (break-ui: Broken)
- **Category**: Break-ui / layout
- **Estimated scope**: 1 file (`components/salmoon/proof-section.tsx`), ~20 lines

## Problem

Pin labels are centred above the pin (`bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap`). The top pins sit at the card's top-right corner, so their label extends above the card and to the right, outside the stage, which has `overflow-hidden`. At 320px the label "Strict 24px (8px grid) spacing" measured 205-355px while the stage ends at 304px: most of it is cut off. The top edge is clipped on desktop too.

```tsx
// components/salmoon/proof-section.tsx:275-279 — current
{active && (
  <div className="absolute z-30 bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md bg-popover border border-border text-popover-foreground text-[10px] shadow-md">
    {label}
  </div>
)}
```

Pins: top-right (`absolute -top-2.5 -right-2.5`) for p1/p3, bottom-left (`absolute -bottom-2.5 -left-2.5`) for p2/p4.

## Target

Labels open *into* the card, anchored to the pin's corner, so they can never leave the stage regardless of `overflow`:

- top-right pins → label **below** the pin, right-aligned: `top-full mt-1.5 right-0`, `transform-origin: top right`.
- bottom-left pins → label **above** the pin, left-aligned: `bottom-full mb-1.5 left-0`, `transform-origin: bottom left`.
- Long labels wrap instead of overflowing: `w-max max-w-56` (no `whitespace-nowrap`).

```tsx
function Pin({ ..., placement }: { ...; placement: "below-end" | "above-start" }) {
  ...
  {active && (
    <div
      className={cn(
        "absolute z-30 w-max max-w-56 px-2 py-1 rounded-md bg-popover border border-border text-popover-foreground text-[10px] leading-snug shadow-md",
        placement === "below-end" ? "top-full mt-1.5 right-0 origin-top-right" : "bottom-full mb-1.5 left-0 origin-bottom-left",
      )}
    >
      {label}
    </div>
  )}
}
```

Pass `placement="below-end"` to the p1/p3 pins and `placement="above-start"` to p2/p4.

Plan 010 part 2 (pin tooltip motion) must use these placement classes and animate toward the pin: `translateY(-4px)` start for `below-end`, `translateY(4px)` for `above-start`.

## Steps

1. Add the `placement` prop to `Pin` and replace the label `div` with the Target version.
2. Add `placement` to the four `<Pin>` usages as described.

## Boundaries

- Do NOT remove `overflow-hidden` from the stage (it also clips the card scale animation).
- Do NOT change pin buttons or labels' copy.

## Verification

- At 320px and 1280px, click each of the four pins in both modes: the label is fully visible inside the stage.
- **Done when**: no label pixel is clipped at any width.
