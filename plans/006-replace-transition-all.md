# 006 — Replace `transition-all` with explicit properties

- **Status**: TODO
- **Commit**: e1816d6
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 2 files, 3 class strings

## Problem

`transition-all` animates every property that changes, including ones that should snap (border width, font weight, padding, layout). In the Proof mode switcher the active button changes border, background, colour, shadow and font weight at once; with `transition-all` the border and box-shadow tween along with layout-affecting changes, off the compositor. The shared `Button` primitive has the same issue.

```tsx
// components/salmoon/proof-section.tsx:49-54 — current (same pattern at 64-69)
className={cn(
  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all",
  mode === "slop"
    ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 font-semibold shadow-xs"
    : "text-muted-foreground hover:text-foreground"
)}
```

```ts
// components/ui/button.tsx:8 — current (start of the cva base string)
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none ..."
```

## Target

- Mode switcher buttons (colour/background change = `ease`, 150ms):
  `transition-[color,background-color,border-color,box-shadow] duration-150 ease-[ease]`
- `Button` base: `transition-[color,background-color,border-color,box-shadow,opacity]`
  (keeps the default Tailwind duration/easing for this shared primitive; press-scale callers already pass `transition-transform`, which `tailwind-merge` resolves).

Additionally, the inactive switcher button has no border while the active one gains `border`, which shifts content by 1px when switching. Give both states a border and only change its colour:

- inactive branch: `"border border-transparent text-muted-foreground hover:text-foreground"`

## Repo conventions to follow

- Classes are composed with `cn` (`lib/utils.ts`, clsx + tailwind-merge). Tailwind v4 arbitrary properties `transition-[...]` are fine.

## Steps

1. `proof-section.tsx` line 50 and line 65: replace `transition-all` with `transition-[color,background-color,border-color,box-shadow] duration-150 ease-[ease]`.
2. `proof-section.tsx` lines 53 and 68: change the inactive branch string to `"border border-transparent text-muted-foreground hover:text-foreground"`.
3. `components/ui/button.tsx` line 8: replace `transition-all` with `transition-[color,background-color,border-color,box-shadow,opacity]`.

## Boundaries

- Do NOT change any other variant or size in `button.tsx`.
- Do NOT change the AnimatePresence card switch (plan 004).
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run lint`, `npm run build` pass; `grep -rn "transition-all" components/salmoon components/ui/button.tsx` returns nothing.
- **Feel check**:
  - Toggle the Proof switcher: colours and border fade in 150ms; the button labels do not jump by 1px.
  - The refined card's "Manage Account & Transfer" button still scales down on press (`active:scale-[0.98]`).
  - Hover any `Button` (default/outline): background change still fades.
- **Done when**: no `transition-all` remains in the touched files and the checks pass.
