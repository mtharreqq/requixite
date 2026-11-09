"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--radix-hover-card-content-transform-origin) border outline-hidden",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

/**
 * Hover cards have no hover on a touch screen, so a tap opens (or closes) the
 * card instead. Spread `tap` on the trigger and pass `open`/`onOpenChange` to
 * the HoverCard; the mouse keeps its hover.
 */
function useTapOpen() {
  const [open, setOpen] = React.useState(false);
  // Read at pointerdown: tapping the trigger of an open card also counts as
  // a tap outside it, which closes it first.
  const was = React.useRef(false);
  const tap = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") was.current = open;
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") setOpen(!was.current);
    },
  };
  return { open, onOpenChange: setOpen, tap };
}

export { HoverCard, HoverCardTrigger, HoverCardContent, useTapOpen };
