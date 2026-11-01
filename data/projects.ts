import type { Project } from "@/types/project";

export const PROJECTS: Project[] = [
  {
    id: "rantai",
    slug: "rantai",
    title: "RantAI",
    description:
      "Website and CMS for RantAI, an AI company building agents, data platforms, and engineering teams for enterprise and government. I designed, built, and ship it end to end, from Figma to Vercel.",
    category: {
      slug: "client-work",
      name: "Product Website",
      color: "#3B82F6",
    },
    color: "#3B82F6",
    art: "rule",
    start_date: "2025-03-01",
    status: "in_progress",
    role: "Design, frontend & full-stack",
    tags: ["Next.js 16", "React 19", "Tailwind CSS v4", "Neon Postgres", "Drizzle ORM", "Tiptap", "Vercel"],
    highlights: [
      {
        title: "Products, Services, Academy & Insights",
        description: "Six public pages with scroll-driven motion that stays light and stable on phones.",
      },
      {
        title: "Custom CMS",
        description: "Admin dashboard for posts with scheduled publishing, Academy books, team members, tags, and a post thumbnail designer.",
      },
      {
        title: "SEO, security & accessibility",
        description: "Generated preview images, sitemap and RSS, JSON-LD, CSP and HSTS headers, and WCAG 2.1 AA checks with axe-core.",
      },
    ],
    image: "/work/rantai/home.jpg",
    liveUrl: "https://www.rantai.dev",
    published: true,
  },
  {
    id: "cashava",
    slug: "cashava",
    title: "Cashava",
    description:
      "A responsive multi-user personal finance platform featuring automated budget reconciliation, AI financial insights (BYOK), and OAuth-protected MCP server integration.",
    category: {
      slug: "product-studio",
      name: "Product Studio",
      color: "#10B981",
    },
    color: "#10B981",
    art: "token",
    start_date: "2026-06-01",
    status: "in_progress",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Neon Postgres", "Drizzle ORM", "Better Auth", "MCP"],
    highlights: [
      {
        title: "AI Financial Copilot",
        description: "Bring-your-own-key (BYOK) architecture for personal transaction categorization and predictive budgeting.",
      },
      {
        title: "Model Context Protocol (MCP)",
        description: "Exposes secure, OAuth-authenticated tools enabling desktop and AI agents to query balances and record entries.",
      },
      {
        title: "Multi-device Realtime Sync",
        description: "Optimistic updates and rock-solid account state synchronization across web and native clients.",
      },
    ],
    liveUrl: "https://cashava.web.id",
    published: false,
  },
  {
    id: "token-tea",
    slug: "token-tea",
    title: "Token Tea",
    description:
      "A lightweight, native macOS menu bar app for tracking AI model token usage, expenses, latency, and spend limits across OpenAI, Anthropic, Gemini, and local LLMs.",
    category: {
      slug: "mac-app",
      name: "macOS App",
      color: "#3B82F6",
    },
    color: "#3B82F6",
    art: "pulse",
    start_date: "2026-07-15",
    status: "in_progress",
    tags: ["Swift", "SwiftUI", "macOS", "AI APIs"],
    highlights: [
      {
        title: "Glanceable Menu Bar Metrics",
        description: "Zero-latency native HUD showing current token velocity and daily quota consumption.",
      },
      {
        title: "Multi-Provider Cost Breakdown",
        description: "Unified analytics comparing prompt and completion costs across multiple AI provider keys.",
      },
    ],
    published: false,
  },
  {
    id: "ruruuharaa",
    slug: "ruruuharaa",
    title: "Ruruuharaa",
    description:
      "Handcrafted bead bracelet brand and interactive online studio featuring the deer mascot Ruru, equipped with a 2D interactive canvas simulator for custom bead styling.",
    category: {
      slug: "web-craft",
      name: "Web & Craft",
      color: "#F59E0B",
    },
    color: "#F59E0B",
    art: "wave",
    start_date: "2026-08-01",
    status: "done",
    tags: ["Next.js", "HTML Canvas", "Tailwind CSS", "Design"],
    highlights: [
      {
        title: "Interactive Bead Arranger",
        description: "Live visual simulator allowing users to mix, match, and reorder physical beads with instant pricing.",
      },
      {
        title: "Playful Mascot Universe",
        description: "Cohesive brand storytelling featuring original illustrations of Ruru the deer.",
      },
    ],
    liveUrl: "https://ruruuharaa.vercel.app",
    published: false,
  },
  {
    id: "sprout-ui",
    slug: "sprout-ui",
    title: "Sprout UI",
    description:
      "A boutique React and Tailwind CSS UI library crafted with meticulous attention to spacing, micro-interactions, layout spring physics, and accessible keyboard navigation.",
    category: {
      slug: "ui-components",
      name: "UI Components",
      color: "#8B5CF6",
    },
    color: "#8B5CF6",
    art: "mosaic",
    start_date: "2026-01-10",
    end_date: "2026-05-01",
    status: "done",
    tags: ["React", "Tailwind CSS", "Framer Motion", "Radix UI"],
    highlights: [
      {
        title: "Sub-pixel Precision",
        description: "Engineered with strict 4px grid rhythm, smooth corner squircle radii, and consistent interaction states.",
      },
      {
        title: "Physics-based Motion",
        description: "Framer Motion springs tuned for tactile, weighty, and responsive user feedback.",
      },
    ],
    repoUrl: "https://github.com/mtharreqq/sprout-ui",
    published: false,
  },
];
