import { getPortfolioCopy } from "@/lib/portfolio-copy";
import { getCaseStudyCopy } from "@/lib/case-study-copy";

// llms.txt (llmstxt.org): the site in plain Markdown for AI assistants and
// crawlers. Built from the same copy as the pages, so it never drifts.
export const dynamic = "force-static";

const SITE = "https://requixite.my.id";
const plain = (s: string) => s.replace(/\{\w+\}/g, "");

export function GET() {
  const copy = getPortfolioCopy("en");
  const a = copy.about;
  const cs = getCaseStudyCopy("en");
  const md = [
    `# ${a.name} (Tharreq)`,
    `> ${a.role} in ${a.place}. ${plain(a.summary)}`,
    `Status: ${a.status}.`,
    `Contact: mtharreq@gmail.com · https://linkedin.com/in/mtharreq/ · https://github.com/mtharreqq`,
    `Requixite is his independent studio: he polishes apps built fast, often with AI tools, until they feel finished. Plans: ${copy.offer.plans.map((p) => `${p.name} (${p.desc} ${p.time})`).join("; ")}. Start free, fixed quote before any paid work.`,
    `## ${a.experience.title}`,
    ...a.experience.items.map(
      (e) =>
        `### ${e.role}, ${e.org} (${[e.period, e.place].filter(Boolean).join(", ")})\n` +
        e.points.map((p) => `- ${p}`).join("\n"),
    ),
    `## ${a.projects.title}`,
    ...a.projects.items.map(
      (p) => `- [${p.name}](${SITE}${p.href}): ${p.desc} Stack: ${p.stack}.`,
    ),
    `## ${a.education.title}`,
    `- ${a.education.degree}, ${a.education.school}, ${a.education.period}. ${a.education.coursework}.`,
    ...a.education.awards.map(([name, date]) => `- ${name} (${date})`),
    `## ${a.skills.title}`,
    ...a.skills.groups.map(([label, list]) => `- ${label}: ${list}`),
    `## Pages`,
    `- [About / CV](${SITE}/about): ${a.meta}`,
    `- [CV (PDF)](${SITE}/cv-tharreq.pdf)`,
    `- [Work](${SITE}/work): ${copy.workPage.meta}`,
    `- [Case study: ${cs.title}](${SITE}/work/rantai): ${cs.description}`,
    `- [Contact](${SITE}/contact): ${copy.contactPage.meta}`,
    `- Indonesian versions live under ${SITE}/id`,
  ].join("\n\n");
  return new Response(md + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
