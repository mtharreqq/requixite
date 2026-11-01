# 018 — Controls don't select text on long-press; no tap delay

- **Status**: DONE
- **Commit**: bdceefd
- **Severity**: LOW
- **Category**: Mobile-native
- **Estimated scope**: 1 file (`app/globals.css`)

## Problem

Long-pressing a button ("Copy email", Proof mode buttons, theme toggle) on iOS selects its label. Buttons and links also have `touch-action: auto` (measured), which can still incur double-tap-zoom delay on some iOS elements.

## Target

Add to the existing `@layer base` block in `app/globals.css`:

```css
button,
[role="button"] {
  user-select: none;
  -webkit-user-select: none;
}
button,
a,
[role="button"] {
  touch-action: manipulation;
}
```

Never on `body` or text: body copy, the email and project descriptions must stay selectable.

## Boundaries

- Do NOT add `-webkit-touch-callout: none` to links: long-press preview on external project links is useful.
- `touch-action` on the rail is set by its `touch-none` parent; `manipulation` on the anchors does not loosen it (touch-action intersects with ancestors).

## Verification

- iPhone: long-press "Copy email": no text selection loupe. Long-press a paragraph: text still selects.
