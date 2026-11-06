import type { PortfolioCopy } from "@/lib/portfolio-copy";

export function DilemmaSection({ copy }: { copy: PortfolioCopy["dilemma"] }) {
  return (
    <section id="dilemma" className="w-full space-y-5">
      <div className="space-y-2">
        <h2 className="text-foreground text-lg font-medium tracking-tight">
          {copy.title}
        </h2>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          {copy.summary}
        </p>
      </div>
      <div className="detail-triptych grid grid-cols-3 gap-2 sm:gap-3">
        {copy.qualities.map((quality, index) => (
          <div
            key={quality}
            className="detail-study border-border/70 bg-muted/25 min-w-0 overflow-hidden rounded-lg border px-2 py-4 sm:px-3"
          >
            <div
              aria-hidden="true"
              className={`detail-drawing detail-drawing-${index} relative mx-auto mb-4 flex h-16 max-w-24 flex-col justify-center gap-2`}
            >
              {index === 0 ? (
                <>
                  <span className="bg-foreground/80 h-2.5 w-3/4 rounded-sm" />
                  <span className="bg-muted-foreground/30 h-1 w-full rounded-full" />
                  <span className="bg-muted-foreground/30 h-1 w-5/6 rounded-full" />
                  <span className="bg-muted-foreground/20 h-1 w-3/5 rounded-full" />
                </>
              ) : index === 1 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {Array.from({ length: 6 }, (_, i) => (
                    <span
                      key={i}
                      className="border-foreground/20 bg-foreground/5 aspect-square rounded-[3px] border"
                    />
                  ))}
                </div>
              ) : (
                <div className="relative flex flex-col items-center gap-2">
                  <span className="interaction-target border-foreground/20 bg-background h-7 w-16 rounded-full border shadow-xs" />
                  <span className="interaction-pointer absolute top-4 left-1/2 text-lg">
                    ↖
                  </span>
                  <span className="bg-muted-foreground/20 h-1 w-10 rounded-full" />
                </div>
              )}
            </div>
            <p className="text-foreground text-center text-[11px] leading-snug font-medium sm:text-xs">
              {quality}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
