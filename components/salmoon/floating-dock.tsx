"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Home,
  ShieldAlert,
  SlidersHorizontal,
  FolderGit2,
  Mail,
  Sun,
  Moon,
} from "lucide-react";

export function FloatingDock() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const items = [
    { label: "Home", href: "#home", icon: Home },
    { label: "Dilemma", href: "#dilemma", icon: ShieldAlert },
    { label: "Proof", href: "#proof", icon: SlidersHorizontal },
    { label: "Work", href: "#work", icon: FolderGit2 },
    { label: "Connect", href: "#contact", icon: Mail },
  ];

  return (
    <nav
      aria-label="Floating Navigation Dock"
      className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit rounded-xl border border-border/80 bg-popover/90 p-1 shadow-lg backdrop-blur-md"
    >
      <div className="relative flex items-center gap-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className="group/dock text-muted-foreground hover:text-foreground relative flex size-9 items-center justify-center rounded-lg p-2 text-sm transition-colors focus-visible:outline-hidden"
              aria-label={item.label}
            >
              <Icon className="size-4" />
              {/* Tooltip */}
              <span className="bg-popover text-popover-foreground pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 -translate-y-1 scale-90 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium opacity-0 shadow-sm transition-all duration-150 ease-out group-hover/dock:translate-y-0 group-hover/dock:scale-100 group-hover/dock:opacity-100 md:block">
                {item.label}
              </span>
            </a>
          );
        })}

        {/* Vertical Divider */}
        <div className="bg-border/60 mx-1 h-4 w-px" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="group/dock text-muted-foreground hover:text-foreground relative flex size-9 items-center justify-center rounded-lg p-2 text-sm transition-colors focus-visible:outline-hidden cursor-pointer"
          aria-label="Toggle Theme"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="size-4 text-amber-400 transition-transform duration-200 group-hover/dock:rotate-45" />
          ) : (
            <Moon className="size-4 text-indigo-500 transition-transform duration-200 group-hover/dock:-rotate-12" />
          )}
          <span className="bg-popover text-popover-foreground pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 -translate-y-1 scale-90 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium opacity-0 shadow-sm transition-all duration-150 ease-out group-hover/dock:translate-y-0 group-hover/dock:scale-100 group-hover/dock:opacity-100 md:block">
            Theme
          </span>
        </button>
      </div>
    </nav>
  );
}
