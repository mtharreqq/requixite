import type { MetadataRoute } from "next";
import {
  absoluteUrl,
  hreflangLanguages,
  LOCALIZED_PATHS,
  localePath,
  locales,
} from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALIZED_PATHS.flatMap((path) =>
    locales.map((locale) => {
      const languages = hreflangLanguages(path);
      return {
        url: absoluteUrl(localePath(locale, path)),
        alternates: {
          languages: {
            en: absoluteUrl(languages.en),
            id: absoluteUrl(languages.id),
            "x-default": absoluteUrl(languages["x-default"]),
          },
        },
      };
    }),
  );
}
