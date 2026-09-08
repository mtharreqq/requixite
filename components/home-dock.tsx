"use client";

import { useEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import {
  FolderSvg,
  GithubSvg,
  LinkedinSvg,
  XSvg,
} from "@/components/dock-icons";
import { ProjectWindow } from "@/components/project-window";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import type { ProjectWithCategory } from "@/types/project";

type Props = {
  projects: ProjectWithCategory[];
};

type WindowState = {
  project: ProjectWithCategory;
  z: number;
};

export function HomeDock({ projects }: Props) {
  const mouseX = useMotionValue(Infinity);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [zCounter, setZCounter] = useState(1);
  const [stagedHidden, setStagedHidden] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);
  const isMobile = useMediaQuery("(max-width: 639px)");

  function openOrFocus(p: ProjectWithCategory) {
    setStagedHidden(false);
    setWindows((prev) => {
      const existing = prev.find((w) => w.project.id === p.id);
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      if (existing) {
        return prev.map((w) =>
          w.project.id === p.id ? { ...w, z: nextZ } : w,
        );
      }
      return [...prev, { project: p, z: nextZ }];
    });
  }

  function close(id: string) {
    setWindows((prev) => prev.filter((w) => w.project.id !== id));
  }

  function focusWindow(id: string) {
    setStagedHidden(false);
    setWindows((prev) => {
      const w = prev.find((x) => x.project.id === id);
      if (!w) return prev;
      if (w.z === zCounter) return prev;
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      return prev.map((x) => (x.project.id === id ? { ...x, z: nextZ } : x));
    });
  }

  function toggleStaged() {
    setStagedHidden((s) => !s);
  }

  useEffect(() => {
    if (isMobile) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest(".stage-keep")) return;
      if (windows.length === 0) return;
      toggleStaged();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isMobile, windows.length]);

  return (
    <>
      {windows.map((w) => (
        <ProjectWindow
          key={w.project.id}
          project={w.project}
          z={w.z}
          minimized={stagedHidden}
          onClose={() => close(w.project.id)}
          onFocus={() => focusWindow(w.project.id)}
        />
      ))}
      <div
        className={`stage-keep ${
          isMobile
            ? "fixed inset-x-0 bottom-3 z-40 px-3"
            : "fixed bottom-5 left-1/2 z-40 -translate-x-1/2"
        }`}
      >
        <motion.div
          onMouseMove={isDesktop ? (e) => mouseX.set(e.pageX) : undefined}
          onMouseLeave={isDesktop ? () => mouseX.set(Infinity) : undefined}
          className={
            isMobile
              ? "bg-background/30 flex w-full items-center gap-2 overflow-x-auto rounded-xl border px-3 py-2 shadow-sm backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "bg-background/30 flex items-end gap-2 rounded-xl border px-3 py-1 shadow-sm backdrop-blur-md"
          }
        >
          {projects.map((p) => {
            const isOpen = windows.some((w) => w.project.id === p.id);
            return (
              <DockItem
                key={p.id}
                mouseX={mouseX}
                label={p.title}
                active={isOpen && !stagedHidden}
                indicator={isOpen}
                onClick={() => openOrFocus(p)}
                magnify={isDesktop}
                compact={isMobile}
              >
                <FolderSvg color={p.color} />
              </DockItem>
            );
          })}

          {!isMobile && <div className="bg-border mx-2 h-8 w-px self-center" />}

          {!isMobile && (
            <>
              <DockItem
                mouseX={mouseX}
                label="GitHub"
                magnify={isDesktop}
                onClick={() =>
                  window.open(
                    "https://github.com/mtharreqq",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <GithubSvg />
              </DockItem>
              <DockItem
                mouseX={mouseX}
                label="X"
                magnify={isDesktop}
                onClick={() =>
                  window.open(
                    "https://x.com/tooreeq",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <XSvg />
              </DockItem>
              <DockItem
                mouseX={mouseX}
                label="LinkedIn"
                magnify={isDesktop}
                onClick={() =>
                  window.open(
                    "https://linkedin.com/in/mtharreq/",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <LinkedinSvg />
              </DockItem>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

function DockItem({
  mouseX,
  label,
  active,
  indicator,
  onClick,
  children,
  magnify,
  compact,
}: {
  mouseX: MotionValue<number>;
  label: string;
  active?: boolean;
  indicator?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  magnify: boolean;
  compact?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const b = ref.current?.getBoundingClientRect();
    return val - (b ? b.x + b.width / 2 : 0);
  });

  const scaleRaw = useTransform(distance, [-100, 0, 100], [1, 1.55, 1]);
  const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 200, damping: 14 });
  const yRaw = useTransform(distance, [-100, 0, 100], [0, -10, 0]);
  const y = useSpring(yRaw, { mass: 0.1, stiffness: 200, damping: 14 });

  const [hovered, setHovered] = useState(false);
  const showDot = indicator ?? active;

  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <AnimatePresence>
        {hovered && magnify && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.05 }}
            className="bg-background text-foreground absolute -top-10 rounded-md border px-2 py-1 font-mono text-[11px] whitespace-nowrap shadow-sm"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex cursor-pointer items-center justify-center ${compact ? "size-9" : "size-10"}`}
        style={magnify ? { scale, y } : undefined}
      >
        {children}
      </motion.button>
      <div
        className={`-mt-1 size-1 rounded-full transition-opacity ${
          showDot
            ? active
              ? "bg-foreground opacity-100"
              : "bg-foreground/40 opacity-100"
            : "opacity-0"
        }`}
      />
    </div>
  );
}
