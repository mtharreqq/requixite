import type { Locale } from "@/lib/portfolio-copy";

export interface CaseStudyShot {
  name: string;
  image?: string;
  caption?: string;
  before?: string;
  after?: string;
}

export interface CaseStudyCopy {
  title: string;
  description: string;
  meta: [string, string][];
  visit: string;
  visitUrl: string;
  visitLabel?: string;
  repoUrl?: string;
  before?: string;
  after?: string;
  shots: CaseStudyShot[];
  sections: {
    title: string;
    body?: string[];
    list?: string[];
  }[];
  stackTitle: string;
  stack: string[];
}

const rantaiEnglish: CaseStudyCopy = {
  title: "rantai.dev, from AI‑built to finished",
  description:
    "How I took RantAI’s AI-built website and turned it into a clear, fast, bilingual site with its own CMS.",
  meta: [
    ["Client", "RantAI"],
    ["Role", "Design and development"],
    ["Timeline", "2026, ongoing"],
  ],
  visit: "Visit rantai.dev",
  visitUrl: "https://www.rantai.dev",
  visitLabel: "Live",
  before: "Built with AI",
  after: "Polished",
  shots: [
    { name: "Home", before: "before.jpg", after: "home.jpg" },
    { name: "Products", before: "products-before.jpg", after: "products.jpg" },
  ],
  sections: [
    {
      title: "The brief",
      body: [
        "RantAI builds AI agents, data platforms, and engineering teams for enterprise and government. Its first website was built with AI, fast, so the company could be online.",
        "It worked, but it didn’t explain what RantAI does, and it didn’t look like a company you’d trust with production systems. The team also needed to publish articles, Academy books, and team updates without asking a developer every time.",
      ],
    },
    {
      title: "What wasn’t working",
      list: [
        "A slider of all-caps slogans (“AI coders and optimizers”) instead of one clear sentence about the company.",
        "Products shown as empty square icons and vague lines, so nobody could see what they actually were.",
        "Several display fonts, wide letter spacing, and low-contrast grey text: it read as a template.",
        "Content hidden behind arrows and a slide counter, with no Indonesian version for local clients.",
        "No way for the team to update content themselves.",
      ],
    },
    {
      title: "Exploration",
      body: [
        "I started in Figma, trying hero directions side by side: a plain headline, a product grid, and a scene that shows the products running. The last one won, because it shows the work instead of describing it.",
        "From there I sketched each page around one question a visitor has: what is this, what can it do for me, and how do we start.",
      ],
    },
    {
      title: "Decisions, and why",
      list: [
        "One headline, “AI systems for real-world operations.” A visitor knows what RantAI does in one read, with no slider to wait for.",
        "Real product screens (Lakehouse, Agents, Claw) instead of icons, so the products feel real and specific.",
        "One sans-serif typeface in sentence case, with a clear size scale. Calmer, and easier to scan.",
        "Motion only where it explains something, like the pinned “How we work” steps. Phones get a simpler, lighter version.",
        "English and Indonesian versions with a language switch, so local and international clients both read it in their language.",
        "A CMS at /admin: a rich text editor with scheduled publishing, Academy books, team members, tags, and a thumbnail designer.",
      ],
    },
    {
      title: "The result",
      body: [
        "A site that says what RantAI does in the first second, shows the actual products, and works properly on phones. The team now publishes on their own.",
      ],
      list: [
        "Checked with axe for WCAG 2.1 AA accessibility.",
        "A preview image, sitemap, RSS, and structured data for every page.",
        "Cleaned article HTML, validated admin input, and rate-limited sign-in.",
      ],
    },
  ],
  stackTitle: "Built with",
  stack: [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS v4",
    "Motion",
    "Neon Postgres",
    "Drizzle ORM",
    "Tiptap",
    "Vercel",
  ],
};

const rantaiIndonesian: CaseStudyCopy = {
  title: "rantai.dev, dari buatan AI jadi rapi",
  description:
    "Bagaimana aku mengubah website RantAI yang dibuat dengan AI jadi situs yang jelas, cepat, dua bahasa, dan punya CMS sendiri.",
  meta: [
    ["Klien", "RantAI"],
    ["Peran", "Desain dan pengembangan"],
    ["Waktu", "2026, masih berjalan"],
  ],
  visit: "Buka rantai.dev",
  visitUrl: "https://www.rantai.dev",
  visitLabel: "Live",
  before: "Dibuat dengan AI",
  after: "Sudah dirapikan",
  shots: [
    { name: "Beranda", before: "before.jpg", after: "home.jpg" },
    { name: "Produk", before: "products-before.jpg", after: "products.jpg" },
  ],
  sections: [
    {
      title: "Brief",
      body: [
        "RantAI membangun AI agent, platform data, dan tim engineering untuk perusahaan dan pemerintah. Website pertamanya dibuat dengan AI, cepat, supaya perusahaannya segera online.",
        "Situsnya jalan, tapi tidak menjelaskan apa yang RantAI kerjakan, dan tidak terlihat seperti perusahaan yang bisa dipercaya untuk sistem production. Timnya juga perlu menerbitkan artikel, buku Academy, dan info tim tanpa harus minta tolong developer setiap kali.",
      ],
    },
    {
      title: "Yang belum berjalan",
      list: [
        "Slider berisi slogan huruf kapital (“AI coders and optimizers”), bukan satu kalimat jelas tentang perusahaannya.",
        "Produk ditampilkan sebagai ikon kotak kosong dan kalimat samar, jadi tidak ada yang tahu produknya seperti apa.",
        "Beberapa font display, jarak huruf lebar, dan teks abu-abu yang kurang kontras: terasa seperti template.",
        "Konten tersembunyi di balik tombol panah dan penghitung slide, tanpa versi bahasa Indonesia untuk klien lokal.",
        "Tim tidak bisa memperbarui konten sendiri.",
      ],
    },
    {
      title: "Eksplorasi",
      body: [
        "Aku mulai di Figma, mencoba beberapa arah hero berdampingan: headline polos, grid produk, dan adegan yang menampilkan produknya sedang berjalan. Yang terakhir menang, karena menunjukkan hasil kerjanya, bukan sekadar menjelaskan.",
        "Dari situ, setiap halaman aku susun di sekitar satu pertanyaan pengunjung: ini apa, bisa bantu aku apa, dan bagaimana mulainya.",
      ],
    },
    {
      title: "Keputusan, dan alasannya",
      list: [
        "Satu headline, “AI systems for real-world operations.” Pengunjung langsung tahu RantAI mengerjakan apa dalam sekali baca, tanpa menunggu slider.",
        "Tampilan produk asli (Lakehouse, Agents, Claw), bukan ikon, supaya produknya terasa nyata dan spesifik.",
        "Satu font sans-serif dengan huruf kapital biasa dan skala ukuran yang jelas. Lebih tenang, lebih gampang dipindai.",
        "Animasi hanya kalau menjelaskan sesuatu, seperti langkah “How we work” yang menempel saat di-scroll. Di HP versinya lebih sederhana dan ringan.",
        "Versi bahasa Inggris dan Indonesia dengan tombol ganti bahasa, jadi klien lokal dan internasional sama-sama membaca dalam bahasanya.",
        "CMS di /admin: editor teks dengan jadwal terbit, buku Academy, anggota tim, tag, dan pembuat thumbnail.",
      ],
    },
    {
      title: "Hasilnya",
      body: [
        "Situs yang langsung menjelaskan RantAI mengerjakan apa, menampilkan produk aslinya, dan nyaman dibuka di HP. Sekarang timnya menerbitkan konten sendiri.",
      ],
      list: [
        "Dicek dengan axe untuk aksesibilitas WCAG 2.1 AA.",
        "Gambar pratinjau, sitemap, RSS, dan structured data di setiap halaman.",
        "HTML artikel dibersihkan, input admin divalidasi, dan percobaan login dibatasi.",
      ],
    },
  ],
  stackTitle: "Dibangun dengan",
  stack: rantaiEnglish.stack,
};

const tap1English: CaseStudyCopy = {
  title: "TAP 1, top-down F1 racing in the browser",
  description:
    "How I built an accessible, 60 FPS Formula 1 browser game with Canvas2D, authentic weekend rules, and one-button controls.",
  meta: [
    ["Project", "TAP 1"],
    ["Role", "Game design, physics & frontend"],
    ["Timeline", "2026, ongoing"],
  ],
  visit: "Play TAP 1",
  visitUrl: "https://tap-1-race.vercel.app",
  visitLabel: "Live",
  repoUrl: "https://github.com/mtharreqq/tap-1",
  shots: [
    {
      name: "Paddock & Race Setup",
      image: "/work/tap-1/paddock.png",
      caption:
        "Race weekend hub with driver selection, wing downforce tuning, weather forecasts, and championship calendar.",
    },
    {
      name: "Lights Out & Race Simulation",
      image: "/work/tap-1/race.png",
      caption:
        "Sub-millisecond Canvas2D rendering featuring the 5 red lights, racing lines, telemetry HUD, and 22 AI cars.",
    },
    {
      name: "23 Real-Scale Circuits",
      image: "/work/tap-1/circuits.png",
      caption:
        "Circuit selector importing 2026 calendar layouts from GeoJSON centreline data, including Suzuka's crossover bridge.",
    },
  ],
  sections: [
    {
      title: "The brief",
      body: [
        "Formula 1 is notoriously technical: knockout qualifying segments, tyre degradation cliffs across five compounds, pit stop timing windows, safety car restarts, and active aerodynamics regulations. Most racing games demand a physical controller, a steering wheel rig, or complex multi-key bindings.",
        "The goal for TAP 1 was to make that motorsport depth immediately graspable to anyone—even someone who has never watched a Grand Prix—through one intuitive, physical gesture: tapping and holding.",
      ],
    },
    {
      title: "Why Canvas2D over WebGL or 3D",
      body: [
        "Modern web games frequently default to Three.js or heavy 3D WebGL engines, incurring megabytes of bundle size, heavy GPU power draw, and noticeable frame stutter on battery-powered mobile devices.",
        "For a top-down tactical racing game, a purpose-built Canvas2D pipeline with direct 2D path rasterization delivers sub-millisecond per-frame render times. With a decoupled simulation tick rate and cached track geometry, TAP 1 achieves a rock-solid 60 FPS across both desktop and mobile screens while simulating 22 cars, titanium floor sparks, tyre smoke, and wet weather rooster-tails.",
      ],
    },
    {
      title: "Decisions, and why",
      list: [
        "One-button driving mechanics: Hold to gas (or Hold to brake). Steering stays automatic along calculated racing lines, so players focus purely on reflex, braking points, and racecraft.",
        "Authentic race dynamics: 5 tyre compounds (Soft, Medium, Hard, Intermediate, Wet) with distinct wear cliffs, dynamic track wetness crossovers, pit lane speed limiters, and animated stops.",
        "Real-scale circuits: 23 circuits from 2026 calendar data imported from GeoJSON centrelines within 2% length tolerance, featuring per-side runoff barriers, variable track widths, and Suzuka’s figure-eight crossover bridge.",
        "Physical feel without 3D bloat: Titanium sparks over kerbs, skidmarks under heavy braking, wet spray rooster-tails, and synthesized WebAudio engine revs and radio broadcast chimes.",
        "React 19 & Tailwind v4 Paddock: A responsive management hub for choosing rules, customizing liveries, and tracking driver vs. constructor championship standings.",
      ],
    },
    {
      title: "The result",
      body: [
        "A playable educational racing prototype that launches instantly in any browser without installation or heavy asset downloads.",
      ],
      list: [
        "Rock-solid 60 FPS animation loop with < 1 ms physics execution step.",
        "Zero-latency touch targets tuned specifically for mobile portrait and landscape play.",
        "Full race weekend progression: Free Practice, Q1/Q2/Q3 qualifying, and Grand Prix race distances.",
      ],
    },
  ],
  stackTitle: "Built with",
  stack: [
    "Canvas2D",
    "TypeScript",
    "React 19",
    "Tailwind CSS v4",
    "Vite",
    "Web Audio API",
    "dnd-kit",
    "Playwright",
    "Vitest",
  ],
};

const tap1Indonesian: CaseStudyCopy = {
  title: "TAP 1, game balap F1 top-down di browser",
  description:
    "Bagaimana aku membangun game Formula 1 di browser pada 60 FPS dengan Canvas2D, aturan balap asli, dan kontrol satu tombol yang mudah dimainkan.",
  meta: [
    ["Project", "TAP 1"],
    ["Peran", "Game design, fisika & frontend"],
    ["Waktu", "2026, masih berjalan"],
  ],
  visit: "Mainkan TAP 1",
  visitUrl: "https://tap-1-race.vercel.app",
  visitLabel: "Live",
  repoUrl: "https://github.com/mtharreqq/tap-1",
  shots: [
    {
      name: "Paddock & Setup Balapan",
      image: "/work/tap-1/paddock.png",
      caption:
        "Hub balapan rapi dengan pilihan pembalap, setelan downforce sayap, prakiraan cuaca, dan kalender kejuaraan.",
    },
    {
      name: "Start Balapan & Simulasi Lintasan",
      image: "/work/tap-1/race.png",
      caption:
        "Rendering Canvas2D 60 FPS menampilkan lima lampu merah, racing line presisi, HUD telemetri, dan 22 mobil AI.",
    },
    {
      name: "23 Sirkuit Skala Asli",
      image: "/work/tap-1/circuits.png",
      caption:
        "Pilihan sirkuit kalender 2026 diimpor langsung dari data GeoJSON, termasuk jembatan layang Suzuka.",
    },
  ],
  sections: [
    {
      title: "Brief",
      body: [
        "Formula 1 terkenal rumit: kualifikasi sistem gugur (Q1/Q2/Q3), degradasi ban (5 kompon), strategi pit stop, safety car, hingga regulasi active aero 2026. Sebagian besar game balap menuntut controller, setir, atau kombinasi tombol keyboard yang rumit.",
        "Tujuan TAP 1 adalah membantu siapa saja—bahkan yang belum pernah menonton F1—memahami dinamika akhir pekan balapan melalui interaksi yang sangat sederhana: cukup tekan dan tahan satu tombol.",
      ],
    },
    {
      title: "Kenapa Canvas2D, bukan WebGL atau 3D",
      body: [
        "Game web masa kini sering kali langsung memilih Three.js atau engine WebGL besar yang berukuran puluhan megabyte dan rawan drop frame di ponsel.",
        "Untuk sudut pandang top-down yang bersih dan tajam, Canvas2D dengan kalkulasi langsung mampu merender tiap frame di bawah 1 milidetik. Dengan pemisahan loop fisika dan caching lintasan, TAP 1 berjalan stabil di 60 FPS di desktop maupun ponsel meski menampilkan 22 mobil AI, percikan api lantai mobil, kepulan asap ban, dan cipratan air hujan.",
      ],
    },
    {
      title: "Keputusan, dan alasannya",
      list: [
        "Aksesibilitas satu tombol: Mode Hold to gas atau Hold to brake. Kemudi berjalan otomatis mengikuti racing line, sehingga pemain fokus pada refleks start, titik pengereman, dan strategi pit.",
        "Dinamika balap autentik: 5 kompon ban (Soft, Medium, Hard, Intermediate, Wet) dengan kurva degradasi nyata, transisi basah lintasan, pit limiter 80 km/jam, dan waktu pit stop realistis.",
        "Sirkuit riil berskala akurat: 23 sirkuit kalender 2026 dari data GeoJSON dengan toleransi panjang di bawah 2%, lebar jalan variabel, dan render jembatan tumpang-tindih di sirkuit Suzuka.",
        "Game feel tanpa beban engine 3D: Partikel titanium sparks saat melibas kerb, skidmark ban saat hard braking, water rooster-tail saat hujan, serta audio sintetis WebAudio untuk raungan mesin V6 dan bunyi radio broadcast F1.",
        "Paddock modern dengan React 19 & Tailwind v4: Menu game dan manajemen kejuaraan dibangun dengan komponen UI yang responsif untuk desktop dan ponsel.",
      ],
    },
    {
      title: "Hasilnya",
      body: [
        "Prototipe edukatif yang siap dimainkan langsung di browser laptop maupun smartphone tanpa install apa pun.",
      ],
      list: [
        "Loop animasi stabil di 60 FPS dengan eksekusi fisika di bawah 1 ms per langkah.",
        "Target sentuh tanpa latensi yang disesuaikan untuk orientasi ponsel potret maupun lanskap.",
        "Progresi akhir pekan balapan lengkap: Latihan Bebas, Kualifikasi Q1/Q2/Q3, dan Grand Prix penuh.",
      ],
    },
  ],
  stackTitle: "Dibangun dengan",
  stack: tap1English.stack,
};

const studies: Record<string, Record<Locale, CaseStudyCopy>> = {
  rantai: { en: rantaiEnglish, id: rantaiIndonesian },
  "tap-1": { en: tap1English, id: tap1Indonesian },
};

export function getCaseStudyCopy(
  locale: Locale,
  slug: string = "rantai",
): CaseStudyCopy {
  return studies[slug]?.[locale] ?? studies.rantai[locale];
}

export function getAllCaseStudies(
  locale: Locale,
): { slug: string; copy: CaseStudyCopy }[] {
  return Object.entries(studies).map(([slug, study]) => ({
    slug,
    copy: study[locale],
  }));
}
