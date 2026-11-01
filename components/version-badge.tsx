"use client";

import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Release } from "@/types/release";

type Props = {
  versions: Release[];
};

export function VersionBadge({ versions }: Props) {

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2">
          {versions[0]?.tag && (
            <Badge variant="outline" className="text-muted-foreground">
              {versions[0].tag}
            </Badge>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="py-1 pr-1 pl-4">
        <ScrollArea className="flex max-h-64 flex-col pr-3">
          {versions.map((v) => (
            <div
              key={v.tag}
              className="flex items-center justify-between border-b py-2 last:border-0"
            >
              <p className="text-xs font-medium">{v.tag}</p>
              <p className="text-muted-foreground text-xs">
                {dayjs(v.released_at).format("DD MMM YYYY")}
              </p>
            </div>
          ))}
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}
