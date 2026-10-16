"use client";

export function DilemmaSection() {
  return (
    <section id="dilemma" className="w-full space-y-4">
      {/* Section Title */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold uppercase tracking-wider font-mono">
              The Dilemma
            </h2>
          </div>
        </div>

        {/* Narrative Text */}
        <div className="text-muted-foreground flex flex-col gap-y-4 text-sm md:text-base leading-relaxed font-sans">
          <p>
            Code has become a commodity. Anyone can prompt an LLM to spin up a full-stack CRUD application in an afternoon.
          </p>
          <p>
            Yet velocity without taste has created an epidemic of <span className="text-foreground font-medium">&ldquo;AI Slop&rdquo;</span> &mdash; interfaces that technically execute, but suffer from clashing corner radii, asymmetric 11px paddings, inaccessible contrast, and erratic typography. Users subconsciously sense the lack of care, and credibility immediately plummets.
          </p>
          <p>
            This is where I come in. I don&apos;t just build features; I bridge design intent and engineering execution. I audit the microscopic discrepancies that AI ignores, ensuring your software commands trust and feels like a finished, enduring product.
          </p>
        </div>
      </div>
    </section>
  );
}
