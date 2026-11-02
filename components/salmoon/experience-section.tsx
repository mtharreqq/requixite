const EXPERIENCE = [
  {
    role: "Frontend Developer",
    org: "Telkomsigma",
    period: "2025 — Now",
    desc: "Building responsive, easier-to-use interfaces for internal enterprise apps with Next.js, React, Vue, shadcn/ui, and Tailwind CSS.",
  },
  {
    role: "Product Developer, Part-time",
    org: "RantAI",
    period: "2025 — Now",
    desc: "Designing, building, and shipping rantai.dev and its CMS, from Figma exploration to Vercel deployment.",
  },
  {
    role: "SEO Operator, Part-time",
    org: "Telkom University",
    period: "2024 — 2025",
    desc: "Improved search visibility for the university's websites and automated site checks with Playwright.",
  },
  {
    role: "Lab Assistant & Frontend Developer",
    org: "i-Smile Laboratory",
    period: "2023 — 2024",
    desc: "Designed landing pages for the lab and taught Artificial Intelligence practicum sessions.",
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="w-full space-y-4">
      {/* Header */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold uppercase tracking-wider">
              Experience
            </h2>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-y-4 text-sm md:text-base leading-relaxed font-sans">
          <p>
            Computer Engineering at Telkom University (GPA 3.93), then straight into shipping interfaces people use every day.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <ol className="flex w-full flex-col gap-y-5 pt-2">
        {EXPERIENCE.map((item) => (
          <li key={`${item.org}-${item.role}`} className="space-y-1">
            <div className="flex items-baseline justify-between gap-x-4">
              <h3 className="text-foreground min-w-0 text-sm font-semibold">
                {item.role}{" "}
                <span className="text-muted-foreground font-normal whitespace-nowrap">@ {item.org}</span>
              </h3>
              <span className="text-muted-foreground shrink-0 text-[11px]">
                {item.period}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-sans leading-relaxed">{item.desc}</p>
          </li>
        ))}
      </ol>

      {/* Recognition */}
      <p className="text-muted-foreground border-t border-border/40 pt-4 text-[11px] leading-relaxed">
        Gold Award, WINTEX 2023 &bull; 1st Place, UI/UX Centurion 2023 &bull; 2nd Runner-up, UI/UX JBC 2022
      </p>
    </section>
  );
}
