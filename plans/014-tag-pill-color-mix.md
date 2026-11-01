# 014 — TagPill: tint with color-mix so any CSS colour works

- **Status**: TODO
- **Commit**: bdceefd
- **Severity**: LOW (break-ui: Ugly / Fragile)
- **Category**: Break-ui / data
- **Estimated scope**: 1 file (`components/work/tag-pill.tsx`)

## Problem

`withAlpha` parses only 6-digit hex. A 3-digit hex (`#F59`), a named colour or `oklch(...)` yields `rgba(NaN, …)`, so the pill loses its background and border (seen with `/?data=worst`, card "Qi").

```tsx
// components/work/tag-pill.tsx:9-15, 21-22 — current
function withAlpha(hex: string, alpha: number): string { ...parseInt(m.slice(0, 2), 16)... }
const bg = withAlpha(color, 0.12);
const border = withAlpha(color, 0.4);
```

## Target

```tsx
const bg = `color-mix(in srgb, ${color} 12%, transparent)`;
const border = `color-mix(in srgb, ${color} 40%, transparent)`;
```

Delete `withAlpha`. `color-mix` is already used in this repo (`app/globals.css:109`).

## Verification

- `/?data=worst`: the "App" pill on "Qi" has a pink tint and border.
- `/?data=demo`: the RantAI pill looks identical to before (12% / 40% of `#3B82F6`).
