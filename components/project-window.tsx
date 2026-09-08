"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import type { Project } from "@/types/project";
import { statusLabel, statusToProgress, type ProjectStatus } from "@/types/project";
import { TagPill } from "@/components/work/tag-pill";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Props = {
  project: Project;
  onClose: () => void;
  z?: number;
  minimized?: boolean;
  onFocus?: () => void;
};

export function ProjectWindow({
  project,
  onClose,
  z = 30,
  minimized = false,
  onFocus,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <DesktopWindow
        project={project}
        onClose={onClose}
        z={z}
        minimized={minimized}
        onFocus={onFocus}
      />
    );
  }
  return <MobileSheet project={project} onClose={onClose} />;
}

function ProjectBody({ project }: { project: Project }) {
  const progress = statusToProgress(project.status as ProjectStatus);

  return (
    <div className="flex flex-col gap-4 p-5 font-mono text-sm">
      {/* Category & Dates */}
      <div className="flex flex-wrap items-center gap-2">
        {project.category && (
          <TagPill
            name={project.category.name}
            color={project.category.color}
            size="sm"
          />
        )}
        {project.start_date && (
          <span className="text-muted-foreground text-[11px]">
            {project.start_date}
            {project.end_date ? ` → ${project.end_date}` : " → present"}
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl leading-tight font-semibold tracking-tight">
          {project.title}
        </h3>
      </div>

      {/* Status & Progress Bar */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-[11px]">
          {statusLabel(project.status as ProjectStatus)}
        </span>
        <div className="bg-muted h-1.5 w-24 overflow-hidden rounded">
          <div
            className="bg-foreground h-full transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground font-sans text-sm leading-relaxed">
        {project.description}
      </p>

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <div className="border-border/60 bg-muted/20 flex flex-col gap-2 rounded-lg border p-3">
          <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5 text-amber-500" />
            Key Highlights
          </span>
          <div className="flex flex-col gap-2">
            {project.highlights.map((h, i) => (
              <div key={i} className="flex flex-col text-xs">
                <span className="text-foreground font-medium">{h.title}</span>
                <span className="text-muted-foreground font-sans text-xs">
                  {h.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Links */}
      {(project.liveUrl || project.repoUrl) && (
        <div className="border-border/50 flex flex-wrap items-center gap-2 border-t pt-3">
          {project.liveUrl && (
            <Button size="sm" variant="default" asChild className="h-8 gap-1.5 text-xs">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                Live Demo
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button size="sm" variant="outline" asChild className="h-8 gap-1.5 text-xs">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="size-3.5" />
                Source Code
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

type DesktopProps = Required<Pick<Props, "project" | "onClose">> &
  Pick<Props, "z" | "minimized" | "onFocus">;

function DesktopWindow({ project, onClose, z, minimized, onFocus }: DesktopProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 520, h: 440 });
  const [ready, setReady] = useState(false);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, wx: 0, wy: 0 });
  const resizeOrigin = useRef({ mx: 0, my: 0, w: 0, h: 0 });

  useEffect(() => {
    setPos({
      x: Math.round(window.innerWidth / 2 - 260),
      y: Math.round(window.innerHeight / 2 - 220),
    });
    setReady(true);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        setPos({
          x: dragOrigin.current.wx + e.clientX - dragOrigin.current.mx,
          y: dragOrigin.current.wy + e.clientY - dragOrigin.current.my,
        });
      }
      if (resizing.current) {
        setSize({
          w: Math.max(340, resizeOrigin.current.w + e.clientX - resizeOrigin.current.mx),
          h: Math.max(280, resizeOrigin.current.h + e.clientY - resizeOrigin.current.my),
        });
      }
    };
    const onUp = () => {
      dragging.current = false;
      resizing.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!ready) return null;

  return (
    <motion.div
      className="stage-keep bg-background/95 backdrop-blur-md fixed flex flex-col overflow-hidden rounded-xl border shadow-2xl"
      onMouseDown={() => onFocus?.()}
      animate={
        minimized
          ? { scale: 0.18, y: 320, opacity: 0, pointerEvents: "none" }
          : { scale: 1, y: 0, opacity: 1, pointerEvents: "auto" }
      }
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.6 }}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: 30 + (z ?? 0),
        transformOrigin: "50% 100%",
      }}
    >
      <div
        className="bg-muted/40 flex h-9 shrink-0 cursor-grab items-center gap-2 border-b px-3 select-none active:cursor-grabbing"
        onMouseDown={(e) => {
          onFocus?.();
          dragging.current = true;
          dragOrigin.current = {
            mx: e.clientX,
            my: e.clientY,
            wx: pos.x,
            wy: pos.y,
          };
        }}
      >
        <button
          className="size-3 shrink-0 rounded-full bg-red-500 transition-colors hover:bg-red-400"
          onClick={onClose}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Close window"
        />
        <span className="text-muted-foreground ml-1 truncate font-mono text-xs">
          {project.title}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <ProjectBody project={project} />
      </div>

      <div
        className="absolute right-0 bottom-0 size-5 cursor-se-resize"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onFocus?.();
          resizing.current = true;
          resizeOrigin.current = {
            mx: e.clientX,
            my: e.clientY,
            w: size.w,
            h: size.h,
          };
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="text-muted-foreground/40 absolute right-1.5 bottom-1.5"
        >
          <path
            d="M9 1L1 9M9 5L5 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}

function MobileSheet({ project, onClose }: Pick<Props, "project" | "onClose">) {
  return (
    <Sheet open={true} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono">{project.title}</SheetTitle>
        </SheetHeader>
        <ProjectBody project={project} />
      </SheetContent>
    </Sheet>
  );
}
