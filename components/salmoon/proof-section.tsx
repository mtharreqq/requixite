"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Mode = "slop" | "refined";

const EASE_OUT = [0.23, 1, 0.32, 1] as const; // matches --ease-out token

const cardMotion = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.2, ease: EASE_OUT },
};

// Blur masks the overlap so the two text states never visibly double-expose.
const textMotion = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(2px)" },
  transition: { duration: 0.2, ease: EASE_OUT },
};

function useMeasuredHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, height] as const;
}

export function ProofSection() {
  const [mode, setMode] = useState<Mode>("refined");
  const [activePin, setActivePin] = useState<string | null>(null);
  const [cardRef, cardHeight] = useMeasuredHeight<HTMLDivElement>();

  return (
    <section id="proof" className="w-full space-y-4">
      {/* Section Header */}
      <div className="w-full space-y-1">
        <div className="flex w-full flex-col">
          <div className="flex h-8 w-full items-center justify-between gap-x-4">
            <h2 className="text-foreground text-sm leading-none font-bold uppercase tracking-wider">
              The Proof
            </h2>
            <span className="text-xs text-muted-foreground">
              Interactive
            </span>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-y-3 text-sm md:text-base leading-relaxed font-sans">
          <p>
            An interactive comparison of raw AI generation versus human polish on a sample wallet card. Toggle below to inspect the microscopic details.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="p-1 rounded-lg bg-muted/60 border border-border/80 flex items-center gap-1 text-xs">
        <button
          onClick={() => {
            setMode("slop");
            setActivePin(null);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-[ease] active:scale-[0.98]",
            mode === "slop"
              ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 font-semibold shadow-xs"
              : "border border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertTriangle className="size-3.5 text-red-500" />
          Raw AI Prototype
        </button>
        <button
          onClick={() => {
            setMode("refined");
            setActivePin(null);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-[ease] active:scale-[0.98]",
            mode === "refined"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold shadow-xs"
              : "border border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          Requixite Refined
        </button>
      </div>

      {/* Interactive Card Stage */}
      <div className="border border-border/70 rounded-xl p-5 sm:p-7 bg-card/40 backdrop-blur-sm relative overflow-hidden flex flex-col items-center">
        {/* Height follows the active card; padding + negative margin keep the
            corner pins from being clipped by overflow-hidden. */}
        <motion.div
          className="-m-3 w-[calc(100%+1.5rem)] overflow-hidden p-3"
          initial={false}
          animate={{ height: cardHeight === "auto" ? "auto" : cardHeight + 24 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
        >
          <div ref={cardRef} className="relative flex w-full flex-col items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {mode === "slop" ? (
                <motion.div
                  key="slop-card"
                  {...cardMotion}
                  className="w-full max-w-sm relative"
                >
                  <div
                    style={{
                      padding: "13px 15px 9px 19px",
                      borderRadius: "26px",
                    }}
                    className="border-2 border-dashed border-red-500/40 bg-zinc-100 dark:bg-zinc-900 shadow-sm relative"
                  >
                    {/* Pin 1 */}
                    <Pin
                      active={activePin === "p1"}
                      onClick={() => setActivePin(activePin === "p1" ? null : "p1")}
                      className="absolute -top-2.5 -right-2.5"
                      placement="below-end"
                      variant="defect"
                      label="13px/19px asymmetric padding"
                    />

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                        MY WALLET
                      </span>
                      <span
                        style={{ borderRadius: "3px" }}
                        className="bg-purple-600/20 text-purple-700 dark:text-purple-300 text-[10px] px-1.5 py-0.5 border border-purple-500/30"
                      >
                        Active
                      </span>
                    </div>

                    <div className="mt-2">
                      <p className="text-[11px] text-zinc-500 font-sans">Total Net Balance</p>
                      <h4 className="text-2xl font-bold tracking-normal text-zinc-800 dark:text-zinc-200 mt-0.5">
                        $42,850.20
                      </h4>
                    </div>

                    <div
                      style={{ borderRadius: "7px", marginTop: "10px", padding: "7px 11px" }}
                      className="bg-zinc-200/60 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 relative font-sans text-xs"
                    >
                      <Pin
                        active={activePin === "p2"}
                        onClick={() => setActivePin(activePin === "p2" ? null : "p2")}
                        className="absolute -bottom-2.5 -left-2.5"
                        placement="above-start"
                        variant="defect"
                        label="7px inner vs 26px outer radius clash"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-[10px]">Monthly Cashflow</span>
                        <span className="text-green-600 font-bold text-[11px] flex items-center">
                          +14.2% <TrendingUp className="size-3 ml-0.5" />
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">Reconciliation pending 3 txns</p>
                    </div>

                    <button
                      style={{ borderRadius: "4px" }}
                      className="w-full mt-3 py-2 bg-purple-600 text-white font-sans text-xs font-semibold shadow-xs"
                    >
                      Quick Transfer Funds
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="refined-card"
                  {...cardMotion}
                  className="w-full max-w-sm relative"
                >
                  <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-sm relative">
                    {/* Pin 1 */}
                    <Pin
                      active={activePin === "p3"}
                      onClick={() => setActivePin(activePin === "p3" ? null : "p3")}
                      className="absolute -top-2.5 -right-2.5"
                      placement="below-end"
                      variant="refined"
                      label="Strict 24px (8px grid) spacing"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground tracking-tight font-medium">
                          Main &bull; Vault 01
                        </span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Synchronized
                      </span>
                    </div>

                    <div className="mt-3.5">
                      <span className="text-xs text-muted-foreground font-sans">Total Net Balance</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <h4 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                          $42,850.20
                        </h4>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                          +14.2%
                          <ArrowUpRight className="size-3.5 ml-0.5" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border/60 relative text-xs font-sans">
                      <Pin
                        active={activePin === "p4"}
                        onClick={() => setActivePin(activePin === "p4" ? null : "p4")}
                        className="absolute -bottom-2.5 -left-2.5"
                        placement="above-start"
                        variant="refined"
                        label="Harmonic concentric squircle radii"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">Autonomous Agent (MCP)</span>
                        <span className="text-foreground text-[11px] font-semibold">Active BYOK</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 border-t border-border/40">
                        <span>3 txns reconciled</span>
                        <span className="text-foreground">0.12s latency</span>
                      </div>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full mt-4 h-8 rounded-xl text-xs font-medium gap-1.5 shadow-xs transition-transform active:scale-[0.98]"
                    >
                      <CreditCard className="size-3.5" />
                      Manage Account &amp; Transfer
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Micro-Audit Points */}
        <div className="relative w-full mt-5 pt-4 border-t border-border/40 text-[11px] text-muted-foreground">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={mode} {...textMotion} className="space-y-1.5">
              {mode === "slop" ? (
                <>
                  <p className="text-red-500 font-medium">&bull; Asymmetric padding (13px top, 19px left, 9px bottom)</p>
                  <p className="text-red-500 font-medium">&bull; Radius collision (26px container vs 4px inner button)</p>
                  <p className="text-muted-foreground">&bull; Washed-out contrast &amp; zero tactile feedback</p>
                </>
              ) : (
                <>
                  <p className="text-emerald-500 font-medium">&bull; Strict 8px spatial grid rhythm (24px padding, 16px gaps)</p>
                  <p className="text-emerald-500 font-medium">&bull; Mathematically nested concentric radii</p>
                  <p className="text-muted-foreground">&bull; WCAG AAA typography contrast &amp; tactile micro-physics</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Pin({
  active,
  onClick,
  className,
  variant,
  label,
  placement,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  variant: "defect" | "refined";
  label: string;
  placement: "below-end" | "above-start";
}) {
  const isDefect = variant === "defect";
  const offset = placement === "below-end" ? -4 : 4;
  return (
    <div className={cn("z-20", className)}>
      <button
        onClick={onClick}
        className={cn(
          "size-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-md transition-transform hover:scale-110 active:scale-95",
          isDefect
            ? "bg-red-500 text-white border border-white dark:border-zinc-900"
            : "bg-emerald-500 text-white border border-white dark:border-zinc-900"
        )}
      >
        {isDefect ? "!" : "✓"}
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="label"
            className={cn(
              "absolute z-30 w-max max-w-56 px-2 py-1 rounded-md bg-popover border border-border text-popover-foreground text-[10px] leading-snug shadow-md",
              placement === "below-end"
                ? "top-full mt-1.5 right-0 origin-top-right"
                : "bottom-full mb-1.5 left-0 origin-bottom-left",
            )}
            // Grows out of the pin it belongs to.
            initial={{ opacity: 0, transform: `translateY(${offset}px) scale(0.96)` }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: `translateY(${offset}px) scale(0.96)` }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
