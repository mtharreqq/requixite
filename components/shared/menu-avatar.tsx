"use client";

import Image from "next/image";
import { openMenu } from "@/lib/menu-events";
import { cn } from "@/lib/utils";

/** My avatar, anywhere it shows up (by my chat bubbles, by the hello): a
 * tap opens the site menu, as the rail's avatar does. */
export function MenuAvatar({
  label,
  size = 28,
  className,
  inline,
}: {
  label: string;
  size?: number;
  className?: string;
  /** Sizes to the text around it (1em), e.g. in the hello's first line. */
  inline?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      onClick={openMenu}
      className={cn(
        "group shrink-0 cursor-pointer rounded-full transition-[scale] duration-150 active:scale-90",
        // A block in the hello's inline wrapper, so the wrapper is exactly
        // 1em and its own vertical-align sets it on the line, as the plain
        // image did; an inline-block here sat on a line box of its own and
        // dropped low.
        inline && "block size-[1em]",
        className,
      )}
    >
      <Image
        src="/avatar.png"
        alt=""
        width={size}
        height={size}
        priority={inline}
        className={cn(
          "group-hover:ring-foreground/25 block rounded-full ring-0 transition-[box-shadow] duration-150 group-hover:ring-2",
          inline && "size-[1em]",
        )}
      />
    </button>
  );
}
