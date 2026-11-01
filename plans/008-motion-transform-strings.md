# 008 — Drive Magnetic and Polaroid with full transform strings

- **Status**: DONE
- **Commit**: e1816d6
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file (`components/salmoon/portfolio-motion.tsx`), ~50 lines

## Problem

`Magnetic` and `PolaroidLink` use Framer Motion's independent transform shorthands (`x`, `y`, `rotate`, `rotateX`, `rotateY`, `scale`, `whileHover={{ y, scale }}`). These are composed and applied on the main thread each frame, so they are not hardware-accelerated and can drop frames under load (e.g. while images are decoding in the hero). The target is a single `transform` string built from motion values.

```tsx
// components/salmoon/portfolio-motion.tsx:111-118 — current (Magnetic)
<motion.div
  style={{
    x: reducedMotion ? 0 : horizontal,
    y: reducedMotion ? 0 : vertical,
  }}
>
```

```tsx
// components/salmoon/portfolio-motion.tsx:139-166 — current (PolaroidLink)
<motion.a
  {...props}
  tabIndex={props.tabIndex ?? 0}
  className={cn("polaroid-link", className)}
  style={{
    rotate: rotation,
    rotateX: reducedMotion ? 0 : tiltVertical,
    rotateY: reducedMotion ? 0 : tiltHorizontal,
    transformPerspective: 700,
  }}
  onPointerMove={...}
  onPointerLeave={reset}
  onPointerCancel={reset}
  onBlur={reset}
  whileHover={reducedMotion === false ? { y: -7, scale: 1.025 } : undefined}
  whileFocus={reducedMotion === false ? { y: -4 } : undefined}
  whileTap={reducedMotion === false ? { scale: 0.98 } : undefined}
  transition={{ type: "spring", stiffness: 280, damping: 22 }}
>
```

## Target

Same feel, same spring configs, but every visual change goes through one `transform` built with `useMotionTemplate`.

```tsx
// Magnetic target
const transform = useMotionTemplate`translate3d(${horizontal}px, ${vertical}px, 0)`;
<motion.div style={{ transform: reducedMotion ? "none" : transform }}>
```

```tsx
// PolaroidLink target
const HOVER_SPRING = { stiffness: 280, damping: 22 };
const tiltHorizontal = useSpring(0, { stiffness: 220, damping: 22 });
const tiltVertical = useSpring(0, { stiffness: 220, damping: 22 });
const lift = useSpring(0, HOVER_SPRING);
const zoom = useSpring(1, HOVER_SPRING);
const hovering = useRef(false);

const transform = useMotionTemplate`perspective(700px) translateY(${lift}px) rotate(${rotation}deg) rotateX(${tiltVertical}deg) rotateY(${tiltHorizontal}deg) scale(${zoom})`;

function reset() {
  hovering.current = false;
  tiltHorizontal.set(0);
  tiltVertical.set(0);
  lift.set(0);
  zoom.set(1);
}

<motion.a
  {...props}
  tabIndex={props.tabIndex ?? 0}
  className={cn("polaroid-link", className)}
  style={{ transform: reducedMotion ? `rotate(${rotation}deg)` : transform }}
  onPointerEnter={(event) => {
    if (reducedMotion !== false || event.pointerType !== "mouse") return;
    hovering.current = true;
    lift.set(-7);
    zoom.set(1.025);
  }}
  onPointerMove={/* unchanged tilt logic */}
  onPointerDown={() => { if (reducedMotion === false) zoom.set(0.98); }}
  onPointerUp={() => { if (reducedMotion === false) zoom.set(hovering.current ? 1.025 : 1); }}
  onPointerLeave={reset}
  onPointerCancel={reset}
  onFocus={() => { if (reducedMotion === false && !hovering.current) lift.set(-4); }}
  onBlur={reset}
>
```

Remove `whileHover`, `whileFocus`, `whileTap` and `transition` from `PolaroidLink`.

Note: `rotation` is a plain number prop. `useMotionTemplate` accepts plain values in the template, so `${rotation}` is fine.

## Repo conventions to follow

- Imports come from `"framer-motion"` in this file (lines 4-10). Add `useMotionTemplate` to that import and `useRef` is already imported from `react`.
- Keep the `event.pointerType !== "mouse"` guards: touch must not tilt or lift.

## Steps

1. Add `useMotionTemplate` to the `framer-motion` import.
2. In `Magnetic`, add the `transform` template and replace the `style` object as in Target.
3. In `PolaroidLink`, add `HOVER_SPRING`, `lift`, `zoom`, `hovering`, the `transform` template, update `reset`, replace `style`, add the `onPointerEnter`, `onPointerDown`, `onPointerUp`, `onFocus` handlers, and delete `whileHover`, `whileFocus`, `whileTap`, `transition`.
4. Keep the existing `onPointerMove` tilt math exactly (multipliers `12` and `-12`).

## Boundaries

- Do NOT change spring stiffness/damping values or tilt/lift amounts.
- Do NOT touch `PortfolioMotion` or `SectionReveal`.
- Do NOT change the `.polaroid-link` sheen CSS.
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run lint`, `npm run build` pass; no `whileHover`/`x:`/`y:`/`rotateX:` left in `portfolio-motion.tsx`.
- **Feel check** (side by side with the previous deploy if possible; this one is about feel, judge by eye):
  - Hover a polaroid: it lifts 7px, grows slightly and tilts toward the cursor with the same springy follow as before.
  - Press it: it dips to 0.98 and returns on release.
  - Tab to a polaroid: it lifts 4px.
  - Hover "Copy email" / "Send email": they follow the cursor by a few pixels and spring back on leave.
  - On touch emulation, nothing tilts or lifts.
  - Reduced motion: polaroids keep their resting rotation and do not move.
  - DevTools > Performance while moving the mouse over polaroids: no long main-thread tasks from Framer per frame.
- **Done when**: both components animate only through `style.transform` and feel identical.
