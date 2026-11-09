import Image from "next/image";
import type { PortfolioCopy } from "@/lib/portfolio-copy";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SplitReveal } from "@/components/shared/split-reveal";

export function ExperienceSection({
  copy,
}: {
  copy: PortfolioCopy["experience"];
}) {
  return (
    <section id="experience" className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SplitReveal
          text={copy.title}
          className="text-foreground text-sm font-bold tracking-wider uppercase"
        />
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.intro}
        </p>
      </div>
      <Accordion type="multiple" className="w-full">
        {copy.items.map((item) => (
          <AccordionItem value={item.org} key={`${item.org}-${item.role}`}>
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="flex min-w-0 items-center gap-3">
                  <Image
                    src={`/logos/${item.logo}.png`}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 shrink-0 object-contain"
                  />
                  <span className="min-w-0 font-semibold">
                    {item.role}{" "}
                    <span className="text-muted-foreground font-normal">
                      @ {item.org}
                    </span>
                  </span>
                </span>
                <span className="text-muted-foreground shrink-0 text-[11px] font-normal">
                  {item.period}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>{item.desc}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="text-muted-foreground border-border/40 flex flex-col gap-2 border-t pt-4 text-[11px] leading-relaxed">
        <p>{copy.education}</p>
        <p>{copy.toolkit}</p>
        <p>{copy.recognition}</p>
      </div>
    </section>
  );
}
