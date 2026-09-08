"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function BrandHoverCard() {
  return (
    <HoverCard>
      <HoverCardTrigger className="-ml-4" asChild>
        <Button variant={"ghost"} className="text-xl font-semibold sm:text-2xl font-mono tracking-tight">
          requixite
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <p className="font-mono leading-none font-semibold">req·ui·xite</p>
        <p className="text-muted-foreground font-mono text-xs leading-none font-medium mt-1">
          /ˈrek.wə.zɪt/
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          something that is necessary, essential, or indispensable.
        </p>
        <div className="mt-3 border-t pt-2 font-mono text-[11px] text-foreground/80 space-y-1">
          <p className="font-medium">Independent product & web studio by Tharreq</p>
          <p className="text-muted-foreground italic">&ldquo;Precise. Exquisite. Requisite.&rdquo;</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
