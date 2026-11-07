"use client";

import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";
import type { Locale, PortfolioCopy } from "@/lib/portfolio-copy";
import { SplitReveal } from "@/components/salmoon/split-reveal";
import { openChat } from "@/lib/chat-events";

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

  const RECOMMENDED = 1;

  return (
    <section id="offer" className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SplitReveal
          text={copy.title}
          className="text-foreground text-sm font-bold tracking-wider uppercase"
        />
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {copy.intro}
        </p>
      </div>
      <ul className="grid gap-3">
        {copy.plans.map((plan, i) => {
          const price = PRICES[currency][i];
          const featured = i === RECOMMENDED;
          return (
            <li
              key={plan.name}
              className={`bg-card relative flex flex-col rounded-2xl border p-5 ${
                featured
                  ? "border-foreground shadow-lg shadow-black/5"
                  : "border-border/80"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-foreground text-sm font-semibold">
                  {plan.name}
                </h3>
                {featured && (
                  <span className="bg-foreground text-background -my-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
                    {copy.recommended}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {plan.desc}
              </p>
              <p className="text-foreground mt-4 flex items-baseline gap-1.5 tabular-nums">
                {price ? (
                  <>
                    <span className="text-muted-foreground text-xs">
                      {copy.from}
                    </span>
                    <span className="text-3xl font-semibold tracking-tight">
                      {format.format(price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-semibold tracking-tight">
                    {copy.free}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => openChat(copy.ask.replace("{plan}", plan.name))}
                className={`tactile-control mt-4 h-9 w-full rounded-full text-sm font-medium transition-colors ${
                  featured
                    ? "bg-foreground text-background hover:bg-foreground/85"
                    : "border-border hover:bg-muted border"
                }`}
              >
                {plan.cta}
              </button>
              <ul className="border-border/60 mt-5 grid gap-2 border-t pt-4 sm:grid-cols-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-muted-foreground flex gap-2 text-xs leading-relaxed"
                  >
                    <Check
                      aria-hidden
                      className="text-foreground mt-0.5 size-3.5 shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {copy.note}
      </p>
    </section>
  );
}
