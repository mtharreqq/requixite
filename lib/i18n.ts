export const SITE_URL = "https://requixite.my.id";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

/** English is the default document. `/` redirects here, and x-default points here. */
export const defaultLocale: Locale = "en";

/**
 * Paths under a locale prefix. "" is the locale home.
 * Add a path when a new page is created under `app/[locale]`.
 */
export const LOCALIZED_PATHS = [""] as const;
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

const englishSeo = {
  title: "Requixite — Precise. Exquisite. Requisite.",
  description:
    "Independent product and web studio by Tharreq. Crafting refined, purpose-driven digital experiences.",
};

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

/**
 * Document title and meta description, also used for Open Graph.
 * TODO(copy): Indonesian <title>. Do not machine-translate.
 * TODO(copy): Indonesian meta description. Do not machine-translate.
 * TODO(copy): Indonesian body copy. /id still renders the existing English page.
 */
export function seoCopy(locale: Locale): {
  title: string;
  description: string;
} {
  if (locale === "en") return englishSeo;
  return {
    title: "TODO(copy): Indonesian title",
    description: "TODO(copy): Indonesian meta description",
  };
}

/**
 * TODO(copy): Add schema.org ProfessionalService once services are decided.
 * Do not invent serviceType, areaServed, or offers before that copy exists.
 */
export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tharreq",
    url: absoluteUrl(localePath(locale)),
    sameAs: [...PROFILE_SAME_AS],
  };
}
