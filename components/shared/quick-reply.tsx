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
  className,
  ...rest
}: {
  href?: string;
  label: string;
  short?: string;
  icon: ReactNode;
} & Omit<ComponentProps<"button">, "children">) {
  const cls = cn(
    "hover:bg-muted bar:relative bar:before:absolute bar:before:inset-x-0 bar:before:-inset-y-1 flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-3 text-[13px] transition-[background-color,scale] active:scale-95",
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
