import type { Project } from "@/types/project";

export const PROJECTS: Project[] = [
  {
    id: "rantai",
    slug: "rantai",
    title: "RantAI",
    description:
      "Website and CMS for RantAI, an AI company building agents, data platforms, and engineering teams for enterprise and government. The first version was AI-generated and looked generic. I redesigned it in Figma and built it through to Vercel, design and full-stack.",
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
    tags: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "Neon Postgres",
      "Drizzle ORM",
      "Tiptap",
      "Vercel",
    ],
    highlights: [
      {
        title: "Products, Services, Academy & Insights",
        description:
          "Six public pages with scroll-driven motion that stays light and stable on phones.",
      },
      {
        title: "Custom CMS",
        description:
          "Admin dashboard for posts with scheduled publishing, Academy books, team members, tags, and a post thumbnail designer.",
      },
      {
        title: "SEO, security & accessibility",
        description:
          "Generated preview images, sitemap and RSS, JSON-LD, CSP and HSTS headers, and WCAG 2.1 AA checks with axe-core.",
      },
    ],
    image: "/work/rantai/home.jpg",
    compare: [
      ["/work/rantai/before.jpg", "/work/rantai/home.jpg"],
      ["/work/rantai/products-before.jpg", "/work/rantai/products.jpg"],
    ],
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
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Neon Postgres",
      "Drizzle ORM",
      "Better Auth",
      "MCP",
    ],
    highlights: [
      {
        title: "AI Financial Copilot",
        description:
          "Bring-your-own-key (BYOK) architecture for personal transaction categorization and predictive budgeting.",
      },
      {
        title: "Model Context Protocol (MCP)",
        description:
          "Exposes secure, OAuth-authenticated tools enabling desktop and AI agents to query balances and record entries.",
      },
      {
        title: "Multi-device Realtime Sync",
        description:
          "Optimistic updates and rock-solid account state synchronization across web and native clients.",
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
        description:
          "Zero-latency native HUD showing current token velocity and daily quota consumption.",
      },
      {
        title: "Multi-Provider Cost Breakdown",
        description:
          "Unified analytics comparing prompt and completion costs across multiple AI provider keys.",
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
        description:
          "Live visual simulator allowing users to mix, match, and reorder physical beads with instant pricing.",
      },
      {
        title: "Playful Mascot Universe",
        description:
          "Cohesive brand storytelling featuring original illustrations of Ruru the deer.",
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
        description:
          "Engineered with strict 4px grid rhythm, smooth corner squircle radii, and consistent interaction states.",
      },
      {
        title: "Physics-based Motion",
        description:
          "Framer Motion springs tuned for tactile, weighty, and responsive user feedback.",
      },
    ],
    repoUrl: "https://github.com/mtharreqq/sprout-ui",
    published: false,
  },
];

export const HAS_PUBLISHED_WORK = PROJECTS.some((p) => p.published);

// Names, technologies, links, and project facts stay shared across languages.
// Editorial copy is written for each audience rather than translated word for word.
type ProjectCopy = Pick<Project, "description" | "role" | "highlights"> & {
  category: string;
};
const INDONESIAN_PROJECTS: Record<string, ProjectCopy> = {
  rantai: {
    category: "Website perusahaan",
    role: "Desain, frontend & full-stack",
    description:
      "Website dan CMS untuk RantAI, perusahaan AI yang mengembangkan agen, platform data, serta tim engineering untuk perusahaan dan instansi pemerintah. Versi pertamanya dibuat dengan AI dan terlihat generik. Saya mendesain ulang di Figma lalu membangunnya sampai rilis di Vercel, dari desain hingga full-stack.",
    highlights: [
      {
        title: "Produk, layanan, Academy & tulisan",
        description:
          "Enam halaman publik dengan animasi mengikuti scroll yang tetap ringan dan stabil di ponsel.",
      },
      {
        title: "CMS sesuai kebutuhan",
        description:
          "Dashboard untuk mengelola tulisan, jadwal terbit, buku Academy, anggota tim, tag, serta desain thumbnail tulisan.",
      },
      {
        title: "SEO, keamanan & aksesibilitas",
        description:
          "Gambar pratinjau otomatis, sitemap, RSS, JSON-LD, header CSP dan HSTS, serta pengecekan WCAG 2.1 AA dengan axe-core.",
      },
    ],
  },
  cashava: {
    category: "Produk mandiri",
    description:
      "Aplikasi keuangan pribadi untuk banyak pengguna, dengan pencocokan anggaran otomatis, wawasan keuangan berbantuan AI menggunakan API key sendiri (BYOK), serta integrasi server MCP yang dilindungi OAuth.",
    highlights: [
      {
        title: "Asisten keuangan AI",
        description:
          "Menggunakan API key milik pengguna untuk mengelompokkan transaksi dan membantu memperkirakan anggaran.",
      },
      {
        title: "Model Context Protocol (MCP)",
        description:
          "Akses terautentikasi melalui OAuth agar aplikasi desktop dan agen AI bisa membaca saldo serta mencatat transaksi.",
      },
      {
        title: "Sinkronisasi antarperangkat",
        description:
          "Perubahan langsung terlihat di layar, dengan data akun yang tetap selaras antara web dan aplikasi native.",
      },
    ],
  },
  "token-tea": {
    category: "Aplikasi macOS",
    description:
      "Aplikasi ringan di menu bar macOS untuk memantau pemakaian token AI, biaya, latensi, dan batas pengeluaran dari OpenAI, Anthropic, Gemini, serta model lokal.",
    highlights: [
      {
        title: "Pantau dari menu bar",
        description:
          "Ringkasan pemakaian token dan kuota harian yang bisa dilihat tanpa membuka jendela lain.",
      },
      {
        title: "Bandingkan biaya antarpenyedia",
        description:
          "Rincian biaya input dan output dari beberapa API key dalam satu tampilan.",
      },
    ],
  },
  ruruuharaa: {
    category: "Web & kerajinan",
    description:
      "Brand gelang manik-manik buatan tangan dengan studio online interaktif. Bersama maskot rusa bernama Ruru, pengguna bisa mencoba susunan manik-manik lewat kanvas 2D.",
    highlights: [
      {
        title: "Rangkai manik-manik sendiri",
        description:
          "Coba kombinasi dan urutan manik-manik secara visual, lengkap dengan harga yang langsung diperbarui.",
      },
      {
        title: "Dunia kecil Ruru",
        description:
          "Cerita dan identitas brand yang menyatu lewat ilustrasi asli Ruru si rusa.",
      },
    ],
  },
  "sprout-ui": {
    category: "Komponen UI",
    description:
      "Kumpulan komponen React dan Tailwind CSS yang memperhatikan jarak antar elemen, interaksi kecil, animasi spring, serta navigasi keyboard yang aksesibel.",
    highlights: [
      {
        title: "Detail yang konsisten",
        description:
          "Ritme grid 4px, lengkungan sudut yang halus, dan respons interaksi yang seragam.",
      },
      {
        title: "Gerakan yang terasa alami",
        description:
          "Animasi spring Framer Motion yang diatur agar setiap interaksi terasa mantap dan responsif.",
      },
    ],
  },
};

export function getProjects(
  locale: import("@/lib/portfolio-copy").Locale,
): Project[] {
  if (locale === "en") return PROJECTS;
  return PROJECTS.map((project) => {
    const copy = INDONESIAN_PROJECTS[project.id];
    if (!copy)
      throw new Error(`Missing Indonesian project copy: ${project.id}`);
    return {
      ...project,
      ...copy,
      category: { ...project.category, name: copy.category },
    };
  });
}
