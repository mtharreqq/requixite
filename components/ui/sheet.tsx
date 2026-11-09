"use client";

import { Dialog } from "radix-ui";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Past this far down, or flicked faster than this, a drag closes the sheet.
const CLOSE_AT = 80;
const FLICK = 0.5; // px per ms

/**
 * A bottom sheet, the way touch apps open a menu: it rises from the bottom
 * edge, dims the page, and closes on a tap outside, Escape, or a drag down
 * on its handle. Radix Dialog does the focus trap and the ARIA.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Read out and shown small above the content. */
  title: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef({ y: 0, t: 0, dy: 0, on: false });

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, t: e.timeStamp, dy: 0, on: true };
    panel.current?.style.setProperty("transition", "none");
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.on || !panel.current) return;
    // Down follows the finger; up gives a little, then stops.
    const dy = e.clientY - d.y;
    d.dy = dy > 0 ? dy : dy / 8;
    panel.current.style.transform = `translateY(${d.dy}px)`;
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const p = panel.current;
    if (!d.on || !p) return;
    d.on = false;
    const speed = d.dy / Math.max(e.timeStamp - d.t, 1);
    p.style.transition = "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)";
    if (d.dy > CLOSE_AT || speed > FLICK) {
      // Finish the slide from where the finger let go, then unmount without
      // the exit animation replaying from the top.
      p.dataset.dragged = "";
      p.style.transform = "translateY(100%)";
      setTimeout(() => onOpenChange(false), 240);
    } else {
      p.style.transform = "";
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[60] bg-black/40 duration-300" />
        <Dialog.Content
          ref={panel}
          aria-describedby={undefined}
          onCloseAutoFocus={() => {
            const p = panel.current;
            if (p) delete p.dataset.dragged;
          }}
          className={cn(
            "bg-popover text-popover-foreground border-border/80 fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-h-[85svh] w-full max-w-lg flex-col rounded-t-[28px] border border-b-0 pb-[max(env(safe-area-inset-bottom),12px)] shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-dragged:animate-none",
          )}
        >
          {/* The handle and title: grab here to pull the sheet down. */}
          <div
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="flex shrink-0 cursor-grab touch-none flex-col items-center gap-3 px-5 pt-2.5 pb-2 active:cursor-grabbing"
          >
            <span
              aria-hidden
              className="bg-muted-foreground/30 h-1 w-9 rounded-full"
            />
            <Dialog.Title className="text-muted-foreground self-start text-[13px] font-medium">
              {title}
            </Dialog.Title>
          </div>
          <div className="overflow-y-auto overscroll-contain px-2 pb-1">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** A row in a sheet: thumb height, full width, pressed state on touch. */
export const sheetRow =
  "text-foreground active:bg-muted aria-[current]:bg-muted/60 flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl px-3 text-[15px] transition-colors duration-150";
