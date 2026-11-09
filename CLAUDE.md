# CLAUDE.md

Guidance for AI coding assistants in this repo. Also read `AGENTS.md` (motion standard, no monospace).

## Commands

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
- Prettier (`.prettierrc`, with `prettier-plugin-tailwindcss`); check types with `npx tsc --noEmit -p .`
- Lighthouse CI (`lighthouserc.json`) runs on every PR: mobile, performance and accessibility on one page of each kind.

## Architecture

Next.js 16 App Router, React 19, Tailwind v4, Framer Motion, Lenis. Fully static: no database, CMS or auth. Path alias `@/*` is the repo root.

The site sells polishing vibecoded apps. English lives at `/`, Indonesian at `/id`, as two route groups (`app/(english)`, `app/(indonesian)`) with their own root layouts; `components/site-layout.tsx` holds the shared shell and metadata. `proxy.ts` passes the Vercel country to a cookie for IDR/USD pricing.

- **Home** (`components/portfolio-page.tsx`): `ReviewStory` (`components/salmoon/review-story.tsx`), one pinned scroll story: hello, a vibecoded dashboard, feedback, handoff, then a composer with geo-priced plans. `ChatDialog` opens from any composer.
- **Sub-pages** (`components/sub-page.tsx`): `/about`, `/work`, `/contact` and the case study `/work/rantai` (`components/case-study-page.tsx`, with the live before/after demo in `rantai-live.tsx` and `rantai-panorama.tsx`). Each ends with a composer (`AskBox`), "Or look around first" links and the wordmark footer; Contact is just the composer.
- **Rail** (`components/salmoon/rail-nav.tsx`): navigation on every page, one tick per section; the avatar opens pages, theme and language.

## Content

All copy is typed TypeScript, one object per language with the same facts:

- `lib/portfolio-copy.ts`: home, sub-pages, pricing, contact, work list.
- `lib/case-study-copy.ts`: case studies.

Add a page in both route groups, then add it to `app/sitemap.ts`, `Suggestions` in `sub-page.tsx` and the rail menu.

## Brand

Requixite: **Precise. Exquisite. Requisite.** Independent product and web studio by Tharreq.
