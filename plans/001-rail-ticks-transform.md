# 001 — Animate rail ticks with transform instead of width

- **Status**: DONE
- **Commit**: e1816d6
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`components/salmoon/rail-nav.tsx`), ~15 lines

## Problem

The section rail runs a `requestAnimationFrame` loop on every scroll and writes `style.width` to all 25 tick elements each frame. `width` is a layout property: every frame triggers layout + paint + composite, during scroll, which is the highest-frequency interaction on the page. The rail container width also changes with the widest tick, so the whole fixed `<nav>` re-lays out.

```tsx
// components/salmoon/rail-nav.tsx:63-72 — current
function tickStyle(i: number, cursor: number, hoverPos: number, hoverAmount: number, scale: number) {
  const major = i % STEP === 0;
  const scrollPull = Math.max(0, 1 - Math.abs(i - cursor) / REACH);
  const hoverPull = hoverAmount * Math.max(0, 1 - Math.abs(i - hoverPos) / HOVER_REACH);
  const pull = Math.max(scrollPull, hoverPull);
  return {
    width: ((major ? 14 : 9) + pull * 18) * scale,
    opacity: (major ? 0.45 : 0.22) + pull * 0.55,
  };
}
```

```tsx
// components/salmoon/rail-nav.tsx:104-111 — current
const paint = () => {
  tickRefs.current.forEach((el, i) => {
    if (!el) return;
    const { width, opacity } = tickStyle(i, a.cursor, a.hoverPos, a.hoverAmount, a.scale);
    el.style.width = `${width}px`;
    el.style.opacity = `${opacity}`;
  });
};
```

```tsx
// components/salmoon/rail-nav.tsx:221-228 — current
<span
  key={i}
  ref={(el) => { tickRefs.current[i] = el; }}
  className="bg-foreground block h-0.5 rounded-full"
  style={tickStyle(i, 0, 0, 0, 1)}
/>
```

## Target

Every tick has a fixed layout width equal to the maximum possible width (`MAX_TICK = 32`, i.e. `14 + 18`). The visual length is produced by `transform: scaleX(width / MAX_TICK)` anchored on the left. Opacity stays as is (it is compositor-friendly). Nothing in the loop touches layout.

```tsx
// target
const MAX_TICK = 32; // widest tick: major 14px + full pull 18px

function tickStyle(i: number, cursor: number, hoverPos: number, hoverAmount: number, scale: number) {
  const major = i % STEP === 0;
  const scrollPull = Math.max(0, 1 - Math.abs(i - cursor) / REACH);
  const hoverPull = hoverAmount * Math.max(0, 1 - Math.abs(i - hoverPos) / HOVER_REACH);
  const pull = Math.max(scrollPull, hoverPull);
  const width = ((major ? 14 : 9) + pull * 18) * scale;
  return {
    transform: `scaleX(${width / MAX_TICK})`,
    opacity: (major ? 0.45 : 0.22) + pull * 0.55,
  };
}
```

## Repo conventions to follow

- Animation state lives in `anim.current` outside React and is painted imperatively (see `rail-nav.tsx:84-95`). Keep that pattern; do not move it into React state.
- Tailwind v4 utility classes on the element; inline style only for per-frame values.

## Steps

1. In `components/salmoon/rail-nav.tsx`, add `const MAX_TICK = 32;` below `const TICK_PITCH = 9;` (line 26) with the comment shown in Target.
2. Replace the body of `tickStyle` (lines 63-72) with the Target version (returns `transform` + `opacity`, no `width`).
3. In `paint` (lines 104-111), destructure `{ transform, opacity }` and set `el.style.transform = transform;` instead of `el.style.width = ...`.
4. On the tick `<span>` (lines 221-228), change the className to `"bg-foreground block h-0.5 w-8 origin-left rounded-full"` (`w-8` = 32px fixed width, `origin-left` = `transform-origin: left`). Keep `style={tickStyle(i, 0, 0, 0, 1)}`.

## Boundaries

- Do NOT touch hit-area `<a>` elements, labels, scrub logic, `readProgress`, or the theme button.
- Do NOT change `EASE`, `REACH`, `HOVER_REACH` or any constant other than adding `MAX_TICK`.
- Do NOT add dependencies.
- If the code at the cited lines differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` pass with no new errors.
- **Feel check**:
  - Scroll the page slowly and quickly: the highlighted ticks grow and shrink from the left edge exactly as before.
  - Hover the rail with a mouse: neighbouring ticks pull out smoothly; labels do not shift horizontally.
  - Phone width (< 768px): ticks are shorter (scale 0.65) as before.
  - DevTools > Performance, record 3 s of scrolling: no purple "Layout" blocks attributed to `rail-nav` per frame. Rendering > "Paint flashing" shows no flashing around the rail while scrolling.
  - The 2px ticks' rounded ends may look slightly squarer when scaled down; acceptable at this size. Confirm at 200% zoom that it does not look broken.
- **Done when**: `el.style.width` no longer appears in `rail-nav.tsx` and the rail looks identical in motion.
