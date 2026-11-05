import { preload } from "react-dom";
import Image from "next/image";
import { homeCopy } from "@/lib/copy";
import { ABOUT, AWARDS, EXPERIENCE, TECH_ICONS } from "@/lib/profile";
import { PROFILE_SAME_AS, localePath, type Locale } from "@/lib/i18n";
import {
  EMAIL,
  measuredLighthouse,
  PROOF_SLIDER,
  showLighthouseChip,
  showProofSlider,
  WHATSAPP_URL,
} from "@/lib/site";
import { ContactLink } from "@/components/home/contact-link";
import { LocaleSwitch } from "@/components/salmoon/locale-switch";
import { ProofSlider } from "@/components/home/proof-slider";
import { Reveal } from "@/components/home/reveal";
import { ThemeToggle } from "@/components/home/theme-toggle";

const PROFILE_LABELS = ["Instagram", "X", "LinkedIn", "GitHub"] as const;

export function HomePage({ locale }: { locale: Locale }) {
  preload("/avatar.avif", {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
  });
  const copy = homeCopy(locale);
  const chips = showLighthouseChip
    ? [...copy.chips, copy.lighthouseChip]
    : copy.chips;

  return (
    <div className="bg-background text-foreground flex min-h-screen justify-center">
      <main className="flex w-full max-w-lg flex-col gap-16 px-5 py-8 md:max-w-xl md:py-12">
        <div className="flex items-center justify-end gap-3">
          <LocaleSwitch />
          <ThemeToggle />
        </div>

        <header className="flex flex-col items-start gap-5">
          <picture>
            <source srcSet="/avatar.avif" type="image/avif" />
            <source srcSet="/avatar.webp" type="image/webp" />
            <img
              src="/avatar.webp"
              alt="Tharreq"
              width={256}
              height={256}
              fetchPriority="high"
              decoding="async"
              className="border-border size-36 rounded-full border object-cover"
            />
          </picture>
          <p className="text-sm font-medium">Tharreq</p>
          <h1 className="max-w-[18ch] text-[1.75rem] leading-[1.15] font-semibold tracking-tight">
            {copy.headline}
          </h1>
          <ContactLink
            href={WHATSAPP_URL}
            event="whatsapp_click"
            className="lift bg-foreground text-background inline-flex h-11 items-center rounded-full px-5 text-sm font-medium"
          >
            {copy.whatsapp}
          </ContactLink>
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li
                key={chip}
                className="border-border text-muted-foreground rounded-full border px-3 py-1 text-xs"
              >
                {chip}
              </li>
            ))}
          </ul>
        </header>

        <Reveal>
          <section className="flex flex-col gap-3" data-reveal="">
            <h2 className="text-xs font-bold tracking-[0.14em] uppercase">
              {copy.servicesLabel}
            </h2>
            <ol className="grid gap-3">
              {copy.services.map((service, index) => (
                <li
                  key={service.title}
                  className="lift border-border rounded-xl border p-4"
                >
                  <p className="text-muted-foreground text-xs font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-base font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {service.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-16 flex flex-col gap-3" data-reveal="">
            <h2 className="text-xs font-bold tracking-[0.14em] uppercase">
              {copy.proofLabel}
            </h2>
            {showProofSlider ? (
              <ProofSlider
                before={PROOF_SLIDER.before}
                after={PROOF_SLIDER.after}
                width={PROOF_SLIDER.width}
                height={PROOF_SLIDER.height}
                beforeCaption={copy.proofBefore}
                afterCaption={copy.proofAfter}
                beforeSource={PROOF_SLIDER.beforeSource}
              />
            ) : null}
            <ul className="grid gap-3">
              <Stat value="3" label={copy.years.replace(/^3\s/, "")} />
              {measuredLighthouse.mobilePerformance !== null ? (
                <Stat
                  value={String(measuredLighthouse.mobilePerformance)}
                  label={copy.performanceStat.replace("[X]", "").trim()}
                />
              ) : null}
              {measuredLighthouse.mobileAccessibility !== null ? (
                <Stat
                  value={String(measuredLighthouse.mobileAccessibility)}
                  label={copy.accessibilityStat.replace("[X]", "").trim()}
                />
              ) : null}
            </ul>
          </section>

          <section className="mt-16 flex flex-col gap-3" data-reveal="">
            <h2 className="text-xs font-bold tracking-[0.14em] uppercase">
              {copy.workLabel}
            </h2>
            <ul className="grid gap-4">
              {copy.work.map((project) => (
                <li key={project.slug}>
                  <WorkCard
                    locale={locale}
                    project={project}
                    viewLive={copy.viewLive}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 flex flex-col gap-3" data-reveal="">
            <h2 className="text-xs font-bold tracking-[0.14em] uppercase">
              {copy.processLabel}
            </h2>
            <ol className="grid gap-3">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <StepIcon index={index} />
                  <div>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-16 flex flex-col gap-4" data-reveal="">
            <h2 className="text-xs font-bold tracking-[0.14em] uppercase">
              {copy.experienceLabel}
            </h2>
            <ol className="flex gap-3 overflow-x-auto pb-1">
              {EXPERIENCE.map((item) => (
                <li
                  key={`${item.org}-${item.role}`}
                  className="border-border w-44 shrink-0 rounded-xl border p-3"
                >
                  <span className="bg-muted text-foreground grid size-8 place-items-center rounded-full text-[11px] font-semibold">
                    {item.mark}
                  </span>
                  <p className="mt-3 text-sm font-semibold">{item.org}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-snug">
                    {item.role}
                  </p>
                  <p className="mt-2 text-xs font-medium">{item.period}</p>
                </li>
              ))}
            </ol>
            <ul className="flex flex-wrap gap-2">
              {AWARDS.map((award) => (
                <li
                  key={award}
                  className="border-border rounded-full border px-2.5 py-1 text-xs"
                >
                  {award}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 flex flex-col gap-3" data-reveal="">
            <h2 className="text-xs font-bold tracking-[0.14em] uppercase">
              About
            </h2>
            {ABOUT.map((paragraph) => (
              <p
                key={paragraph}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
            <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              {PROFILE_SAME_AS.map((href, index) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {PROFILE_LABELS[index]}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="mt-16 flex flex-col items-start gap-4 pb-8"
            data-reveal=""
          >
            <h2 className="max-w-[22ch] text-2xl leading-tight font-semibold tracking-tight">
              {copy.close}
            </h2>
            <ContactLink
              href={WHATSAPP_URL}
              event="whatsapp_click"
              className="lift bg-foreground text-background inline-flex h-11 items-center rounded-full px-5 text-sm font-medium"
            >
              {copy.whatsapp}
            </ContactLink>
            <ContactLink
              href={`mailto:${EMAIL}`}
              event="email_click"
              className="text-muted-foreground text-sm underline-offset-4 hover:underline"
            >
              {EMAIL}
            </ContactLink>
          </section>
        </Reveal>
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <li className="border-border rounded-xl border p-4">
      <p className="text-4xl font-semibold tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1 text-sm">{label}</p>
    </li>
  );
}

function WorkCard({
  locale,
  project,
  viewLive,
}: {
  locale: Locale;
  project: ReturnType<typeof homeCopy>["work"][number];
  viewLive: string;
}) {
  const icons = TECH_ICONS[project.slug] ?? [];
  const caseHref = localePath(locale, `work/${project.slug}` as "work/rantai");
  return (
    <article className="lift border-border overflow-hidden rounded-xl border">
      <a href={caseHref} className="block">
        {project.slug === "rantai" ? (
          <div className="bg-muted relative aspect-video">
            <Image
              src="/work/rantai/home.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 576px, 100vw"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className="bg-muted text-foreground grid aspect-video place-items-center text-sm font-medium">
            {project.name}
          </div>
        )}
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">{project.name}</h3>
            <span className="border-border shrink-0 rounded-full border px-2 py-0.5 text-[11px]">
              {project.badge}
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.line}
          </p>
        </div>
      </a>
      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          {viewLive}
        </a>
        {icons.length > 0 ? (
          <ul className="flex items-center gap-1.5">
            {icons.slice(0, 3).map((icon) => (
              <li key={icon.src}>
                <Image src={icon.src} alt={icon.name} width={16} height={16} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function StepIcon({ index }: { index: number }) {
  const path =
    index === 0
      ? "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
      : index === 1
        ? "M4 20h4l10-10-4-4L4 16v4z M13 7l4 4"
        : "M5 12.5 9.2 17 19 7";
  return (
    <span className="border-border grid size-9 shrink-0 place-items-center rounded-full border">
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
