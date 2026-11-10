import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A quick reply under a chat: a label and an icon, as a compact pill or as
 * a cell in a row inside one of my bubbles. On phones it takes the short
 * label, so a row of three fits; a pill's halo keeps a 44px target on
 * touch, a cell is 44px itself. Takes a href (a page) or an onClick, and
 * passes anything else on (a tooltip trigger's props). */
export function QuickReply({
  href,
  label,
  short,
  icon,
  cell,
  className,
  ...rest
}: {
  href?: string;
  label: string;
  short?: string;
  icon: ReactNode;
  /** A cell in a bubble's row of links instead of an outlined pill. */
  cell?: boolean;
} & Omit<ComponentProps<"button">, "children">) {
  const cls = cn(
    // group: the icon nudges toward where it goes on hover (see callers).
    "group flex cursor-pointer items-center gap-1",
    cell
      ? "hover:bg-foreground/[0.04] h-11 min-w-0 justify-center gap-1.5 px-2 text-[15px] transition-[background-color,opacity] active:opacity-60"
      : "hover:bg-muted bar:relative bar:before:absolute bar:before:inset-x-0 bar:before:-inset-y-1.25 h-9 shrink-0 rounded-full border px-3 text-[13px] transition-[background-color,scale] active:scale-95",
    className,
  );
  // A cell leads with its icon, like the rows in the site menu; a pill
  // trails it, like an arrow.
  const body = (
    <>
      {cell && icon}
      {short ? (
        <>
          <span className="md:hidden">{short}</span>
          <span className="max-md:hidden">{label}</span>
        </>
      ) : (
        label
      )}
      {!cell && icon}
    </>
  );
  if (href)
    return (
      <Link
        href={href}
        className={cls}
        {...(rest as Omit<ComponentProps<typeof Link>, "href">)}
      >
        {body}
      </Link>
    );
  return (
    <button type="button" className={cls} {...rest}>
      {body}
    </button>
  );
}
