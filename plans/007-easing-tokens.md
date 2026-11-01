# 007 — Consolidate easing into tokens and give every transition a curve

- **Status**: DONE
- **Commit**: e1816d6
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`app/globals.css`), ~15 lines

## Problem

`cubic-bezier(0.22, 1, 0.36, 1)` is hand-typed 7 times in `app/globals.css` (lines 31, 34, 46, 53, 88, 129, 132). Several transitions have no easing at all and fall back to the browser default `ease`, including press feedback (`scale`) and a lift (`translate`) which should use a strong ease-out. Any future tweak has to be done in 7+ places.

```css
/* app/globals.css:91-99 — current */
.project-tactile {
  position: relative;
  isolation: isolate;
  transition:
    border-color 220ms,
    background-color 220ms,
    box-shadow 300ms,
    translate 300ms;
}
```

```css
/* app/globals.css:114 — current */
  transition: opacity 300ms;
```

```css
/* app/globals.css:119-124 — current */
.tactile-control {
  transition:
    opacity 180ms,
    background-color 180ms,
    scale 180ms;
}
```

## Target

Define the tokens once in Tailwind's theme (so the `ease-out` / `ease-in-out` utilities also use them) and reference them everywhere:

```css
/* target: new block right after the existing @theme inline { ... } block */
@theme {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);     /* strong ease-out for UI */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* on-screen movement */
}
```

- Replace all 7 `cubic-bezier(0.22, 1, 0.36, 1)` with `var(--ease-out)`.
- Transitions:

```css
.project-tactile {
  position: relative;
  isolation: isolate;
  transition:
    border-color 220ms ease,
    background-color 220ms ease,
    box-shadow 300ms var(--ease-out),
    translate 300ms var(--ease-out);
}
/* .project-tactile::after */
  transition: opacity 300ms ease;

.tactile-control {
  transition:
    opacity 180ms ease,
    background-color 180ms ease,
    scale 160ms var(--ease-out);
}
```

Note: overriding `--ease-out` in `@theme` intentionally changes the Tailwind `ease-out` utility from its default `cubic-bezier(0, 0, 0.2, 1)` to the stronger curve. Grep shows no `ease-out` utility usage in `components/salmoon` today, so there is no visible regression.

## Repo conventions to follow

- Theme tokens live in `app/globals.css` (`@theme inline` block at line 198). Tailwind v4, no `tailwind.config`.
- If plan 004 is already applied, its `EASE_OUT = [0.23, 1, 0.32, 1]` already matches this token. Do not change it.

## Steps

1. Add the `@theme { ... }` block from Target immediately after the closing `}` of `@theme inline` (line 236).
2. Replace each of the 7 occurrences of `cubic-bezier(0.22, 1, 0.36, 1)` with `var(--ease-out)`. Do not change durations or delays.
3. Replace the `.project-tactile` transition list (lines 94-98), the `.project-tactile::after` transition (line 114), and the `.tactile-control` transition list (lines 120-123) with the Target values.

## Boundaries

- Do NOT change durations except `.tactile-control` scale 180ms → 160ms.
- Do NOT touch keyframe definitions, reduced-motion block (plan 003) or reveal durations (plan 009).
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run build` passes; `grep -c "cubic-bezier(0.22" app/globals.css` returns 0; DevTools computed style on `.hero-identity` shows `animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1)`.
- **Feel check**:
  - Hero entrance looks the same (the curves are nearly identical).
  - Press and hold "Copy email": it scales down crisply, not softly.
  - Hover a project card: it lifts with a fast start and soft landing.
- **Done when**: one source of truth for easing and every transition in `globals.css` names its curve.
