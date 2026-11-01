# 009 — Lighter, shorter section reveal

- **Status**: DONE
- **Commit**: e1816d6
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`app/globals.css`), ~15 lines

## Problem

Every section below the hero reveals with the same treatment as the hero: 800ms, 5px blur, 6px rise, and up to 180ms delay, so the last child finishes about 1 s after the section enters view. Repeated on six sections it reads as "everything fades in", which dilutes the hero entrance and makes fast scrollers wait for content. Blur is also the most expensive part of the effect.

```css
/* app/globals.css:52-60 — current */
.portfolio-motion [data-reveal="visible"] > section > * {
  animation: portfolio-focus 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.portfolio-motion [data-reveal="visible"] > section > :nth-child(2) {
  animation-delay: 90ms;
}
.portfolio-motion [data-reveal="visible"] > section > :nth-child(n + 3) {
  animation-delay: 180ms;
}
```

(After plan 007, `cubic-bezier(0.22, 1, 0.36, 1)` reads `var(--ease-out)`.)

## Target

Keep blur only in the hero (`portfolio-focus`). Sections use a new, lighter keyframe: opacity + 8px rise, 500ms, strong ease-out, 60ms stagger steps.

```css
/* target: new keyframes next to the others at the top of globals.css */
@keyframes portfolio-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* target: replaces lines 52-60 */
.portfolio-motion [data-reveal="visible"] > section > * {
  animation: portfolio-rise 500ms var(--ease-out) both;
}
.portfolio-motion [data-reveal="visible"] > section > :nth-child(2) {
  animation-delay: 60ms;
}
.portfolio-motion [data-reveal="visible"] > section > :nth-child(n + 3) {
  animation-delay: 120ms;
}
```

## Repo conventions to follow

- Keyframes live at the top of `app/globals.css` (`portfolio-arrive`, `portfolio-focus`). Add `portfolio-rise` after them.
- Depends on plan 007 for `var(--ease-out)`. If 007 is not applied yet, use `cubic-bezier(0.23, 1, 0.32, 1)` literally and note it in the PR.

## Steps

1. Add `@keyframes portfolio-rise` after the existing keyframes (after `portfolio-focus`, and after `portfolio-fade` if plan 003 added it).
2. Replace the three reveal rules (lines 52-60) with the Target rules.

## Boundaries

- Do NOT change `.hero-identity`, `.hero-copy`, `.hero-polaroids` (hero keeps blur and its longer timing on purpose).
- Do NOT change `portfolio-motion.tsx` or the reduced-motion block.
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run build` passes.
- **Feel check**:
  - Scroll down from the hero at normal speed: each section's header, then body, then content rises in quickly and is fully readable in about 0.6 s.
  - Scroll fast to the bottom: no section is still invisible when you stop.
  - The hero still has its softer, blurred, slower entrance, so it feels like the "main" moment.
  - DevTools Animations panel at 10%: section children have no blur.
- **Done when**: sections reveal in ≤ 620ms total (500ms + 120ms) with no blur.
