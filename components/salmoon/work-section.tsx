"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { ArrowUpRight, Github } from "lucide-react";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import type { Project } from "@/types/project";

function displayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "");
  }
}

function ProjectPreview({
  project,
  copy,
}: {
  project: Project;
  copy: PortfolioCopy["work"];
}) {
  if (project.image) {
    return (
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={project.image}
          alt={`${copy.preview} ${project.title}`}
          fill
          sizes="(min-width: 768px) 520px, calc(100vw - 5.25rem)"
          className="object-cover object-top transition-transform duration-300 group-hover/card:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl">
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
  copy,
}: {
  project: Project;
  featured: boolean;
  copy: PortfolioCopy["work"];
}) {
  return (
    <article className="group/card flex w-full min-w-0 flex-col gap-4">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
        >
          <ProjectPreview project={project} copy={copy} />
        </a>
      ) : (
        <ProjectPreview project={project} copy={copy} />
      )}

      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-foreground text-sm font-semibold [overflow-wrap:anywhere]">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-xs">
            {[project.category.name, project.role].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 text-xs transition-colors"
              aria-label={`${copy.visit} ${project.title}`}
            >
              {displayHost(project.liveUrl)}
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${copy.source} ${project.title}`}
            >
              <Github className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      <p
        className={`text-muted-foreground font-sans text-xs leading-relaxed [overflow-wrap:anywhere] ${featured ? "" : "line-clamp-2"}`}
      >
        {project.description}
      </p>

      {featured && project.highlights && (
        <Accordion type="single" collapsible className="border-border border-y">
          <AccordionItem value="build">
            <AccordionTrigger variant="compact">
              {copy.details}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-2">
                {project.highlights.map((h) => (
                  <li
                    key={h.title}
                    className="font-sans text-xs leading-relaxed"
                  >
                    <span className="text-foreground font-medium">
                      {h.title}.
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {h.description}
                    </span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {featured && (
        <p className="text-muted-foreground text-xs">
          {project.tags.join(" · ")}
        </p>
      )}
    </article>
  );
}

export function WorkSection({
  projects,
  copy,
}: {
  projects: Project[];
  copy: PortfolioCopy["work"];
}) {
  const publishedProjects = projects.filter((p) => p.published);
  const featured = publishedProjects.length === 1;

  // Nothing published: hide the section rather than promise an empty grid.
  if (publishedProjects.length === 0) return null;

  return (
    <section id="work" className="w-full space-y-4">
      {/* Header */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold tracking-wider uppercase">
              {copy.title}
            </h2>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-y-4 font-sans text-sm leading-relaxed md:text-base">
          <p>{copy.intro}</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        className={`grid w-full grid-cols-1 gap-4 pt-2 ${featured ? "" : "sm:grid-cols-2"}`}
      >
        {publishedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            featured={featured}
            copy={copy}
          />
        ))}
      </div>
    </section>
  );
}
