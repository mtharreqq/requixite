import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A quick reply under a chat: a compact pill with a label and an icon. On
 * phones it takes the short label, so a row of three fits without
 * scrolling; the halo keeps a 44px target on touch. Takes a href (a page)
 * or an onClick, and passes anything else on (a tooltip trigger's props). */
export function QuickReply({
  href,
  label,
  short,
  icon,
  bubble,
  className,
  ...rest
}: {
  href?: string;
  label: string;
  short?: string;
  icon: ReactNode;
  /** Dressed as one of my chat bubbles instead of an outlined pill. */
  bubble?: boolean;
} & Omit<ComponentProps<"button">, "children">) {
  const cls = cn(
    "bar:relative bar:before:absolute bar:before:inset-x-0 bar:before:-inset-y-1.25 flex h-9 shrink-0 cursor-pointer items-center gap-1 transition-[background-color,scale] active:scale-95",
    bubble
      ? "bg-muted hover:bg-foreground/[0.08] rounded-[20px] rounded-bl-md px-3.5 text-[15px]"
      : "hover:bg-muted rounded-full border px-3 text-[13px]",
    className,
  );
  const body = (
    <>
      {short ? (
        <>
          <span className="md:hidden">{short}</span>
          <span className="max-md:hidden">{label}</span>
        </>
      ) : (
        label
      )}
      {icon}
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
