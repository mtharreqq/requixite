# 015 — Experience: keep "@ Org" together

- **Status**: DONE
- **Commit**: bdceefd
- **Severity**: LOW (break-ui: Ugly)
- **Category**: Break-ui / text
- **Estimated scope**: 1 file (`components/salmoon/experience-section.tsx`), 2 classes

## Problem

At 375px, "Product Developer, Part-time @ RantAI" wraps between "@" and "RantAI", leaving a dangling "@" at the end of the line.

```tsx
// components/salmoon/experience-section.tsx:53-56 — current
<h3 className="text-foreground text-sm font-semibold">
  {item.role}{" "}
  <span className="text-muted-foreground font-normal">@ {item.org}</span>
</h3>
```

## Target

- `<span>` gets `whitespace-nowrap` so "@ Org" moves as one unit.
- `<h3>` gets `min-w-0` so it can shrink next to the `shrink-0` period.

## Verification

- 320px and 375px: no line ends with a lone "@"; periods stay right-aligned.
