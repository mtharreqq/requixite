import type { Release } from "@/types/release";

export const RELEASES: Release[] = [
  {
    id: 2,
    version: "0.6.1",
    tag: "requixite-v0.6.1",
    released_at: "2026-05-14T02:35:41.000Z",
    commit_sha: "7272f8b43340e80a144c897a948be0d24657e6fd",
    notes: "Release 0.6.1 - Maintenance and performance updates",
  },
  {
    id: 1,
    version: "0.6.0",
    tag: "requixite-v0.6.0",
    released_at: "2026-05-14T02:30:58.000Z",
    commit_sha: "d03edc60d6987a23b4f14c5196c0438411d9f787",
    notes: "Release 0.6.0 - Modern UI overhaul and theme toggler",
  },
];
