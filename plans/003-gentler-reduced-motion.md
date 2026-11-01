# 003 — Reduced motion removes movement, not all feedback

- **Status**: TODO
- **Commit**: e1816d6
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files (`app/globals.css`, `components/salmoon/rail-nav.tsx`), ~40 lines

## Problem

Under `prefers-reduced-motion: reduce`, every animation and every transition inside `.portfolio-motion` is killed with `!important`, including harmless colour, background and opacity transitions. Reduced motion should mean fewer and gentler animations, not zero: keep opacity/colour feedback, drop position changes, blur and tilt. Separately, the rail's touch scrub always uses `scrollIntoView({ behavior: "smooth" })`, ignoring the preference.

```css
/* app/globals.css:160-185 — current */
@media (prefers-reduced-motion: reduce) {
  .portfolio-motion *,
  .portfolio-motion *::before,
  .portfolio-motion *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
  .portfolio-motion [data-reveal] {
    opacity: 1;
    transform: none;
  }
  .portfolio-motion .project-tactile:hover {
    translate: none;
  }
  .portfolio-motion .social-tactile:hover,
  .portfolio-motion .social-tactile:hover svg {
    transform: none;
  }
  .polaroid-link::after {
    display: none;
  }
  .portfolio-motion .project-tactile::after {
    display: none;
  }
}
```

```tsx
// components/salmoon/rail-nav.tsx:193-199 — current
function onPointerUp(e: PointerEvent<HTMLDivElement>) {
  if (!scrubbing) return;
  const target = document.getElementById(SECTIONS[sectionAt(e.clientY)].id);
  target?.scrollIntoView({ behavior: "smooth" });
  setScrubbing(false);
  hover(null);
}
```

## Target

```css
/* target, replaces the whole block at app/globals.css:160-185 */
@keyframes portfolio-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  /* Entrances: keep a short opacity fade, drop translate + blur. */
  .hero-identity,
  .hero-copy > p,
  .hero-polaroids {
    animation: portfolio-fade 200ms ease both;
  }
  .portfolio-motion [data-reveal] {
    opacity: 1;
    transform: none;
  }
  .portfolio-motion [data-reveal] > section > * {
    animation: none;
  }
  /* Hover/press movement off; colour, background, opacity transitions stay. */
  .portfolio-motion .project-tactile:hover {
    translate: none;
  }
  .portfolio-motion .social-tactile:hover,
  .portfolio-motion .social-tactile:hover svg {
    transform: none;
  }
  .portfolio-motion .tactile-control:active {
    scale: none;
  }
  .polaroid-link::after,
  .portfolio-motion .project-tactile::after {
    display: none;
  }
  html {
    scroll-behavior: auto;
  }
}
```

```tsx
// target, rail-nav.tsx onPointerUp
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
```

Framer Motion components are already covered by `<MotionConfig reducedMotion="user">` (`portfolio-motion.tsx:70`) and `useReducedMotion()` checks; leave them.

## Repo conventions to follow

- All reduced-motion CSS lives in the single `@media (prefers-reduced-motion: reduce)` block in `app/globals.css`. Keep one block.
- Keyframes are declared at the top of `globals.css` next to `portfolio-arrive` / `portfolio-focus`; put `portfolio-fade` there (after line 28) rather than inside the media query.

## Steps

1. In `app/globals.css`, add the `@keyframes portfolio-fade` rule right after the `portfolio-focus` keyframes (after line 28).
2. Replace the entire `@media (prefers-reduced-motion: reduce) { ... }` block (lines 160-185) with the Target media block (without the keyframes, already added in step 1).
3. In `components/salmoon/rail-nav.tsx` `onPointerUp` (lines 193-199), replace the `scrollIntoView` line with the two Target lines.

## Boundaries

- Do NOT touch the `@media print` block.
- Do NOT remove `MotionConfig reducedMotion="user"` or any `useReducedMotion` usage.
- Do NOT change normal (non-reduced) motion values.
- If another plan (007 or 009) has already changed easing tokens or the reveal keyframes, keep their values; only the reduced-motion block is in scope here.
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run lint`, `npm run build` pass.
- **Feel check** (DevTools > Rendering > Emulate CSS `prefers-reduced-motion: reduce`, then reload):
  - Hero name, bio and polaroids fade in quickly (about 200ms) without moving up or blurring.
  - Lower sections are simply visible; no fade, no movement while scrolling.
  - Hovering a project card / social button still changes colour or background smoothly, but nothing moves or rotates.
  - Polaroids do not tilt or lift (Framer reduced-motion path).
  - On a touch device or emulation, scrubbing the rail jumps instantly to the section.
  - Turn emulation off and reload: everything moves as before.
- **Done when**: no `transition: none !important` / `animation: none !important` blanket rule remains, and the checks above pass.
