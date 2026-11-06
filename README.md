# Requixite

> **Precise. Exquisite. Requisite.**  
> Independent product and web studio by Tharreq.

A clean, blazing-fast personal portfolio landing page built with Next.js 16 (Turbopack), React 19, Tailwind CSS v4, and Framer Motion. Zero databases, zero CMS complexity — all content is static, type-safe, and maintained directly in code.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion & GSAP
- **Icons & UI**: Radix UI / shadcn & Lucide Icons
- **Analytics**: Vercel Speed Insights & Analytics

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Languages and visual portfolio

- English lives at `/`; Bahasa Indonesia lives at `/id`. The ID / EN selector uses real links, so a selected language survives refresh and can be shared.
- Both routes render their own document language, description, canonical URL, language alternates, and Open Graph locale on the server. Separate root layouts keep the document language correct when switching languages.
- Editorial copy lives in `lib/portfolio-copy.ts`. Write for each language naturally while keeping the same facts. Project names, links, and technologies stay shared; Indonesian project descriptions live alongside the source data in `data/projects.ts`.
- A sticky toolkit story reveals natural-language phrases and inline Figma/React/Next.js/TypeScript/Tailwind/PostgreSQL tiles as the visitor scrolls. Reduced motion, short viewports, and print show the full story in normal flow. "See the difference" pins one wallet card and refines it as the visitor scrolls, one fix at a time: spacing (padding settles to 24px with measurement guides, corners align), then color (purple glow gives way to the theme), then type (calmer weights and sizes). Content never swaps; only CSS variables driven by scroll progress change. Reduced motion shows the refined card.
- The opening showcase layers three RantAI screenshots, with pointer tilt and progressive CSS scroll depth where supported. The four-step design study updates as its steps pass through the viewport on pointer-based desktops; selecting a step takes over from scrolling. Touch and reduced-motion visitors choose steps directly. Experience and project details expand on demand.
- Existing section reveals, contact magnetic controls, and social tooltips remain. Project cards are unboxed: screenshot, title, meta line, and a plain technology list. New motion uses transform and opacity for movement, with hover effects limited to fine pointers and reduced-motion fallbacks. Images and essential content remain available without JavaScript.
- Language selection changes the entire document. The portfolio keeps English as the default rather than guessing from browser settings.

## Managing Projects & Content

All portfolio items live in [`data/projects.ts`](data/projects.ts).

To add or update a project, simply edit the `PROJECTS` array:

```ts
{
  id: "my-project",
  slug: "my-project",
  title: "My Project",
  description: "A short synopsis of the project...",
  category: { slug: "product", name: "Product Studio", color: "#10B981" },
  color: "#10B981",
  art: "token",
  start_date: "2026-06-01",
  status: "in_progress", // "planning" | "in_progress" | "done"
  tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  highlights: [
    { title: "Key Feature", description: "Details..." }
  ],
  liveUrl: "https://example.com",
  repoUrl: "https://github.com/...",
  published: true,
}
```

Once modified, simply commit and push to Git.

## Commands

- `npm run dev` — Next.js dev server (Turbopack)
- `npm run build` — Prerender static production build
- `npm run start` — Serve the production build
- `npm run lint` — ESLint

## Visual reference

The November 2026 visual pass takes its cues from RantAI landing page v2.4.0 (`ae92ade`): layered product scenes, alternating contrast, and realistic interface studies that explain a process. Requixite keeps its compact personal-portfolio layout and native scrolling, with no new dependencies.

### Toolkit logos and disclosures

Toolkit tiles use square 1:1 containers and local original brand SVG assets; source revisions and licensing are in `public/brand-logos/SOURCES.md` and `LICENSE.txt`. The sticky story enters directly after the preceding section, then pins its measured content at the vertical center of the viewport. It does not add a full-viewport wrapper or leading blank space. Oversized content stays in normal flow.

Experience, project details, and the optional footer explanation share the shadcn/Radix Accordion in `components/ui/accordion.tsx`, with 220ms open / 180ms close transitions and a plus-to-minus indicator. Keyboard activation and reduced motion switch instantly. The repo already includes both shadcn and emil-design-eng skills under `.agents/skills/`.

The primary sans-serif font is used throughout the portfolio; monospace is reserved for actual terminal/console surfaces as recorded in AGENTS.md. Desktop process stages have a longer scroll distance and a 24px boundary dead band to avoid rapid stage switching.
