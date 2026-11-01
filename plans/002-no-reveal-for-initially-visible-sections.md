# 002 — Do not replay the reveal on sections already visible at load

- **Status**: TODO
- **Commit**: e1816d6
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file (`components/salmoon/portfolio-motion.tsx`), 1-2 lines

## Problem

Sections are server-rendered visible (`data-reveal=""`). After hydration, the effect marks every section already in the viewport as `visible`, which starts the `portfolio-focus` keyframes (`animation: ... both`, from `opacity: 0`). The user sees the content, it blinks out, then fades back in. On tall desktop screens this hits the Dilemma section right under the hero.

```tsx
// components/salmoon/portfolio-motion.tsx:47-57 — current
if (!preference.matches) {
  sections.forEach((section) => {
    const bounds = section.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      section.dataset.reveal = "visible";
      return;
    }
    section.dataset.reveal = "pending";
    observer.observe(section);
  });
}
```

```css
/* app/globals.css:52-54 — current */
.portfolio-motion [data-reveal="visible"] > section > * {
  animation: portfolio-focus 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

## Target

Sections already on screen when the effect runs keep `data-reveal=""` (no animation, no blink). Only sections below the fold become `pending` and animate in on scroll. The hero keeps its own CSS entrance (it is pure CSS and plays from first paint, so it does not blink).

```tsx
// target
if (bounds.top < window.innerHeight && bounds.bottom > 0) {
  // Already painted by SSR; animating it now would blink it out and back in.
  return;
}
```

## Repo conventions to follow

- Reveal state is a `data-reveal` attribute driven by `PortfolioMotion`; CSS in `app/globals.css` reacts to it. Keep that split.

## Steps

1. In `components/salmoon/portfolio-motion.tsx`, inside the `if (bounds.top < window.innerHeight && bounds.bottom > 0)` block (lines 50-53), delete `section.dataset.reveal = "visible";` and add the comment from Target above `return;`.

## Boundaries

- Do NOT change the IntersectionObserver options, the reduced-motion handling, or `globals.css`.
- Do NOT touch the hero entrance classes (`.hero-identity`, `.hero-copy`, `.hero-polaroids`).
- If the code differs from the excerpt, STOP and report.

## Verification

- **Mechanical**: `npm run lint`, `npm run build` pass.
- **Feel check**:
  - Hard-reload on a 1440x900 (or taller) window: the section under the hero is visible from the first frame and never flickers.
  - DevTools > Network throttling "Slow 4G", reload: still no flicker after hydration.
  - Scroll down: sections that were below the fold still fade in once.
- **Done when**: no section that is visible at load changes opacity after hydration.
