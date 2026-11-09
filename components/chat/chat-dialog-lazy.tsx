"use client";

import dynamic from "next/dynamic";

// The dialog only opens on demand, so its code (Radix Dialog, the thread)
// loads after the page has painted instead of competing with it.
export const ChatDialog = dynamic(
  () => import("@/components/chat/chat-dialog").then((m) => m.ChatDialog),
  { ssr: false },
);
