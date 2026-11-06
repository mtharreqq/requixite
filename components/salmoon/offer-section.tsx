"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Locale, PortfolioCopy } from "@/lib/portfolio-copy";
import { SplitReveal } from "@/components/salmoon/split-reveal";

// Starting prices per plan, in whole units. Free plan first.
const PRICES = {
  IDR: [0, 1_500_000, 3_000_000],
  USD: [0, 250, 600],
};

// Set by proxy.ts from Vercel's geo header. Missing (dev, other hosts): the
// page language decides.
const country = () => document.cookie.match(/(?:^|; )country=([A-Z]{2})/)?.[1];
const noop = () => () => {};

export function OfferSection({
  copy,
  locale,
}: {
  copy: PortfolioCopy["offer"];
  locale: Locale;
}) {
  const fallback = locale === "id" ? "ID" : "";
  const where = useSyncExternalStore(
    noop,
    () => country() ?? fallback,
    () => fallback,
  );
  const currency = where === "ID" ? "IDR" : "USD";
  const format = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: currency === "IDR" ? "compact" : "standard",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <section id="offer" className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SplitReveal
          text={copy.title}
          className="text-foreground text-sm font-bold tracking-wider uppercase"
        />
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.intro}
        </p>
      </div>
      <ul className="divide-border/70 border-border/70 divide-y border-y">
        {copy.plans.map((plan, i) => {
          const price = PRICES[currency][i];
          return (
            <li key={plan.name} className="flex flex-col gap-1.5 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-foreground text-sm font-semibold">
                  {plan.name}
                </h3>
                <p className="text-foreground shrink-0 text-sm font-medium tabular-nums">
                  {price ? (
                    <>
                      <span className="text-muted-foreground text-xs font-normal">
                        {copy.from}{" "}
                      </span>
                      {format.format(price)}
                    </>
                  ) : (
                    copy.free
                  )}
                </p>
              </div>
              <p className="text-muted-foreground max-w-[52ch] text-xs leading-relaxed">
                {plan.desc}
              </p>
              <p className="text-muted-foreground text-[11px]">{plan.time}</p>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground max-w-[44ch] text-[11px] leading-relaxed">
          {copy.note}
        </p>
        <a
          href="#contact"
          className="text-foreground inline-flex items-center gap-1.5 rounded-sm text-xs font-medium underline-offset-4 hover:underline"
        >
          {copy.cta}
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
