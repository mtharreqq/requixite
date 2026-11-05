import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { workItem, type WorkSlug } from "@/lib/copy";
import {
  hreflangLanguages,
  isLocale,
  localePath,
  seoCopy,
  type Locale,
  type LocalizedPath,
} from "@/lib/i18n";
import { LocaleSwitch } from "@/components/salmoon/locale-switch";
import { ThemeToggle } from "@/components/home/theme-toggle";

const SLUGS = ["rantai", "cashava", "perangko"] as const;

function asSlug(value: string): WorkSlug | null {
  return (SLUGS as readonly string[]).includes(value)
    ? (value as WorkSlug)
    : null;
}

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: requested, slug: raw } = await params;
  const slug = asSlug(raw);
  if (!isLocale(requested) || !slug) return {};
  const path = `work/${slug}` as LocalizedPath;
  const copy = seoCopy(requested, path);
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: localePath(requested, path),
      languages: hreflangLanguages(path),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: localePath(requested, path),
      siteName: "Requixite",
      type: "website",
      locale: requested === "id" ? "id_ID" : "en_US",
      alternateLocale: requested === "id" ? ["en_US"] : ["id_ID"],
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: requested, slug: raw } = await params;
  const slug = asSlug(raw);
  if (!isLocale(requested) || !slug) notFound();
  const locale: Locale = requested;
  const item = workItem(locale, slug);
  const existing = PROJECTS.find((project) => project.slug === slug);

  return (
    <div className="bg-background text-foreground flex min-h-screen justify-center">
      <main className="flex w-full max-w-lg flex-col gap-8 px-5 py-8 md:max-w-xl md:py-12">
        <div className="flex items-center justify-between gap-3">
          <a href={localePath(locale)} className="text-sm font-medium">
            Requixite
          </a>
          <div className="flex items-center gap-3">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
        </div>
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{item.name}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.line}
          </p>
        </header>
        {existing?.image ? (
          <div className="bg-muted border-border relative aspect-video overflow-hidden rounded-xl border">
            <Image
              src={existing.image}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 576px, 100vw"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className="bg-muted text-foreground border-border grid aspect-video place-items-center rounded-xl border text-sm font-medium">
            {item.name}
          </div>
        )}
        <a
          href={item.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lift bg-foreground text-background inline-flex h-11 w-fit items-center rounded-full px-5 text-sm font-medium"
        >
          View live
        </a>
        {existing ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed">{existing.description}</p>
            {existing.highlights?.map((highlight) => (
              <div key={highlight.title}>
                <h2 className="text-sm font-semibold">{highlight.title}</h2>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}
