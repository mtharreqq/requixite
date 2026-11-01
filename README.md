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

## Portfolio Motion

The landing page keeps a compact hero with tactile interactions, using the existing Framer Motion dependency and CSS without requiring another animation package.

- Blur-and-rise reveals run throughout the page, including sections already visible on first load. Each section's content blocks enter in sequence once.
- Polaroids tilt on mouse movement; contact buttons have a small magnetic response.
- Project cards have pointer-following spotlights; social links use the existing Radix tooltips.
- Reduced-motion preferences disable decorative animation. Touch devices keep normal links and buttons without pointer-following effects.
- Content remains visible without JavaScript or IntersectionObserver support.

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
