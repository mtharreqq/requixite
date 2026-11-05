import { caseCopy, homeCopy, type WorkSlug } from "@/lib/copy";

export const SITE_URL = "https://requixite.my.id";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

/** English is the default document. `/` redirects here, and x-default points here. */
export const defaultLocale: Locale = "en";

/**
 * Paths under a locale prefix. "" is the locale home.
 * Add a path when a new page is created under `app/[locale]`.
 */
export const LOCALIZED_PATHS = [
  "",
  "work/rantai",
  "work/cashava",
  "work/perangko",
] as const;
export type LocalizedPath = (typeof LOCALIZED_PATHS)[number];

/**
 * Profile URLs already linked from the hero and the contact section.
 * sameAs must stay limited to this list.
 */
export const PROFILE_SAME_AS = [
  "https://instagram.com/tooreeq",
  "https://x.com/tooreeq",
  "https://linkedin.com/in/mtharreq/",
  "https://github.com/mtharreqq",
] as const;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path: LocalizedPath = ""): string {
  return path ? `/${locale}/${path}` : `/${locale}`;
}

export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname}`;
}

/** Swap the locale prefix and keep the rest of the path. */
export function swapLocalePath(pathname: string, target: Locale): string {
  const match = pathname.match(/^\/(en|id)(?=\/|$)/);
  if (!match) return localePath(target);
  return `/${target}${pathname.slice(match[0].length)}`;
}

export function hreflangLanguages(path: LocalizedPath = "") {
  return {
    en: localePath("en", path),
    id: localePath("id", path),
    "x-default": localePath(defaultLocale, path),
  } as const;
}

export function seoCopy(
  locale: Locale,
  path: LocalizedPath = "",
): { title: string; description: string } {
  if (path === "") {
    const home = homeCopy(locale);
    return { title: home.title, description: home.description };
  }
  const slug = path.slice("work/".length) as WorkSlug;
  const page = caseCopy(locale, slug);
  return { title: page.title, description: page.description };
}

export function structuredData(locale: Locale) {
  const home = homeCopy(locale);
  const personId = `${absoluteUrl(localePath(locale))}#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Tharreq",
        url: absoluteUrl(localePath(locale)),
        sameAs: [...PROFILE_SAME_AS],
      },
      {
        "@type": "ProfessionalService",
        name: "Requixite",
        url: absoluteUrl(localePath(locale)),
        founder: { "@id": personId },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          itemListElement: home.services.map((service, index) => ({
            "@type": "Offer",
            position: index + 1,
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.body,
            },
          })),
        },
      },
    ],
  };
}
