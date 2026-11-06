export type Locale = "en" | "id";

export const english = {
  metadata:
    "Independent product and web studio by Tharreq. Thoughtful design, considered interactions, and websites built to be used.",
  language: "Language",
  hero: {
    headline: ["Thoughtfully designed.", "A pleasure to use."],
    summary:
      "I’m Tharreq, a product engineer and designer in Bandung. I turn ideas into websites that look considered and feel right.",
    featured: "Selected project · RantAI",
    explore: "Explore my work",
    contact: "Let’s talk",
    view: "Visit website",
    screens: "Project screenshots",
    contribution: "Design & code",
    profile:
      "Product engineer and designer in Bandung. Frontend at Telkomsigma, building rantai.dev on the side.",
    available: "Open to projects",
    role: "Product Engineer & Designer",
    polaroids: ["rantai.dev", "products", "insights ✨"],
    preview: "RantAI page preview",
  },
  dilemma: {
    title: "Good details. Better experiences.",
    qualities: [
      "Clear hierarchy",
      "Consistent rhythm",
      "Responsive interactions",
    ],
    summary:
      "AI gets a prototype running. I work on the details that make it feel ready for real people.",
  },
  process: {
    title: "How I work",
    intro: "Review. Align. Refine. Ship.",
    study: "Design study",
    stages: [
      "Find the rough edges",
      "Give it a consistent rhythm",
      "Make interactions respond",
      "Ready for the final checks",
    ],
    steps: [
      {
        title: "Look closely",
        desc: "Find the rough edges in spacing, contrast, and interaction states.",
      },
      {
        title: "Bring it together",
        desc: "Give spacing, type, and shapes one consistent visual language.",
      },
      {
        title: "Make it feel right",
        desc: "Tune motion, keyboard navigation, and touch targets.",
      },
      {
        title: "Get it ready to ship",
        desc: "Check accessibility and performance. Deliver code that’s easy to maintain.",
      },
    ],
  },
  experience: {
    title: "Experience",
    intro:
      "Computer Engineering, Telkom University · GPA 3.93. Now building interfaces people use every day.",
    items: [
      {
        role: "Frontend Developer",
        org: "Telkomsigma",
        period: "2025 — Now",
        desc: "Building responsive, easier-to-use interfaces for internal enterprise apps with Next.js, React, Vue, shadcn/ui, and Tailwind CSS.",
      },
      {
        role: "Product Developer, Part-time",
        org: "RantAI",
        period: "2025 — Now",
        desc: "Designing and developing rantai.dev and its CMS, from exploring ideas in Figma to deploying on Vercel.",
      },
      {
        role: "SEO Operator, Part-time",
        org: "Telkom University",
        period: "2024 — 2025",
        desc: "Improved search visibility for the university's websites and automated website checks with Playwright.",
      },
      {
        role: "Lab Assistant & Frontend Developer",
        org: "i-Smile Laboratory",
        period: "2023 — 2024",
        desc: "Designed the lab's landing pages and taught Artificial Intelligence practicum sessions.",
      },
    ],
    recognition:
      "Gold Award, WINTEX 2023 • 1st Place, UI/UX Centurion 2023 • 2nd Runner-up, UI/UX JBC 2022",
  },
  work: {
    title: "Selected work",
    intro:
      "Projects I've taken from the first sketch to a live website. More are on the way.",
    details: "Inside the build",
    visit: "Visit",
    source: "Source code for",
    preview: "Website preview of",
  },
  contact: {
    available: "Open to new projects",
    invitation:
      "Have an app or prototype you'd like to improve? Send it over. I'll give you an honest take on where I'd start.",
    copy: "Copy email",
    copied: "Email copied",
    copyFailed: "Couldn't copy. Try sending an email instead.",
    send: "Send email",
    subject: "Let's talk about a project — Requixite",
    made: "Made in Bandung",
    aboutName: "About Requixite",
    nameMeaning:
      "Requixite is my personal studio. Three words guide the work: Precise, for care in the details. Exquisite, for things worth looking at. Requisite, for what people actually need.",
  },
  rail: {
    navigation: "Page sections",
    theme: "Switch color theme",
    home: "Intro",
    dilemma: "Challenge",
    proof: "Comparison",
    stack: "Toolkit",
    process: "Process",
    work: "Work",
    experience: "Experience",
    contact: "Contact",
  },
  stack: {
    title: "From idea to interface",
    phrases: [
      "It starts in Figma.",
      "Takes shape in React and Next.js.",
      "Comes together with TypeScript, Tailwind, and PostgreSQL.",
    ],
    note: "Design and development, in the same pair of hands. The tools change; the attention to detail stays.",
  },
  proof: {
    title: "See the difference",
    intro:
      "One card, fixed one detail at a time as you scroll: spacing first, then color, then type.",
    account: "Main • Vault 01",
    balance: "Net balance",
    amount: "$42,850.20",
    growth: "+14.2%",
    cashflow: "Monthly cash flow",
    synced: "Up to date",
    reconciled: "3 transactions reconciled",
    manage: "Manage & transfer",
    phases: ["Vibecoded", "Spacing", "Color", "Type"],
    notes: [
      "Gradients, glow, and uneven spacing. Everything asks for attention, so nothing gets it.",
      "Spacing first: uneven 13, 19, and 11px padding settles onto one 24px rhythm, and the corners agree.",
      "Then color: the purple glow gives way to the theme. Color stays only where it means something.",
      "Finally type: lighter weights, calmer sizes, and no shouting letter-spacing.",
    ],
  },
};

export type PortfolioCopy = typeof english;

export const indonesian: PortfolioCopy = {
  metadata:
    "Studio produk digital dan web independen milik Tharreq. Desain yang dipikirkan matang, interaksi yang nyaman, dan website yang enak dipakai.",
  language: "Bahasa",
  hero: {
    headline: ["Rapi dilihat.", "Nyaman dipakai."],
    summary:
      "Saya Tharreq, product engineer dan designer dari Bandung. Saya mengubah ide jadi website yang rapi, nyaman, dan dipikirkan sampai detailnya.",
    featured: "Proyek pilihan · RantAI",
    explore: "Lihat karya saya",
    contact: "Yuk, ngobrol",
    view: "Buka website",
    screens: "Cuplikan proyek",
    contribution: "Desain & kode",
    profile:
      "Saya merancang dan membangun produk digital dari Bandung. Bekerja sebagai frontend developer di Telkomsigma, juga mengembangkan rantai.dev.",
    available: "Terbuka untuk proyek baru",
    role: "Product Engineer & Designer",
    polaroids: ["rantai.dev", "produk", "tulisan ✨"],
    preview: "Cuplikan halaman RantAI",
  },
  dilemma: {
    title: "Detail kecil, besar bedanya.",
    qualities: [
      "Informasi yang jelas",
      "Tampilan yang selaras",
      "Interaksi yang nyaman",
    ],
    summary:
      "AI membantu idenya jadi. Saya merapikan detailnya supaya hasilnya benar-benar enak dipakai.",
  },
  process: {
    title: "Cara saya bekerja",
    intro: "Cek. Selaraskan. Nyamankan. Rilis.",
    study: "Studi desain",
    stages: [
      "Cari yang kurang pas",
      "Selaraskan jarak dan bentuknya",
      "Buat interaksinya terasa",
      "Siap untuk pengecekan akhir",
    ],
    steps: [
      {
        title: "Cek dulu",
        desc: "Cari bagian yang kurang pas: jarak, kontras, dan respons interaksi.",
      },
      {
        title: "Rapikan dasarnya",
        desc: "Satukan jarak, tipografi, dan bentuk agar tampilannya selaras.",
      },
      {
        title: "Nyamankan interaksinya",
        desc: "Atur animasi, navigasi keyboard, dan area sentuh agar nyaman dipakai.",
      },
      {
        title: "Siapkan untuk rilis",
        desc: "Cek aksesibilitas dan performa. Siapkan kode yang mudah dirawat.",
      },
    ],
  },
  experience: {
    title: "Pengalaman",
    intro:
      "Teknik Komputer, Telkom University · IPK 3,93. Sekarang fokus membangun antarmuka untuk kebutuhan sehari-hari.",
    items: [
      {
        role: "Frontend Developer",
        org: "Telkomsigma",
        period: "2025 — Sekarang",
        desc: "Mengembangkan tampilan aplikasi internal perusahaan yang responsif dan lebih mudah dipakai dengan Next.js, React, Vue, shadcn/ui, dan Tailwind CSS.",
      },
      {
        role: "Product Developer, paruh waktu",
        org: "RantAI",
        period: "2025 — Sekarang",
        desc: "Merancang dan mengembangkan rantai.dev beserta CMS-nya, mulai dari eksplorasi desain di Figma sampai rilis di Vercel.",
      },
      {
        role: "SEO Operator, paruh waktu",
        org: "Telkom University",
        period: "2024 — 2025",
        desc: "Meningkatkan visibilitas website kampus di mesin pencari dan mengotomatiskan pengecekan website dengan Playwright.",
      },
      {
        role: "Asisten Lab & Frontend Developer",
        org: "i-Smile Laboratory",
        period: "2023 — 2024",
        desc: "Mendesain landing page laboratorium dan mengajar sesi praktikum Kecerdasan Buatan.",
      },
    ],
    recognition:
      "Medali Emas, WINTEX 2023 • Juara 1, UI/UX Centurion 2023 • Juara 3, UI/UX JBC 2022",
  },
  work: {
    title: "Proyek pilihan",
    intro:
      "Beberapa proyek yang saya kerjakan dari sketsa awal sampai websitenya bisa dipakai. Berikutnya menyusul.",
    details: "Di balik proyeknya",
    visit: "Kunjungi",
    source: "Kode sumber",
    preview: "Cuplikan website",
  },
  contact: {
    available: "Terbuka untuk proyek baru",
    invitation:
      "Punya aplikasi atau prototipe yang ingin dirapikan? Kirim saja. Saya bantu lihat bagian mana yang paling perlu dibenahi dulu.",
    copy: "Salin email",
    copied: "Email tersalin",
    copyFailed: "Email belum tersalin. Coba tombol Kirim email.",
    send: "Kirim email",
    subject: "Ngobrol soal proyek — Requixite",
    made: "Dibuat di Bandung",
    aboutName: "Tentang Requixite",
    nameMeaning:
      "Requixite adalah nama studio personal saya. Pegangannya tiga kata: Precise, teliti sampai ke detail. Exquisite, enak dilihat dan dinikmati. Requisite, menjawab kebutuhan yang nyata.",
  },
  rail: {
    navigation: "Bagian halaman",
    theme: "Ganti tema warna",
    home: "Halo",
    dilemma: "Tantangan",
    proof: "Perbandingan",
    stack: "Alat & stack",
    process: "Proses",
    work: "Proyek",
    experience: "Pengalaman",
    contact: "Kontak",
  },
  stack: {
    title: "Dari ide jadi tampilan",
    phrases: [
      "Mulai dari ide di Figma.",
      "Saya bangun dengan React dan Next.js.",
      "Lalu lengkapi dengan TypeScript, Tailwind, dan PostgreSQL.",
    ],
    note: "Desain dan kode saya kerjakan beriringan. Alatnya bisa berganti, perhatian ke detailnya tetap sama.",
  },
  proof: {
    title: "Lihat bedanya",
    intro:
      "Satu kartu, dirapikan satu per satu sambil kamu scroll: jarak dulu, lalu warna, lalu huruf.",
    account: "Utama • Dompet 01",
    balance: "Saldo bersih",
    amount: "US$42.850,20",
    growth: "+14,2%",
    cashflow: "Arus kas bulanan",
    synced: "Sudah sinkron",
    reconciled: "3 transaksi dicocokkan",
    manage: "Kelola & transfer",
    phases: ["Asal jadi", "Jarak", "Warna", "Huruf"],
    notes: [
      "Gradien, glow, dan jarak yang tidak rata. Semua minta perhatian, jadi tidak ada yang menonjol.",
      "Jarak dulu: padding 13, 19, dan 11px disamakan jadi 24px, dan lengkungan sudutnya diselaraskan.",
      "Lalu warna: glow ungu diganti warna tema. Warna hanya dipakai saat ada artinya.",
      "Terakhir huruf: ketebalan lebih ringan, ukuran lebih tenang, tanpa jarak huruf yang berteriak.",
    ],
  },
};

export function getPortfolioCopy(locale: Locale): PortfolioCopy {
  return locale === "id" ? indonesian : english;
}
