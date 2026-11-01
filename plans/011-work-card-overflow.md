# 011 — Work card: keep long URLs and titles inside the card

- **Status**: DONE
- **Commit**: bdceefd
- **Severity**: HIGH (break-ui: Broken)
- **Category**: Break-ui / layout
- **Estimated scope**: 1 file (`components/salmoon/work-section.tsx`), ~10 lines

## Problem

Found with the dev toggle (`/?data=worst`):

- The live link renders the full URL minus protocol (`northwind-industries-holdings.example.com/analytics/dashboard?utm_source=portfolio`). It has no break opportunities and no truncation, so at 320px the whole document becomes 459px wide (horizontal scroll), and at 640px the link overlaps the neighbouring card and pushes the GitHub icon out.
- A single long word in the title (`NorthwindIndustriesHoldingsAnalyticsDashboard`) or an email in the description runs past the card edge.

```tsx
// components/salmoon/work-section.tsx:81-111 — current (meta row)
<div className="flex items-center justify-between pt-1">
  <TagPill name={project.category.name} color={project.category.color} size="sm" />
  <div className="flex items-center gap-2">
    {project.liveUrl && (
      <a href={project.liveUrl} ... className="text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 text-[11px] transition-colors" aria-label={`Visit ${project.title}`}>
        {project.liveUrl.replace(/^https?:\/\/(www\.)?/, "")}
        <ArrowUpRight className="size-3.5" />
      </a>
    )}
    {project.repoUrl && ( <a ... className="text-muted-foreground hover:text-foreground transition-colors"> <Github className="size-3.5" /> </a> )}
  </div>
</div>
```

## Target

- Show only the hostname (no `www.`), which is what identifies a site; the full URL stays in `href`.
- What yields when space runs out: the hostname truncates with an ellipsis (with `title` showing the full host). The category pill and the GitHub icon never shrink.
- Title and description break long words only when needed: `[overflow-wrap:anywhere]`.

```tsx
function displayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "");
  }
}

<div className="flex items-center justify-between gap-3 pt-1">
  <span className="shrink-0">
    <TagPill ... />
  </span>
  <div className="flex min-w-0 items-center gap-2">
    {project.liveUrl && (
      <a ... title={displayHost(project.liveUrl)}
         className="text-muted-foreground hover:text-foreground inline-flex min-w-0 items-center gap-0.5 text-[11px] transition-colors">
        <span className="truncate">{displayHost(project.liveUrl)}</span>
        <ArrowUpRight className="size-3.5 shrink-0" />
      </a>
    )}
    {project.repoUrl && ( <a ... className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"> ... </a> )}
  </div>
</div>
```

- `<h3>` title: add `[overflow-wrap:anywhere]`.
- Description `<p>`: add `[overflow-wrap:anywhere]`.
- Card root: add `min-w-0`.

## Steps

1. Add `displayHost` above `ProjectPreview`.
2. Apply the meta-row Target markup (classes only + the `<span>` wrappers + `title`).
3. Add `[overflow-wrap:anywhere]` to the title `<h3>` and description `<p>`; add `min-w-0` to the card root `div`.

## Boundaries

- Do NOT change the hover/tactile classes or `TagPill` itself (plan 014).
- Do NOT remove the dev toggle.

## Verification

- **Mechanical**: `npm run lint`, `npx tsc --noEmit`.
- `/?data=worst` at 320px: `document.documentElement.scrollWidth === innerWidth` (no horizontal scroll); at 640px the hostname truncates inside its card and the GitHub icon is visible.
- `/?data=demo`: RantAI card shows `rantai.dev` exactly as before.
- **Done when**: no worst-case value escapes its card at 320, 375, 640, 1280px.
