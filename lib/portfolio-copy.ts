export type Locale = "en" | "id";

export const english = {
  metadata:
    "Built your app with Lovable, Bolt, v0, or Cursor? Tharreq polishes vibecoded apps, fixing spacing, type, and interactions so they feel finished.",
  language: "Language",
  skip: "Skip to content",
  hero: {
    headline: ["Vibecoded it?", "I’ll make it feel finished."],
    summary:
      "I’m Tharreq, a product engineer and designer in Bandung. You built the app with AI. I fix the spacing, type, and interactions so it feels made with care.",
    shortcuts: "Jump to",
    visual: {
      label:
        "rantai.dev, rebuilt live: scrolling turns the AI-built version into the polished one.",
      before: "Built with AI",
      after: "Polished",
      visit: "Visit site",
      pages: ["Home", "Products"],
    },
    chat: {
      open: "Message",
      status: "Replies within 2 days",
      typing: "Tharreq is typing",
      greeting: [
        "Hi! 👋",
        "Send me a link to your app. I’ll reply with the top 3 fixes I’d make, free.",
      ],
      placeholder: "Paste a link, or tell me about your app…",
      send: "Send",
      pick: "Got it. Where should I reply?",
      via: "Send via",
      subject: "Honest take on my app — Requixite",
      copied: "Message copied. Paste it into the DM.",
      close: "Close",
    },
    profile:
      "Product engineer and designer in Bandung. Frontend at Telkomsigma, building rantai.dev on the side.",
    available: "Open to projects",
    role: "Product Engineer & Designer",
  },
  stack: {
    title: "Sound familiar?",
    // {build} and {code} mark where the logo groups pop in.
    sentence:
      "You built it with AI app builders {build} and coding assistants {code}. It works. But something feels unfinished, and your users can tell.",
    sr: "You built it with AI app builders like Lovable, Bolt, v0, and Replit, and coding assistants like Cursor, Claude, ChatGPT, and Antigravity. It works. But something feels unfinished, and your users can tell.",
    note: "People decide in seconds whether an app feels trustworthy. Uneven spacing, clashing type, and stiff buttons read as unfinished, so they leave before trying what you built.",
  },
  proof: {
    title: "See the difference",
    intro: "Pick a component, then scroll. One fix per step.",
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
      "Loud color, glow, and uneven spacing. Everything asks for attention, so nothing gets it.",
      "Spacing first: uneven 13, 19, and 11px padding settles onto one 24px rhythm, and the corners agree.",
      "Then color: the purple glow gives way to the theme. Color stays only where it means something.",
      "Finally type: lighter weights, calmer sizes, and no shouting letter-spacing.",
    ],
    tabs: ["Card", "Form", "Settings"],
    form: {
      loud: "JOIN THE FUTURE OF MONEY",
      title: "Open a Vault account",
      banner: "ERROR!! INVALID INPUT",
      email: "Email",
      emailValue: "tharreq@gmail",
      password: "Password",
      error: "Add the domain ending, like name@gmail.com",
      loudAction: "SUBMIT NOW",
      action: "Create account",
      phases: ["Vibecoded", "Labels", "Feedback", "Type"],
      notes: [
        "Placeholders stand in for labels, borders glow, and a shouting banner says something broke. Once you type, you forget which field is which.",
        "Labels sit above the fields, so they stay visible while you type. The fields share one 16px rhythm.",
        "The error moves next to the field it belongs to and says how to fix it. Red shows up only there.",
        "Calmer weights, and a button in plain words that says what happens next.",
      ],
    },
    list: {
      loud: "NOTIFICATION SETTINGS",
      title: "Notifications",
      rows: [
        ["Push alerts", "Every transfer, as it happens"],
        ["Email receipts", "A copy for your records"],
        ["Weekly summary", "Sundays, one short email"],
      ],
      phases: ["Vibecoded", "Grouping", "Color", "Hierarchy"],
      notes: [
        "Every row is its own glowing card, every icon a different color, every switch a different size.",
        "Related rows join one group with thin dividers, and the switches share one size.",
        "Icons go quiet, and every switch that’s on uses the same color, so on always looks the same.",
        "Titles lead and descriptions step back, smaller and muted, so the list scans at a glance.",
      ],
    },
  },
  offer: {
    title: "Ways to work together",
    intro: "Start free. Pay only if you want me to do the work.",
    from: "From",
    free: "Free",
    recommended: "Recommended",
    plans: [
      {
        name: "Honest take",
        desc: "Find out what to fix first.",
        features: [
          "Top 3 fixes for your app",
          "As a short video or notes",
          "Reply within 2 days",
          "No commitment",
        ],
        cta: "Send my app",
      },
      {
        name: "Polish sprint",
        desc: "For a vibecoded app that works but feels unfinished.",
        features: [
          "Consistent spacing, type, and color",
          "Hover, press, loading, and empty states",
          "Motion and phone layouts tuned",
          "Done in your code and your repo",
          "About 1 week",
        ],
        cta: "Start a sprint",
      },
      {
        name: "Build from scratch",
        desc: "A landing page or small site, done right from day one.",
        features: [
          "Designed and built in Next.js",
          "Fast on phones",
          "Easy for you to update",
          "2 to 3 weeks",
        ],
        cta: "Plan a build",
      },
    ],
    note: "Final price depends on scope. You get a fixed quote before any work starts.",
    // Chat draft when a plan is picked; {plan} is its name.
    ask: "I’m interested in {plan}. My app: ",
  },
  process: {
    title: "How a sprint goes",
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
    title: "Who you’ll work with",
    intro:
      "Me, directly. I design and build interfaces every day, so I fix the details in your code myself, not in a mockup someone else has to rebuild.",
    education: "Computer Engineering, Telkom University · GPA 3.93",
    items: [
      {
        role: "Frontend Developer",
        org: "Telkomsigma",
        logo: "telkomsigma",
        period: "2025 — Now",
        desc: "Building responsive, easier-to-use interfaces for internal enterprise apps with Next.js, React, Vue, shadcn/ui, and Tailwind CSS.",
      },
      {
        role: "Product Developer, Part-time",
        org: "RantAI",
        logo: "rantai",
        period: "2025 — Now",
        desc: "Designing and developing rantai.dev and its CMS, from exploring ideas in Figma to deploying on Vercel.",
      },
      {
        role: "SEO Operator, Part-time",
        org: "Telkom University",
        logo: "telkom-university",
        period: "2024 — 2025",
        desc: "Improved search visibility for the university's websites and automated website checks with Playwright.",
      },
      {
        role: "Lab Assistant & Frontend Developer",
        org: "i-Smile Laboratory",
        logo: "i-smile",
        period: "2023 — 2024",
        desc: "Designed the lab's landing pages and taught Artificial Intelligence practicum sessions.",
      },
    ],
    toolkit:
      "Toolkit: Next.js, React, Vue, TypeScript, Tailwind CSS, PostgreSQL, and Figma.",
    recognition:
      "Gold Award, WINTEX 2023 • 1st Place, UI/UX Centurion 2023 • 2nd Place, UI/UX JBC 2022",
  },
  contact: {
    available: "Open to new projects",
    invitation:
      "Send me your app or prototype. I’ll reply within 2 days with the top 3 things I’d fix, free.",
    copy: "Copy email",
    copied: "Email copied",
    copyFailed: "Couldn't copy. Try sending an email instead.",
    send: "Send email",
    subject: "Honest take on my app — Requixite",
    made: "Made in Bandung",
    updated: "Updated",
    dateLocale: "en-US",
    source: "Source code",
    aboutName: "About Requixite",
    nameMeaning:
      "Requixite is my personal studio. Three words guide the work: Precise, for care in the details. Exquisite, for things worth looking at. Requisite, for what people actually need.",
  },
  rail: {
    navigation: "Page sections",
    theme: "Switch color theme",
    home: "Intro",
    stack: "Problem",
    proof: "Comparison",
    offer: "Pricing",
    process: "Process",
    experience: "About",
    contact: "Contact",
  },
};

export type PortfolioCopy = typeof english;

export const indonesian: PortfolioCopy = {
  metadata:
    "Bikin aplikasi pakai Lovable, Bolt, v0, atau Cursor? Tharreq merapikan aplikasi hasil vibecoding: jarak, huruf, dan interaksinya, sampai terasa jadi.",
  language: "Bahasa",
  skip: "Langsung ke konten",
  hero: {
    headline: ["Udah di-vibecode?", "Saya rapikan sampai terasa jadi."],
    summary:
      "Saya Tharreq, product engineer dan designer dari Bandung. Aplikasimu dibangun dengan AI, saya rapikan jarak, huruf, dan interaksinya supaya terasa dibuat dengan serius.",
    shortcuts: "Langsung ke",
    visual: {
      label:
        "rantai.dev, dibangun ulang langsung: saat di-scroll, versi buatan AI berubah jadi versi yang sudah dirapikan.",
      before: "Dibuat dengan AI",
      after: "Sudah dirapikan",
      visit: "Buka situsnya",
      pages: ["Beranda", "Produk"],
    },
    chat: {
      open: "Chat",
      status: "Membalas dalam 2 hari",
      typing: "Tharreq sedang mengetik",
      greeting: [
        "Halo! 👋",
        "Kirim link aplikasimu. Saya balas dengan 3 hal yang paling perlu dibenahi, gratis.",
      ],
      placeholder: "Tempel link, atau ceritakan aplikasimu…",
      send: "Kirim",
      pick: "Siap. Mau dikirim lewat mana?",
      via: "Kirim lewat",
      subject: "Minta honest take untuk aplikasiku — Requixite",
      copied: "Pesan sudah disalin. Tempel di DM, ya.",
      close: "Tutup",
    },
    profile:
      "Saya merancang dan membangun produk digital dari Bandung. Bekerja sebagai frontend developer di Telkomsigma, juga mengembangkan rantai.dev.",
    available: "Terbuka untuk proyek baru",
    role: "Product Engineer & Designer",
  },
  stack: {
    title: "Kenal situasi ini?",
    sentence:
      "Kamu membangunnya pakai pembuat aplikasi AI {build} dan asisten coding {code}. Aplikasinya jalan. Tapi ada yang terasa belum jadi, dan penggunamu menyadarinya.",
    sr: "Kamu membangunnya pakai pembuat aplikasi AI seperti Lovable, Bolt, v0, dan Replit, dan asisten coding seperti Cursor, Claude, ChatGPT, dan Antigravity. Aplikasinya jalan. Tapi ada yang terasa belum jadi, dan penggunamu menyadarinya.",
    note: "Orang memutuskan dalam hitungan detik apakah sebuah aplikasi bisa dipercaya. Jarak yang tidak rata, huruf yang bertabrakan, dan tombol yang kaku terasa setengah jadi, jadi mereka pergi sebelum mencoba yang kamu bangun.",
  },
  proof: {
    title: "Lihat bedanya",
    intro: "Pilih komponennya, lalu scroll. Satu perbaikan per langkah.",
    account: "Utama • Dompet 01",
    balance: "Saldo bersih",
    amount: "US$42.850,20",
    growth: "+14,2%",
    cashflow: "Arus kas bulanan",
    synced: "Sudah sinkron",
    reconciled: "3 transaksi dicocokkan",
    manage: "Kelola & transfer",
    phases: ["Vibecoded", "Jarak", "Warna", "Huruf"],
    notes: [
      "Warna mencolok, glow, dan jarak yang tidak rata. Semua minta perhatian, jadi tidak ada yang menonjol.",
      "Jarak dulu: padding 13, 19, dan 11px disamakan jadi 24px, dan lengkungan sudutnya diselaraskan.",
      "Lalu warna: glow ungu diganti warna tema. Warna hanya dipakai saat ada artinya.",
      "Terakhir huruf: ketebalan lebih ringan, ukuran lebih tenang, tanpa jarak huruf yang berteriak.",
    ],
    tabs: ["Kartu", "Form", "Pengaturan"],
    form: {
      loud: "GABUNG MASA DEPAN UANG",
      title: "Buka akun Vault",
      banner: "ERROR!! INPUT TIDAK VALID",
      email: "Email",
      emailValue: "tharreq@gmail",
      password: "Kata sandi",
      error: "Tambahkan akhiran domain, misalnya nama@gmail.com",
      loudAction: "KIRIM SEKARANG",
      action: "Buat akun",
      phases: ["Vibecoded", "Label", "Umpan balik", "Huruf"],
      notes: [
        "Placeholder dipakai sebagai label, border menyala, dan banner berteriak bilang ada yang salah. Begitu mengetik, kamu lupa ini field apa.",
        "Label dipindah ke atas field, jadi tetap terlihat saat mengetik. Jarak antar field disamakan 16px.",
        "Error pindah ke dekat field yang salah dan memberi tahu cara memperbaikinya. Merah hanya muncul di situ.",
        "Ketebalan huruf lebih tenang, dan tombolnya pakai kata biasa yang bilang apa yang akan terjadi.",
      ],
    },
    list: {
      loud: "PENGATURAN NOTIFIKASI",
      title: "Notifikasi",
      rows: [
        ["Notifikasi push", "Setiap transfer, saat itu juga"],
        ["Struk lewat email", "Salinan untuk arsipmu"],
        ["Ringkasan mingguan", "Tiap Minggu, satu email singkat"],
      ],
      phases: ["Vibecoded", "Pengelompokan", "Warna", "Hierarki"],
      notes: [
        "Setiap baris jadi kartu sendiri yang menyala, ikonnya beda warna semua, toggle-nya beda ukuran semua.",
        "Baris yang berkaitan digabung jadi satu grup dengan garis pemisah tipis, dan ukuran toggle disamakan.",
        "Ikon jadi kalem dan setiap toggle yang aktif pakai warna yang sama, jadi status aktif selalu kelihatan sama.",
        "Judul di depan, deskripsi mundur: lebih kecil dan pudar, jadi daftarnya gampang dipindai.",
      ],
    },
  },
  offer: {
    title: "Pilihan kerja sama",
    intro: "Mulai gratis. Bayar hanya kalau kamu mau saya yang mengerjakan.",
    from: "Mulai",
    free: "Gratis",
    recommended: "Disarankan",
    plans: [
      {
        name: "Honest take",
        desc: "Cari tahu apa yang perlu dibenahi dulu.",
        features: [
          "3 perbaikan utama untuk aplikasimu",
          "Lewat video singkat atau catatan",
          "Dibalas maksimal 2 hari",
          "Tanpa ikatan",
        ],
        cta: "Kirim aplikasiku",
      },
      {
        name: "Polish sprint",
        desc: "Untuk aplikasi vibecoded yang sudah jalan tapi terasa belum jadi.",
        features: [
          "Jarak, huruf, dan warna yang konsisten",
          "State hover, tekan, loading, dan kosong",
          "Animasi dan tampilan HP dirapikan",
          "Langsung di kode dan repo-mu",
          "Sekitar 1 minggu",
        ],
        cta: "Mulai sprint",
      },
      {
        name: "Bangun dari nol",
        desc: "Landing page atau website kecil yang rapi sejak awal.",
        features: [
          "Didesain dan dibangun dengan Next.js",
          "Cepat di HP",
          "Gampang kamu perbarui",
          "2 sampai 3 minggu",
        ],
        cta: "Rencanakan",
      },
    ],
    note: "Harga akhir tergantung cakupan. Kamu dapat harga pasti sebelum pekerjaan dimulai.",
    ask: "Saya tertarik dengan {plan}. Aplikasi saya: ",
  },
  process: {
    title: "Alur polish sprint",
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
    title: "Yang akan mengerjakan",
    intro:
      "Saya sendiri, langsung. Setiap hari saya mendesain dan membangun antarmuka, jadi detailnya saya perbaiki langsung di kodemu, bukan di mockup yang harus dibangun ulang orang lain.",
    education: "Teknik Komputer, Telkom University · IPK 3,93",
    items: [
      {
        role: "Frontend Developer",
        org: "Telkomsigma",
        logo: "telkomsigma",
        period: "2025 — Sekarang",
        desc: "Mengembangkan tampilan aplikasi internal perusahaan yang responsif dan lebih mudah dipakai dengan Next.js, React, Vue, shadcn/ui, dan Tailwind CSS.",
      },
      {
        role: "Product Developer, paruh waktu",
        org: "RantAI",
        logo: "rantai",
        period: "2025 — Sekarang",
        desc: "Merancang dan mengembangkan rantai.dev beserta CMS-nya, mulai dari eksplorasi desain di Figma sampai rilis di Vercel.",
      },
      {
        role: "SEO Operator, paruh waktu",
        org: "Telkom University",
        logo: "telkom-university",
        period: "2024 — 2025",
        desc: "Meningkatkan visibilitas website kampus di mesin pencari dan mengotomatiskan pengecekan website dengan Playwright.",
      },
      {
        role: "Asisten Lab & Frontend Developer",
        org: "i-Smile Laboratory",
        logo: "i-smile",
        period: "2023 — 2024",
        desc: "Mendesain landing page laboratorium dan mengajar sesi praktikum Kecerdasan Buatan.",
      },
    ],
    toolkit:
      "Alat kerja: Next.js, React, Vue, TypeScript, Tailwind CSS, PostgreSQL, dan Figma.",
    recognition:
      "Medali Emas, WINTEX 2023 • Juara 1, UI/UX Centurion 2023 • Juara 2, UI/UX JBC 2022",
  },
  contact: {
    available: "Terbuka untuk proyek baru",
    invitation:
      "Kirim aplikasi atau prototipemu. Dalam 2 hari saya balas dengan 3 hal yang paling perlu dibenahi, gratis.",
    copy: "Salin email",
    copied: "Email tersalin",
    copyFailed: "Email belum tersalin. Coba tombol Kirim email.",
    send: "Kirim email",
    subject: "Minta honest take untuk aplikasiku — Requixite",
    made: "Dibuat di Bandung",
    updated: "Diperbarui",
    dateLocale: "id-ID",
    source: "Kode sumber",
    aboutName: "Tentang Requixite",
    nameMeaning:
      "Requixite adalah nama studio personal saya. Pegangannya tiga kata: Precise, teliti sampai ke detail. Exquisite, enak dilihat dan dinikmati. Requisite, menjawab kebutuhan yang nyata.",
  },
  rail: {
    navigation: "Bagian halaman",
    theme: "Ganti tema warna",
    home: "Halo",
    stack: "Masalah",
    proof: "Perbandingan",
    offer: "Harga",
    process: "Proses",
    experience: "Tentang",
    contact: "Kontak",
  },
};

export function getPortfolioCopy(locale: Locale): PortfolioCopy {
  return locale === "id" ? indonesian : english;
}
