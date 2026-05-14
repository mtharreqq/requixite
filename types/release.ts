import type { releases } from "@/lib/db/schema";

export type Release = typeof releases.$inferSelect;
