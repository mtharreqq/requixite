"use client";

import { ExternalLink, Github } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { TagPill } from "@/components/work/tag-pill";

export function WorkSection() {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <section id="work" className="w-full space-y-4">
      {/* Header */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold uppercase tracking-wider font-mono">
              Selected Work
            </h2>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-y-4 text-sm md:text-base leading-relaxed font-sans">
          <p>
            A collection of products, developer tools, and boutique design systems engineered with uncompromised precision.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        {publishedProjects.map((project) => {
          return (
            <div
              key={project.id}
              className="group/card w-full flex flex-col space-y-2 border border-border/70 rounded-[4px] p-3 bg-card/40 transition-colors hover:border-border hover:bg-card/70"
            >
              {/* Aspect Ratio Preview Banner */}
              <div className="bg-muted overflow-hidden rounded-[2px] aspect-video w-full relative flex items-center justify-center border border-border/50">
                <div
                  className="absolute inset-0 opacity-15 transition-transform duration-300 group-hover/card:scale-105"
                  style={{
                    backgroundColor: project.color,
                  }}
                />
                <div className="flex flex-col items-center justify-center gap-1 z-10">
                  <span className="text-3xl">
                    {project.art === "token" && "🌱"}
                    {project.art === "pulse" && "🍵"}
                    {project.art === "wave" && "🦌"}
                    {project.art === "mosaic" && "✨"}
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground tracking-tight">
                    {project.title}
                  </span>
                </div>
              </div>

              {/* Meta & Title */}
              <div className="flex items-center justify-between pt-1">
                <TagPill
                  name={project.category.name}
                  color={project.category.color}
                  size="sm"
                />
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`${project.title} live demo`}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`${project.title} source code`}
                    >
                      <Github className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-foreground text-sm font-semibold font-mono">
                {project.title}
              </h3>

              <p className="text-muted-foreground text-xs font-sans line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
