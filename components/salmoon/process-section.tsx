"use client";

const STEPS = [
  {
    num: 1,
    title: "De-slop & Audit",
    desc: "Diagnose raw prototypes or legacy UIs for spatial violations, clashing corner radii, low-contrast text, and broken interaction states.",
  },
  {
    num: 2,
    title: "Harmonize Geometry",
    desc: "Rebuild the spatial grid on a strict 8px rhythm. Align inner component curves to follow mathematical concentric squircle nesting.",
  },
  {
    num: 3,
    title: "Tactile Ergonomics",
    desc: "Implement physics-based spring transitions, instant keyboard navigation states, and responsive touch ergonomics across all devices.",
  },
  {
    num: 4,
    title: "Production Polish",
    desc: "Ship clean, modular, accessible TypeScript/React code that looks breathtaking and performs instantly with zero bloat.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="w-full space-y-4">
      {/* Header */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold uppercase tracking-wider font-mono">
              My Process
            </h2>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-y-4 text-sm md:text-base leading-relaxed font-sans">
          <p>
            A disciplined, step-by-step approach to turning rough AI drafts into flagship digital products.
          </p>
        </div>
      </div>

      {/* Step Sequence */}
      <div className="relative flex w-full flex-col pt-2">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="relative grid grid-cols-6 gap-x-4 sm:grid-cols-8 [&:not(:last-child)]:mb-5"
          >
            {/* Number Pill */}
            <div className="flex items-start gap-x-3 col-span-2 sm:col-span-2">
              <div className="bg-muted text-foreground flex size-6 shrink-0 items-center justify-center rounded-[2px] border border-border/80 font-mono text-xs font-semibold">
                {step.num}
              </div>
              <h3 className="text-foreground text-sm font-semibold pt-0.5 font-mono">
                {step.title}
              </h3>
            </div>

            {/* Description */}
            <div className="col-span-4 sm:col-span-6 flex flex-col pt-0.5">
              <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
