export type ProjectArt =
  | "mosaic"
  | "wave"
  | "rows"
  | "phone"
  | "token"
  | "rule"
  | "cal"
  | "pulse"
  | "tape"
  | "pen";

export type ProjectStatus = "planning" | "in_progress" | "done";

export interface ProjectCategory {
  id?: string;
  slug: string;
  name: string;
  color: string;
}

export interface ProjectHighlight {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  color: string;
  art: ProjectArt;
  start_date: string;
  end_date?: string | null;
  status: ProjectStatus;
  tags: string[];
  highlights?: ProjectHighlight[];
  liveUrl?: string;
  repoUrl?: string;
  published: boolean;
}

// Backward-compatibility alias so components that imported ProjectWithCategory continue working smoothly
export type ProjectWithCategory = Project;

export function statusToProgress(status: ProjectStatus): number {
  if (status === "done") return 100;
  if (status === "in_progress") return 50;
  return 0;
}

export function statusLabel(status: ProjectStatus): string {
  if (status === "done") return "Done";
  if (status === "in_progress") return "In progress";
  return "Planning";
}
