# 005 — Group the social tooltips so only the first one waits

- **Status**: DONE
- **Commit**: e1816d6
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file (`components/salmoon/connect-section.tsx`), ~10 lines

## Problem

The four social icons each have a tooltip with `delayDuration={250}`. The shadcn `Tooltip` wrapper creates its own `TooltipProvider` per tooltip, so Radix's skip-delay logic never applies: moving the mouse across X, GitHub, LinkedIn, Instagram makes every tooltip wait 250ms and replay its zoom/slide entrance. Once the user is "in" a tooltip group, the next tooltips should appear instantly with no animation.

```tsx
// components/ui/tooltip.tsx:21-29 — current (shadcn wrapper)
function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}
```

```tsx
// components/salmoon/connect-section.tsx:100-122 — current
<div className="ml-auto flex gap-1.5">
  {SOCIALS.map(({ label, href, Icon }) => (
    <Tooltip key={label} delayDuration={250}>
      <TooltipTrigger asChild>
        <a ...>
          <Icon className="size-4" />
        </a>
      </TooltipTrigger>
      <TooltipContent sideOffset={8} className="motion-reduce:animate-none!">
        {label}
      </TooltipContent>
    </Tooltip>
  ))}
</div>
```

## Target

- One shared `TooltipProvider` for the group: `delayDuration={250}`, `skipDelayDuration={300}`.
- Use `TooltipPrimitive.Root` directly inside it (bypassing the per-tooltip provider in the shadcn wrapper) so the shared provider is the nearest one.
- Radix marks skip-delay opens with `data-state="instant-open"`; those get no entrance animation.

```tsx
// target
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider delayDuration={250} skipDelayDuration={300}>
  <div className="ml-auto flex gap-1.5">
    {SOCIALS.map(({ label, href, Icon }) => (
      <TooltipPrimitive.Root key={label}>
        <TooltipTrigger asChild>
          <a ...unchanged...>
            <Icon className="size-4" />
          </a>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={8}
          className="motion-reduce:animate-none! data-[state=instant-open]:animate-none!"
        >
          {label}
        </TooltipContent>
      </TooltipPrimitive.Root>
    ))}
  </div>
</TooltipProvider>
```

## Repo conventions to follow

- `@radix-ui/react-tooltip` is already a dependency and is imported the same way in `components/ui/tooltip.tsx:4` (`import * as TooltipPrimitive from "@radix-ui/react-tooltip"`).
- Keep `TooltipTrigger` / `TooltipContent` from the shadcn wrapper so styling stays shared.

## Steps

1. In `connect-section.tsx`, add `import * as TooltipPrimitive from "@radix-ui/react-tooltip";`.
2. Change the `@/components/ui/tooltip` import to `TooltipContent, TooltipProvider, TooltipTrigger` (drop `Tooltip`).
3. Wrap the `<div className="ml-auto flex gap-1.5">` block in `<TooltipProvider delayDuration={250} skipDelayDuration={300}>`.
4. Replace `<Tooltip key={label} delayDuration={250}>` / `</Tooltip>` with `<TooltipPrimitive.Root key={label}>` / `</TooltipPrimitive.Root>`.
5. Append `data-[state=instant-open]:animate-none!` to the `TooltipContent` className.

## Boundaries

- Do NOT edit `components/ui/tooltip.tsx` (it is a shared shadcn primitive also used by `sidebar.tsx`).
- Do NOT change the social link markup, classes or the `Magnetic` buttons.
- If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run lint`, `npm run build` pass.
- **Feel check** (mouse):
  - Hover X: tooltip appears after about 250ms with the normal fade/zoom.
  - Slide straight to GitHub, LinkedIn, Instagram: each tooltip appears immediately with no zoom/fade.
  - Leave the group for more than 300ms and come back: the first tooltip waits again.
  - Keyboard Tab through the icons: tooltips still open on focus.
- **Done when**: only the first tooltip of a sweep is delayed and animated.
