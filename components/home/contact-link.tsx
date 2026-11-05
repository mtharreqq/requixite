"use client";

import { track } from "@vercel/analytics";

export function ContactLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: "whatsapp_click" | "email_click";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        track(event);
      }}
    >
      {children}
    </a>
  );
}
