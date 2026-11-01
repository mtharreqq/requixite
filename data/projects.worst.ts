// Dev-only worst-case fixtures for the Work section (break-ui).
// Realistic values, not lorem ipsum. Never imported in production paths
// except through the dev-only toggle in components/dev/data-toggle.tsx.
import type { Project } from "@/types/project";

const base = {
  art: "rule",
  start_date: "2026-01-01",
  status: "in_progress",
  published: true,
} as const;

export const WORST_PROJECTS: Project[] = [
  {
    ...base,
    id: "w1",
    slug: "w1",
    title: "Portal Layanan Terpadu Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi",
    description:
      "Unified public-service portal for a national ministry: grant applications, teacher certification, school accreditation and research funding in one place. Replaced eleven legacy sites, migrated 2.4 million accounts, and passed a government accessibility audit on the first attempt.",
    category: { slug: "gov", name: "Government & Public Sector", color: "#3B82F6" },
    color: "#3B82F6",
    role: "Design lead, frontend, full-stack & DevOps (contract via Telkomsigma)",
    tags: ["Next.js"],
    image: "/work/rantai/home.jpg",
    liveUrl: "https://portal-layanan-terpadu.kemdikbudristek.go.id/beranda",
    repoUrl: "https://github.com/mtharreqq/portal-layanan-terpadu",
  },
  {
    ...base,
    id: "w2",
    slug: "w2",
    title: "Qi",
    description: "Tiny.",
    category: { slug: "app", name: "App", color: "#F59" },
    color: "#F59",
    tags: [],
    liveUrl: "https://qi.app",
    repoUrl: "https://github.com/mtharreqq/qi",
  },
  {
    ...base,
    id: "w3",
    slug: "w3",
    title: "NorthwindIndustriesHoldingsAnalyticsDashboard",
    description:
      "Internal analytics for bartholomew.fitzgerald@northwind-industries-holdings.example.com and 1,284 colleagues.",
    category: { slug: "client", name: "Client Work", color: "#10B981" },
    color: "#10B981",
    role: "Frontend",
    tags: ["React"],
    image: "/work/rantai/products.jpg",
    liveUrl:
      "https://northwind-industries-holdings.example.com/analytics/dashboard?utm_source=portfolio",
  },
  {
    ...base,
    id: "w4",
    slug: "w4",
    title: "東京デザインシステム 🌸 Tokyo Design System",
    description:
      "Đặt lịch hẹn nhanh chóng — Vietnamese and Japanese copy with diacritics and CJK line breaking, plus emoji in labels.",
    category: { slug: "intl", name: "国際 · International ✨", color: "#A855F7" },
    color: "#A855F7",
    tags: ["i18n"],
  },
];

// Exactly one published project switches the grid into "featured" mode.
export const WORST_ONE: Project[] = [
  {
    ...WORST_PROJECTS[0],
    tags: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "Neon Postgres",
      "Drizzle ORM",
      "Tiptap",
      "Vercel",
      "Playwright",
      "axe-core",
      "Sentry",
      "Upstash Redis",
      "Cloudflare Turnstile",
    ],
    highlights: [
      {
        title: "Single sign-on across eleven legacy services, including SIMPKB, Dapodik and Sister",
        description:
          "One account for 2.4 million teachers and lecturers, with staged migration and rollback per service.",
      },
      { title: "Search", description: "Instant." },
      {
        title: "Accessibility",
        description:
          "WCAG 2.1 AA on every public page, verified with axe-core in CI and a manual screen-reader pass with NVDA and VoiceOver.",
      },
    ],
  },
];

export const WORST_EMPTY: Project[] = [];
