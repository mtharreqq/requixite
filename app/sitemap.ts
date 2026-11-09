import type { MetadataRoute } from "next";

const SITE = "https://requixite.my.id";
const PAGES = ["", "/about", "/work", "/work/rantai", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((p) => {
    const languages = { en: SITE + (p || "/"), id: `${SITE}/id${p}` };
    return [languages.en, languages.id].map((url) => ({
      url,
      alternates: { languages },
    }));
  });
}
