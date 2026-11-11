"use client";

import { useState, type ReactNode } from "react";
import { Tabs } from "radix-ui";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

const MODES = ["story", "summary", "points"] as const;
type Mode = (typeof MODES)[number];

/** The same me three ways: chips (the RantAI filter chips' sliding pill)
 * over the chosen text. Print shows the one that's picked. */
export function AboutModes({
  labels,
  ...panels
}: {
  labels: Record<Mode | "label", string>;
} & Record<Mode, ReactNode>) {
  const [mode, setMode] = useState<Mode>("story");
  return (
    <Tabs.Root
      value={mode}
      onValueChange={(v) => setMode(v as Mode)}
      className="flex flex-col gap-5"
    >
      <Tabs.List aria-label={labels.label} className="flex gap-2 print:hidden">
        {MODES.map((v) => (
          <Tabs.Trigger
            key={v}
            value={v}
            className={cn(
              "relative isolate inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors duration-200",
              mode === v
                ? "text-background border-transparent"
                : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {mode === v && (
              <m.span
                layoutId="about-mode"
                className="bg-foreground absolute inset-0 -z-10 rounded-full"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {labels[v]}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {MODES.map((v) => (
        <Tabs.Content
          key={v}
          value={v}
          className="data-[state=active]:animate-in fade-in-0 slide-in-from-bottom-1 flex flex-col gap-4 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none motion-reduce:animate-none"
        >
          {panels[v]}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
