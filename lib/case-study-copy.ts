import type { Locale } from "@/lib/portfolio-copy";

// ponytail: one case study, so one copy object. Turn into a list keyed by slug
// when a second project gets its own page.
const english = {
  title: "rantai.dev, from AI-built to finished",
  description:
    "How I took RantAI’s AI-built website and turned it into a clear, fast, bilingual site with its own CMS.",
  meta: [
    ["Client", "RantAI"],
    ["Role", "Design and development"],
    ["Timeline", "2026, ongoing"],
  ],
  visit: "Visit rantai.dev",
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

export type CaseStudyCopy = typeof english;

const indonesian: CaseStudyCopy = {
  title: "rantai.dev, dari buatan AI jadi rapi",
  description:
    "Bagaimana saya mengubah website RantAI yang dibuat dengan AI jadi situs yang jelas, cepat, dua bahasa, dan punya CMS sendiri.",
  meta: [
    ["Klien", "RantAI"],
    ["Peran", "Desain dan pengembangan"],
    ["Waktu", "2026, masih berjalan"],
  ],
  visit: "Buka rantai.dev",
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
        "Saya mulai di Figma, mencoba beberapa arah hero berdampingan: headline polos, grid produk, dan adegan yang menampilkan produknya sedang berjalan. Yang terakhir menang, karena menunjukkan hasil kerjanya, bukan sekadar menjelaskan.",
        "Dari situ, setiap halaman saya susun di sekitar satu pertanyaan pengunjung: ini apa, bisa bantu saya apa, dan bagaimana mulainya.",
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
  stack: english.stack,
};

export function getCaseStudyCopy(locale: Locale): CaseStudyCopy {
  return locale === "id" ? indonesian : english;
}
