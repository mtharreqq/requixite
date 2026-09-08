# CLAUDE.md

This file provides guidance to Claude Code and other AI coding assistants working in this repository.

## Commands

- `npm run dev` — Next.js dev server (Turbopack)
- `npm run build` — production static build (Turbopack)
- `npm run start` — serve the production build
- `npm run lint` — ESLint (config: `eslint.config.mjs`, extends `eslint-config-next`)

Formatting uses Prettier (`.prettierrc`) with `prettier-plugin-tailwindcss`.

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 + Framer Motion.
Zero database, zero external CMS, and zero server-side auth. The entire site is prerendered as a blazing-fast static landing page.

TypeScript path alias `@/*` maps to the repository root.

### Content & Data Layer

All portfolio content is maintained directly in static TypeScript data files:

- **Projects**: `data/projects.ts` (`PROJECTS` array typed by `types/project.ts`).
  - Add, reorder, or edit projects by modifying the array.
  - Supports `title`, `slug`, `description`, `category`, `color`, `art`, `tags`, `highlights`, `liveUrl`, `repoUrl`, `status`, and `published`.
- **Releases**: `data/releases.ts` (`RELEASES` array typed by `types/release.ts`).
  - Displays version tags and changelogs in the header `VersionBadge`.

### UI Components

- **Header** (`components/home-header.tsx`): Brand Hover Card (`components/brand-hover-card.tsx`), Version Badge (`components/version-badge.tsx`), and Theme Toggler (`components/ui/animated-theme-toggler.tsx`).
- **Hero** (`components/home-main.tsx`): Interactive typewriter greetings, animated capability carousels, and studio brand ethos (*"Precise. Exquisite. Requisite."*).
- **macOS-style Dock** (`components/home-dock.tsx`): Smooth spring-physics floating dock at the bottom of the screen with quick access to projects and external profiles (GitHub, X, LinkedIn).
- **Project Window** (`components/project-window.tsx`): Draggable floating window on desktop with window controls (minimize, focus, close, z-index layering) and responsive bottom sheet on mobile devices.
- **UI Primitives**: Located under `components/ui/` (shadcn-style, new-york base). Compose with `cn()` from `lib/utils.ts`.

### Brand Alignment (from Mori)

- Name: **Requixite**
- Tagline: **Precise. Exquisite. Requisite.**
- Descriptor: **Independent product and web studio by Tharreq**
