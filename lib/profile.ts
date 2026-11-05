/** Facts already published on the site. No new descriptions. */
export const EXPERIENCE = [
  {
    org: "Telkomsigma",
    role: "Frontend Developer",
    period: "2025 — Now",
    mark: "TS",
  },
  {
    org: "RantAI",
    role: "Product Developer, Part-time",
    period: "2025 — Now",
    mark: "RA",
  },
  {
    org: "Telkom University",
    role: "SEO Operator, Part-time",
    period: "2024 — 2025",
    mark: "TU",
  },
  {
    org: "i-Smile Laboratory",
    role: "Lab Assistant & Frontend Developer",
    period: "2023 — 2024",
    mark: "iS",
  },
] as const;

export const AWARDS = [
  "Gold Award, WINTEX 2023",
  "1st Place, UI/UX Centurion 2023",
  "2nd Runner-up, UI/UX JBC 2022",
] as const;

/** Shorter bio already shown on the site (name hover card and hero). */
export const ABOUT = [
  "Product engineer & designer based in Bandung. Frontend at Telkomsigma, building rantai.dev on the side.",
  "Computer Engineering at Telkom University (GPA 3.93), then straight into shipping interfaces people use every day.",
] as const;

/** Icons that already exist in /public/logomark, capped at 3 per project. */
export const TECH_ICONS: Record<string, { src: string; name: string }[]> = {
  rantai: [
    { src: "/logomark/next.png", name: "Next.js" },
    { src: "/logomark/react.png", name: "React" },
  ],
  cashava: [{ src: "/logomark/next.png", name: "Next.js" }],
};
