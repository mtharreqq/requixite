import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Download, Mail } from "lucide-react";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";
import { SubPage } from "@/components/layout/sub-page";
import { AboutModes } from "@/components/about/about-modes";
import { GithubSvg, LinkedinSvg } from "@/components/shared/dock-icons";
import { cn } from "@/lib/utils";

const LOGOS: Record<string, string> = {
  figma: "/logomark/figma.png",
  next: "/logomark/next.png",
  react: "/logomark/react.png",
  vue: "/logomark/vue.png",
  telkomsigma: "/logos/telkomsigma.png",
  rantai: "/logos/rantai.png",
  claude: "/ai-logos/claude.svg",
  cursor: "/ai-logos/cursor.svg",
};

// Shown as handles, not "LinkedIn": they still read on a printed CV.
const LINKS = [
  ["mtharreq@gmail.com", "mailto:mtharreq@gmail.com", Mail],
  [
    "linkedin.com/in/mtharreq",
    "https://linkedin.com/in/mtharreq/",
    LinkedinSvg,
  ],
  ["github.com/mtharreqq", "https://github.com/mtharreqq", GithubSvg],
] as const;

/** "Figma{figma}," : the word, then its logo as a small tilted tile (the
 * home story's Tile), kept on one line with it and what follows. */
function WithLogos({ text }: { text: string }) {
  let n = 0;
  return text.split(/(\S+?\{\w+\}[.,:;]?)/).map((part, i) => {
    const hit = part.match(/^(\S+?)\{(\w+)\}(.*)$/);
    if (!hit) return part;
    const [, word, logo, tail] = hit;
    const rotate = n++ % 2 ? 6 : -6;
    return (
      <span key={i} className="whitespace-nowrap">
        {word}
        <span
          aria-hidden
          className="mx-[0.2em] inline-flex size-[0.92em] items-center justify-center rounded-[0.24em] bg-white align-[-0.12em] shadow-[0_0.08em_0.2em_rgba(0,0,0,0.18)] ring-[0.04em] ring-white print:shadow-none"
          style={{ rotate: `${rotate}deg` }}
        >
          <Image
            src={LOGOS[logo]}
            alt=""
            width={48}
            height={48}
            className="h-[0.55em] w-auto"
          />
        </span>
        {tail}
      </span>
    );
  });
}

const body = "text-muted-foreground text-[15px] leading-relaxed md:text-base";
const h2 = "text-sm font-bold tracking-wider uppercase";
const small = "text-muted-foreground side:text-xs text-[13px]";

export function AboutPage({ locale }: { locale: Locale }) {
  const copy = getPortfolioCopy(locale);
  const a = copy.about;
  return (
    <SubPage
      locale={locale}
      path="/about"
      title={a.title}
      sections={[
        { id: "intro", label: copy.rail.intro },
        { id: "experience", label: copy.rail.experience },
        { id: "projects", label: copy.rail.projects },
        { id: "education", label: copy.rail.education },
        { id: "skills", label: copy.rail.skills },
      ]}
    >
      {/* For search engines and AI assistants: who this page is about. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: a.name,
            alternateName: "Tharreq",
            jobTitle: a.role,
            url: "https://requixite.my.id/about",
            image: "https://requixite.my.id/avatar.png",
            email: "mailto:mtharreq@gmail.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bandung",
              addressCountry: "ID",
            },
            worksFor: { "@type": "Organization", name: "Telkomsigma" },
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: a.education.school,
            },
            knowsAbout: a.skills.groups.flatMap(([, list]) => list.split(", ")),
            sameAs: LINKS.slice(1).map(([, href]) => href),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <header id="intro" className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.png"
            alt=""
            width={64}
            height={64}
            priority
            className="ring-border size-14 shrink-0 rounded-full ring-1 print:hidden"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
              {a.name}
            </h1>
            <p className="text-muted-foreground text-[15px]">
              {a.role} · {a.place}
            </p>
          </div>
        </div>
        <p className="flex items-center gap-2 text-[15px] font-medium">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-emerald-500 [print-color-adjust:exact]"
          />
          {a.status}
        </p>
        <ul className="side:text-sm flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
          {LINKS.map(([label, href, Icon]) => (
            <li key={href}>
              <a
                href={href}
                {...(href.startsWith("http") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="tap-area text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 underline-offset-2 transition-colors hover:underline"
              >
                <Icon aria-hidden className="size-3.5" />
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/cv-tharreq.pdf"
          download
          className="bg-foreground text-background inline-flex h-10 items-center gap-2 self-start rounded-full px-4 text-sm font-medium transition-[opacity,scale] duration-150 hover:opacity-90 active:scale-[0.97] print:hidden"
        >
          <Download aria-hidden className="size-4" />
          {a.cv}
          <span className="opacity-60">{a.cvNote}</span>
        </a>
        <AboutModes
          labels={a.modes}
          story={a.story.map((p) => (
            <p key={p} className={body}>
              <WithLogos text={p} />
            </p>
          ))}
          summary={
            <p className={body}>
              <WithLogos text={a.summary} />
            </p>
          }
          points={
            <ul
              className={cn(
                body,
                "flex list-disc flex-col gap-2 pl-5 marker:text-current/40",
              )}
            >
              {a.points.map((p) => (
                <li key={p}>
                  <WithLogos text={p} />
                </li>
              ))}
            </ul>
          }
        />
      </header>

      <section id="experience" className="flex flex-col gap-8">
        <h2 className={h2}>{a.experience.title}</h2>
        {a.experience.items.map((item) => (
          <article
            key={item.org + item.role}
            className="flex flex-col gap-3 print:break-inside-avoid"
          >
            <div className="flex items-start gap-3">
              {item.logo ? (
                <Image
                  src={`/logos/${item.logo}.png`}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 shrink-0 object-contain"
                />
              ) : (
                <span
                  aria-hidden
                  className="bg-muted text-muted-foreground grid size-7 shrink-0 place-items-center rounded-md"
                >
                  <Building2 className="size-3.5" />
                </span>
              )}
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h3 className="min-w-0 font-semibold">
                  {item.role}
                  <span className="text-muted-foreground block font-normal">
                    {item.org}
                  </span>
                </h3>
                <p className={cn(small, "shrink-0")}>
                  {[item.period, item.place].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            <ul
              className={cn(
                body,
                "flex list-disc flex-col gap-2 pl-10 marker:text-current/40",
              )}
            >
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {item.href && (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground side:text-xs ml-10 inline-flex items-center gap-1 self-start text-sm font-medium transition-colors print:hidden"
              >
                {copy.workPage.read}
                <ArrowRight aria-hidden className="size-3" />
              </Link>
            )}
          </article>
        ))}
      </section>

      <section id="projects" className="flex flex-col gap-6">
        <h2 className={h2}>{a.projects.title}</h2>
        {a.projects.items.map((p) => (
          <article
            key={p.name}
            className="flex flex-col gap-1.5 print:break-inside-avoid"
          >
            <h3 className="font-semibold">
              <Link
                href={p.href}
                className="underline-offset-2 hover:underline"
              >
                {p.name}
              </Link>
            </h3>
            <p className={body}>{p.desc}</p>
            <p className={small}>{p.stack}</p>
          </article>
        ))}
      </section>

      <section
        id="education"
        className="flex flex-col gap-4 print:break-inside-avoid"
      >
        <h2 className={h2}>{a.education.title}</h2>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">
            {a.education.degree}
            <span className="text-muted-foreground block font-normal">
              {a.education.school}
            </span>
          </h3>
          <p className={small}>{a.education.period}</p>
        </div>
        <p className={body}>{a.education.coursework}</p>
        <ul className="flex flex-col gap-2">
          {a.education.awards.map(([name, date]) => (
            <li
              key={name}
              className="flex items-baseline justify-between gap-3 text-[15px] md:text-base"
            >
              {name}
              <span className={cn(small, "shrink-0")}>{date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="skills"
        className="flex flex-col gap-4 print:break-inside-avoid"
      >
        <h2 className={h2}>{a.skills.title}</h2>
        <dl className="flex flex-col gap-3">
          {a.skills.groups.map(([label, list]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-[15px] font-medium md:text-base">{label}</dt>
              <dd className={body}>{list}</dd>
            </div>
          ))}
        </dl>
      </section>
    </SubPage>
  );
}
