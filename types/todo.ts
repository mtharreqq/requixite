import type { todos } from "@/lib/db/schema";

export type Todo = typeof todos.$inferSelect;
