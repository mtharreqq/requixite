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
Zero database, zero external CMS, and zero server-side auth. The entire site is prerendered as a blazing-fast, intimate, story-driven portfolio inspired by Salmoon (`msafdev`).

TypeScript path alias `@/*` maps to the repository root.

### Core Narrative & Section Layout

The page communicates the studio thesis:
*AI builds apps in minutes. We make them feel human.*
Centered on an intimate column (`w-full max-w-lg md:max-w-xl mx-auto`) with uppercase tracked headers and generous vertical rhythm:

1. **Hero & Polaroid Stack** (`components/salmoon/hero-section.tsx`): Name (Tharreq) with verified blue checkmark badge, craft bio, and tilted polaroid cards (`Cashava`, `Token Tea`, `Ruruuharaa`) with handwritten-style labels.
2. **The Dilemma** (`components/salmoon/dilemma-section.tsx`): Editorial narrative exploring the explosion of AI-generated code vs. the epidemic of generic "AI Slop" and why sub-pixel polish builds trust.
3. **The Proof** (`components/salmoon/proof-section.tsx`): Real-time interactive inspection card comparing raw AI prototype defects against Requixite-refined geometry and typography with clickable inspection pins.
4. **My Process** (`components/salmoon/process-section.tsx`): 4-step refinement methodology with numbered square badges (De-slop, Harmonize, Ergonomics, Ship).
5. **Selected Work** (`components/salmoon/work-section.tsx`): 2-column card grid with 16:9 previews, subtle hover zoom, category tags, and direct links to Cashava, Token Tea, Ruruuharaa, and Sprout UI.
6. **Let's Connect** (`components/salmoon/connect-section.tsx`): Availability indicator and button grid (Copy Email, Send Mailto, X, GitHub, LinkedIn).
7. **Floating Dock** (`components/salmoon/floating-dock.tsx`): Compact bottom pill dock with quick-anchor links and theme toggle.

### Content & Data Layer

All portfolio content is maintained directly in static TypeScript data files:

- **Projects**: `data/projects.ts` (`PROJECTS` array typed by `types/project.ts`).
  - Add, reorder, or edit projects by modifying the array.
  - Supports `title`, `slug`, `description`, `category`, `color`, `art`, `tags`, `highlights`, `liveUrl`, `repoUrl`, `status`, and `published`.
- **Releases**: `data/releases.ts` (`RELEASES` array typed by `types/release.ts`).

### Brand Alignment (from Mori)

- Name: **Requixite**
- Tagline: **Precise. Exquisite. Requisite.**
- Descriptor: **Independent product and web studio by Tharreq**
