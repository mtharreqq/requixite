"use client";

import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { TagPill } from "@/components/work/tag-pill";
import type { Project } from "@/types/project";
import { WORST_EMPTY, WORST_ONE, WORST_PROJECTS } from "@/data/projects.worst";
import { DevDataToggle, useDevDataset } from "@/components/dev/data-toggle";

function displayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "");
  }
}

function ProjectPreview({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="bg-muted border-border/50 relative aspect-video w-full overflow-hidden rounded-[2px] border">
        <Image
          src={project.image}
          alt={`${project.title} website`}
          fill
          sizes="(min-width: 768px) 576px, 100vw"
          className="object-cover object-top transition-transform duration-300 group-hover/card:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div className="bg-muted border-border/50 relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[2px] border">
      <div
        className="absolute inset-0 opacity-15 transition-transform duration-300 group-hover/card:scale-105"
        style={{ backgroundColor: project.color }}
      />
      <span className="text-foreground z-10 text-xs font-semibold tracking-tight">
        {project.title}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured: boolean;
}) {
  return (
    <div
      className="project-tactile group/card border-border/70 bg-card/40 hover:border-border hover:bg-card/70 flex w-full min-w-0 flex-col space-y-2 rounded-[4px] border p-3 transition-colors"
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--spotlight-x",
          `${event.clientX - bounds.left}px`,
        );
        event.currentTarget.style.setProperty(
          "--spotlight-y",
          `${event.clientY - bounds.top}px`,
        );
      }}
    >
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
        >
          <ProjectPreview project={project} />
        </a>
      ) : (
        <ProjectPreview project={project} />
      )}

      {/* Meta & Title */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="shrink-0">
          <TagPill
            name={project.category.name}
            color={project.category.color}
            size="sm"
          />
        </span>
        <div className="flex min-w-0 items-center gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex min-w-0 items-center gap-0.5 text-[11px] transition-colors"
              aria-label={`Visit ${project.title}`}
              title={displayHost(project.liveUrl)}
            >
              <span className="truncate">{displayHost(project.liveUrl)}</span>
              <ArrowUpRight className="size-3.5 shrink-0" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
              aria-label={`${project.title} source code`}
            >
              <Github className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-foreground text-sm font-semibold [overflow-wrap:anywhere]">
          {project.title}
        </h3>
        {project.role && (
          <p className="text-muted-foreground text-[11px]">{project.role}</p>
        )}
      </div>

      <p
        className={`text-muted-foreground font-sans text-xs leading-relaxed [overflow-wrap:anywhere] ${featured ? "" : "line-clamp-2"}`}
      >
        {project.description}
      </p>

      {featured && project.highlights && (
        <ul className="flex flex-col gap-2 pt-1">
          {project.highlights.map((h) => (
            <li key={h.title} className="font-sans text-xs leading-relaxed">
              <span className="text-foreground font-medium">{h.title}.</span>{" "}
              <span className="text-muted-foreground">{h.description}</span>
            </li>
          ))}
        </ul>
      )}

      {featured && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border-border/60 bg-muted/60 text-muted-foreground rounded-[2px] border px-1.5 py-0.5 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkSection() {
  const dataset = useDevDataset();
  const source =
    dataset === "worst"
      ? WORST_PROJECTS
      : dataset === "one"
        ? WORST_ONE
        : dataset === "empty"
          ? WORST_EMPTY
          : PROJECTS;
  const publishedProjects = source.filter((p) => p.published);
  const featured = publishedProjects.length === 1;

  return (
    <section id="work" className="w-full space-y-4">
      {/* Header */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold tracking-wider uppercase">
              Selected Work
            </h2>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-y-4 font-sans text-sm leading-relaxed md:text-base">
          <p>
            Live products I designed and built from first sketch to production.
            More are on the way.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        className={`grid w-full grid-cols-1 gap-4 pt-2 ${featured ? "" : "sm:grid-cols-2"}`}
      >
        {publishedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} featured={featured} />
        ))}
      </div>
      <DevDataToggle current={dataset} />
    </section>
  );
}
