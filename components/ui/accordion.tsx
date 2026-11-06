"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Accordion(
  props: React.ComponentProps<typeof AccordionPrimitive.Root>,
) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-border/50 border-b last:border-b-0", className)}
      {...props}
    />
  );
}
function AccordionTrigger({
  className,
  children,
  variant = "default",
  onClick,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  variant?: "default" | "compact" | "quiet";
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/disclosure text-foreground focus-visible:ring-ring flex flex-1 cursor-pointer items-baseline justify-between gap-3 rounded-sm text-left transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "py-4 text-sm font-medium",
          variant === "compact" && "py-3 text-xs font-medium",
          variant === "quiet" &&
            "text-muted-foreground decoration-muted-foreground/40 hover:text-foreground justify-center py-1 text-[11px] font-normal underline decoration-dotted underline-offset-4",
          className,
        )}
        onClick={(event) => {
          const item = event.currentTarget.closest<HTMLElement>(
            '[data-slot="accordion-item"]',
          );
          if (item) item.dataset.instant = String(event.detail === 0);
          onClick?.(event);
        }}
        {...props}
      >
        {children}
        {variant !== "quiet" && (
          <span aria-hidden="true" className="disclosure-indicator">
            <span />
            <span />
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="disclosure-content overflow-hidden text-sm"
      {...props}
    >
      <div
        className={cn("text-muted-foreground pb-4 leading-relaxed", className)}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
