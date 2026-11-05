import type { Locale } from "@/lib/i18n";

/** Verbatim strings from the approved EN + ID copy. Do not paraphrase. */
const copy = {
  en: {
    title: "Requixite · Web design and build by Tharreq, Bandung",
    description:
      "Clear, fast websites designed and built by Tharreq in Bandung. Website builds, UI polish, and speed + SEO fixes.",
    headline: "Clear, fast websites for small businesses and founders.",
    whatsapp: "Chat on WhatsApp",
    chips: ["Design + code", "Bandung, ID"] as const,
    lighthouseChip: "Lighthouse 95+",
    servicesLabel: "Services",
    services: [
      {
        title: "Website design + build",
        body: "From Figma to a live site, with a CMS if needed.",
      },
      {
        title: "UI polish for your app",
        body: "Cleaner spacing, layout and mobile views that everyone can use.",
      },
      {
        title: "Speed + SEO fix",
        body: "Make your current site load faster and show up on Google.",
      },
    ],
    proofLabel: "Proof",
    proofBefore: "Previous site, Feb 2025: slogan carousel",
    proofAfter: "My build: clear pitch, two buttons",
    years: "3 years building for the web",
    performanceStat: "[X] Performance, mobile (requixite.my.id)",
    accessibilityStat: "[X] Accessibility, mobile (requixite.my.id)",
    workLabel: "Selected work",
    viewLive: "View live",
    work: [
      {
        slug: "rantai",
        name: "RantAI",
        badge: "Client work",
        line: "Designed and built rantai.dev, and the work is ongoing.",
        liveUrl: "https://rantai.dev",
      },
      {
        slug: "cashava",
        name: "Cashava",
        badge: "Own product",
        line: "A personal finance app I build and run myself.",
        liveUrl: "https://cashava.web.id",
      },
      {
        slug: "perangko",
        name: "PERANGKO",
        badge: "Own product",
        line: "A concert ticket concierge I build as co-founder and CTO.",
        liveUrl: "https://perangko.with-sleepcall.my.id",
      },
    ],
    processLabel: "How I work",
    steps: [
      {
        title: "Review",
        body: "I go through your site or app and list what needs fixing.",
      },
      {
        title: "Fix",
        body: "I design and code the changes, small details included.",
      },
      {
        title: "Ship",
        body: "It goes live, tested on phones, with a clear handover.",
      },
    ],
    experienceLabel: "Experience",
    close: "Have a site or app that needs work? Message me on WhatsApp.",
    case: {
      rantai: {
        title: "RantAI website · Client work · Requixite",
        description:
          "How Tharreq designed and built rantai.dev, from Figma to a live site, on an ongoing contract.",
      },
      cashava: {
        title: "Cashava · Own product · Requixite",
        description:
          "Cashava is a personal finance app Tharreq builds and runs himself. See how it's designed and built.",
      },
      perangko: {
        title: "PERANGKO · Own product · Requixite",
        description:
          "PERANGKO is a concert ticket concierge Tharreq builds as co-founder and CTO of With Sleepcall.",
      },
    },
  },
  id: {
    title: "Requixite · Jasa desain dan pembuatan website di Bandung",
    description:
      "Website yang jelas, cepat, dan nyaman di HP, didesain dan dibangun Tharreq di Bandung. Pembuatan website, poles UI, serta perbaikan kecepatan dan SEO.",
    headline: "Website jelas dan cepat untuk UMKM dan founder.",
    whatsapp: "Chat via WhatsApp",
    chips: ["Desain + kode", "Bandung, ID"] as const,
    lighthouseChip: "Lighthouse 95+",
    servicesLabel: "Layanan",
    services: [
      {
        title: "Desain + pembuatan website",
        body: "Dari Figma sampai live, pakai CMS kalau kamu butuh.",
      },
      {
        title: "Poles UI aplikasi",
        body: "Jarak, tata letak, dan tampilan HP yang rapi dan gampang dipakai siapa saja.",
      },
      {
        title: "Perbaikan kecepatan + SEO",
        body: "Website lama jadi lebih cepat dan gampang ditemukan di Google.",
      },
    ],
    proofLabel: "Bukti",
    proofBefore: "Situs sebelumnya, Feb 2025: slider slogan",
    proofAfter: "Buatan saya: pesan jelas, dua tombol",
    years: "3 tahun membangun untuk web",
    performanceStat: "[X] Performa, HP (requixite.my.id)",
    accessibilityStat: "[X] Aksesibilitas, HP (requixite.my.id)",
    workLabel: "Karya",
    viewLive: "View live",
    work: [
      {
        slug: "rantai",
        name: "RantAI",
        badge: "Klien",
        line: "Mendesain dan membangun rantai.dev, kontrak masih berjalan.",
        liveUrl: "https://rantai.dev",
      },
      {
        slug: "cashava",
        name: "Cashava",
        badge: "Produk sendiri",
        line: "Aplikasi keuangan pribadi yang saya bangun dan jalankan sendiri.",
        liveUrl: "https://cashava.web.id",
      },
      {
        slug: "perangko",
        name: "PERANGKO",
        badge: "Produk sendiri",
        line: "Layanan tiket konser yang saya bangun sebagai co-founder dan CTO.",
        liveUrl: "https://perangko.with-sleepcall.my.id",
      },
    ],
    processLabel: "Cara kerja",
    steps: [
      {
        title: "Cek",
        body: "Saya cek website atau aplikasimu dan catat apa yang perlu dibenahi.",
      },
      {
        title: "Benahi",
        body: "Saya desain dan kerjakan perbaikannya, sampai detail kecil.",
      },
      {
        title: "Rilis",
        body: "Langsung live, sudah dites di HP, dengan serah terima yang jelas.",
      },
    ],
    experienceLabel: "Pengalaman",
    close:
      "Punya website atau aplikasi yang perlu dibenahi? Chat saya di WhatsApp.",
    case: {
      rantai: {
        title: "Website RantAI · Proyek klien · Requixite",
        description:
          "Cara Tharreq mendesain dan membangun rantai.dev, dari Figma sampai live, dengan kontrak yang masih berjalan.",
      },
      cashava: {
        title: "Cashava · Produk sendiri · Requixite",
        description:
          "Cashava adalah aplikasi keuangan pribadi yang Tharreq bangun dan jalankan sendiri. Lihat cara desain dan pembuatannya.",
      },
      perangko: {
        title: "PERANGKO · Produk sendiri · Requixite",
        description:
          "PERANGKO adalah layanan tiket konser yang Tharreq bangun sebagai co-founder dan CTO With Sleepcall.",
      },
    },
  },
} as const;

export type HomeCopy = (typeof copy)[Locale];
export type WorkSlug = "rantai" | "cashava" | "perangko";

export function homeCopy(locale: Locale): HomeCopy {
  return copy[locale];
}

export function caseCopy(locale: Locale, slug: WorkSlug) {
  return copy[locale].case[slug];
}

export function workItem(locale: Locale, slug: WorkSlug) {
  const item = copy[locale].work.find((entry) => entry.slug === slug);
  if (!item) throw new Error(`Missing work copy for ${slug}`);
  return item;
}
