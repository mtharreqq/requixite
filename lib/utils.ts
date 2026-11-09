import { clsx, type ClassValue } from "clsx";

// ponytail: plain clsx, no tailwind-merge (13 KB gz on every page). Callers
// never pass a class that fights a base class; if one ever must, drop the
// base class instead of reaching for a merge.
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
