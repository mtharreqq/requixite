export interface Release {
  id: number;
  version: string;
  tag: string;
  released_at: string | Date;
  commit_sha: string;
  notes: string;
}
