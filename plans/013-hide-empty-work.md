# 013 — Hide the Work section (and its rail stop) when nothing is published

- **Status**: DONE
- **Commit**: bdceefd
- **Severity**: MEDIUM (break-ui: Ugly)
- **Category**: Break-ui / empty state
- **Estimated scope**: 4 files, ~10 lines

## Problem

With zero published projects the section still renders its header and "Live products I designed and built…" above an empty grid, and the rail still has a "Work" stop pointing at it. Decision (approved by the owner): hide the section entirely rather than show an empty promise.

## Target

- `data/projects.ts`: `export const HAS_PUBLISHED_WORK = PROJECTS.some((p) => p.published);`
- `app/page.tsx`: render `<SectionReveal><WorkSection /></SectionReveal>` only when `HAS_PUBLISHED_WORK`.
- `components/salmoon/rail-nav.tsx`: filter the rail stops at module level:
  ```ts
  const SECTIONS = ALL_SECTIONS.filter((s) => s.id !== "work" || HAS_PUBLISHED_WORK);
  ```
  (rename the existing array to `ALL_SECTIONS`; `TICKS`, `BAND` etc. keep deriving from `SECTIONS`.)
- `components/salmoon/work-section.tsx`: `if (publishedProjects.length === 0) return null;` after computing the list (covers the dev `?data=empty` toggle). The dev toggle must still render so you can switch back, so return `<DevDataToggle current={dataset} />` instead of `null` in that branch.

## Boundaries

- The dev `empty` state hides the section but not the rail stop (the rail reads static data). Acceptable for a dev-only tool.

## Verification

- `npx tsc --noEmit`, `npm run lint`.
- Temporarily set every project to `published: false` locally (do not commit): no Work section, rail shows 6 stops and scroll-tracking still lands on the right ones. Revert.
- `/?data=empty`: section gone, toggle still visible.
