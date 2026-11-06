<!-- BEGIN SERVER OPS -->
## Shared botserver context

Before server/project work on this host, read `/home/serveradmin/server-ops/README.md`, follow its canonical authority and coordination guides, and check relevant task records. Read this project's local guidance below and any nearest nested instructions as well. For owner-authorized server tasks, the shared policy replaces older blanket approval requirements for reversible deploy/restart and local commits; push still needs explicit owner approval. Keep existing profile/user privacy, domain safety and tool/platform restrictions. Update affected operational context and task evidence before finishing. If a tool does not resolve imports such as `@AGENTS.md`, read the referenced file explicitly.
<!-- END SERVER OPS -->


## Motion standard

Motion and scroll interactions follow `/Users/mtharreq/Code/rant-ai-landing-page` (GitHub repo of the RantAI landing page). Before building or changing an animation, find the closest pattern there and copy its structure, timing and spring values instead of inventing new ones. Key references: `src/app/[locale]/_components/home/home-solution.tsx` (inline logos in a sentence), `home-problem.tsx` and `home-process.tsx` (pinned step stories), `src/components/shared/split-reveal.tsx` (word reveal), `src/components/platform/expanding-panel.tsx`, `src/components/layout/smooth-scroll.tsx`. Conventions: copy `scrollYProgress` into a `useMotionValue` (sticky-safe), pinned sections as `h-[N svh]` plus sticky `100svh` stage, ease `[0.22, 1, 0.36, 1]`, springs only for discrete changes, phones get their own simpler path, reduced motion shows the finished state. Its monospace usage does not apply here.

## Owner typography preference

Do not use monospace fonts in the interface. Monospace is allowed only inside an actual terminal or console surface. Use the primary sans-serif font for labels, dates, URLs, technology names, counters, language controls, and other UI text. Do not use monospace merely to make the site look technical. Preserve this preference in future UI changes.
