# 016 — Press feedback for touch on every control

- **Status**: DONE
- **Commit**: bdceefd
- **Severity**: MEDIUM
- **Category**: Mobile-native
- **Estimated scope**: 5 files, class-level changes

## Problem

Tailwind v4 already sets `-webkit-tap-highlight-color: transparent` and gates `hover:` behind `(hover: hover)`. Result on a phone: tapping the social icons, the Proof mode buttons, the theme toggle, "Send email" or the work card links gives **no visual response at all**. Native controls respond the moment the finger lands (`:active`).

## Target

Press feedback 100-160ms with the strong ease-out (`var(--ease-out)`, plan 007), subtle scale 0.94-0.98 or an opacity dip for text links:

| Control | File | Add |
| --- | --- | --- |
| Social icons (`.social-tactile`) | `app/globals.css` | `.social-tactile:active { scale: 0.94; }` and add `scale 160ms var(--ease-out)` to its transition list |
| "Send email" | `connect-section.tsx` | `active:scale-[0.98]` (already transitions `scale` via `.tactile-control`) |
| Proof mode buttons | `proof-section.tsx` | `active:scale-[0.98]` and add `scale` to the `transition-[...]` list from plan 006 |
| Proof pins | `proof-section.tsx` | `active:scale-95` (button already has `transition-transform`) |
| Theme toggle | `rail-nav.tsx` | `active:scale-90`, change `transition-colors` to `transition-[color,scale] duration-150 ease-out` |
| Work card host / GitHub links | `work-section.tsx` | `active:opacity-60`, `transition-colors` → `transition-[color,opacity]` |

Under reduced motion, keep opacity feedback and drop scale: add `.portfolio-motion .social-tactile:active { scale: none; }` to the reduced-motion block (plan 003 already removes `.tactile-control:active` scale).

## Boundaries

- Do NOT add `:active` to the rail hit areas (the touch scrub already gives feedback).
- Do NOT gate `:active` behind hover media queries; it must work on touch.

## Verification

- Real iPhone (open `http://<mac-lan-ip>:3000`, dev server started with `-H 0.0.0.0`): every control in the table visibly reacts the instant it is touched.
- Desktop: clicks still feel crisp, no lingering scale.
