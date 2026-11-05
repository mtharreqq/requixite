/**
 * Every localized page's hreflang set is reciprocal and each target returns 200.
 * Usage: node scripts/check-hreflang.mjs http://127.0.0.1:3000
 */
const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const SITE = "https://requixite.my.id";
const REQUIRED = ["en", "id", "x-default"];
const failures = [];

function fail(message) {
  failures.push(message);
}

function attrs(tag) {
  const out = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
    out[match[1].toLowerCase()] = match[2];
  }
  return out;
}

function hreflangMap(html) {
  const map = {};
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const a = attrs(tag);
    if (a.rel !== "alternate" || !a.hreflang || !a.href) continue;
    map[a.hreflang] = a.href;
  }
  return map;
}

function canonicalHref(html) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const a = attrs(tag);
    if (a.rel === "canonical" && a.href) return a.href;
  }
  return null;
}

function htmlLang(html) {
  return html.match(/<html\b[^>]*\blang="([^"]+)"/i)?.[1] ?? null;
}

async function get(pathname, init) {
  const response = await fetch(base + pathname, init);
  const body = await response.text();
  return { response, body };
}

const root = await fetch(base + "/", {
  redirect: "manual",
  headers: { "Accept-Language": "id,en;q=0.8" },
});
if (root.status !== 308 && root.status !== 301) {
  fail(
    `GET / with Accept-Language: id should redirect permanently, got ${root.status}`,
  );
}
const rootLocation = root.headers.get("location");
if (!rootLocation || new URL(rootLocation, base).pathname !== "/en") {
  fail(`GET / should point at /en, got ${rootLocation}`);
}

const robots = await get("/robots.txt");
if (robots.response.status !== 200)
  fail(`robots.txt status ${robots.response.status}`);
if (!robots.body.includes(`Sitemap: ${SITE}/sitemap.xml`)) {
  fail("robots.txt is missing the production sitemap URL");
}

const sitemap = await get("/sitemap.xml");
if (sitemap.response.status !== 200)
  fail(`sitemap.xml status ${sitemap.response.status}`);
const blocks = [...sitemap.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
  (match) => match[1],
);
if (blocks.length === 0) fail("sitemap.xml has no <url> entries");

const pages = [];
for (const block of blocks) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc) {
    fail("sitemap url is missing <loc>");
    continue;
  }
  let pathname;
  try {
    pathname = new URL(loc).pathname;
  } catch {
    fail(`sitemap loc is not a URL: ${loc}`);
    continue;
  }
  if (new URL(loc).origin !== SITE)
    fail(`sitemap loc is not on ${SITE}: ${loc}`);

  const page = await get(pathname);
  if (page.response.status !== 200) {
    fail(`${pathname} returned ${page.response.status}`);
    continue;
  }
  const alternates = hreflangMap(page.body);
  const canonical = canonicalHref(page.body);
  const lang = htmlLang(page.body);
  pages.push({ pathname, loc, alternates, canonical, lang, block, html: page.body });

  const sitemapAlternates = {};
  for (const tag of block.match(/<xhtml:link\b[^>]*>/gi) ?? []) {
    const a = attrs(tag);
    if (a.rel === "alternate" && a.hreflang && a.href)
      sitemapAlternates[a.hreflang] = a.href;
  }
  for (const code of REQUIRED) {
    if (alternates[code] !== sitemapAlternates[code]) {
      fail(
        `${pathname} sitemap hreflang ${code} is ${sitemapAlternates[code]}, page has ${alternates[code]}`,
      );
    }
  }
}

const byPath = new Map(pages.map((page) => [page.pathname, page]));

for (const page of pages) {
  if (!page.lang) fail(`${page.pathname} is missing <html lang>`);
  else if (
    page.pathname !== `/${page.lang}` &&
    !page.pathname.startsWith(`/${page.lang}/`)
  ) {
    fail(`${page.pathname} html lang is ${page.lang}`);
  }

  for (const code of REQUIRED) {
    if (!page.alternates[code])
      fail(`${page.pathname} is missing hreflang ${code}`);
  }
  if (
    page.alternates.en &&
    page.alternates["x-default"] !== page.alternates.en
  ) {
    fail(`${page.pathname} x-default is not the English URL`);
  }
  if (!page.canonical) {
    fail(`${page.pathname} is missing a canonical`);
  } else {
    const canonicalUrl = new URL(page.canonical);
    if (canonicalUrl.origin !== SITE)
      fail(`${page.pathname} canonical origin is ${canonicalUrl.origin}`);
    if (canonicalUrl.pathname !== page.pathname) {
      fail(`${page.pathname} canonical points at ${canonicalUrl.pathname}`);
    }
  }

  const own = page.alternates[page.lang];
  if (own && new URL(own).pathname !== page.pathname) {
    fail(`${page.pathname} hreflang ${page.lang} points at ${own}`);
  }

  for (const [code, href] of Object.entries(page.alternates)) {
    let targetPath;
    try {
      const url = new URL(href);
      if (url.origin !== SITE)
        fail(`${page.pathname} hreflang ${code} origin is ${url.origin}`);
      targetPath = url.pathname;
    } catch {
      fail(`${page.pathname} hreflang ${code} is not a URL: ${href}`);
      continue;
    }
    const direct = await fetch(base + targetPath, { redirect: "manual" });
    if (direct.status !== 200) {
      fail(
        `${page.pathname} hreflang ${code} ${targetPath} returned ${direct.status}`,
      );
    }
    const target = byPath.get(targetPath);
    if (!target) {
      fail(
        `${page.pathname} hreflang ${code} ${targetPath} is not in the sitemap`,
      );
      continue;
    }
    const back = target.alternates[page.lang];
    if (!back || new URL(back).pathname !== page.pathname) {
      fail(
        `${page.pathname} hreflang ${code} is not returned by ${targetPath} (${back})`,
      );
    }
  }

  const jsonLd = page.html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!jsonLd) {
    fail(`${page.pathname} is missing JSON-LD`);
  } else {
    const data = JSON.parse(jsonLd[1]);
    const nodes = data["@graph"] ?? [data];
    const person = nodes.find((node) => node["@type"] === "Person");
    const service = nodes.find((node) => node["@type"] === "ProfessionalService");
    if (!person) fail(`${page.pathname} JSON-LD is missing Person`);
    const homePath = `/${page.lang}`;
    if (person && new URL(person.url).pathname !== homePath) {
      fail(`${page.pathname} Person url is ${person.url}`);
    }
    if (!service) fail(`${page.pathname} JSON-LD is missing ProfessionalService`);
    const offers = service?.hasOfferCatalog?.itemListElement ?? [];
    if (offers.length !== 3) {
      fail(`${page.pathname} ProfessionalService lists ${offers.length} services`);
    }
    const isHome = page.pathname === homePath;
    if (isHome) {
      for (const offer of offers) {
        const name = offer.itemOffered?.name;
        if (!name || !page.html.includes(name)) {
          fail(`${page.pathname} service name is not visible: ${name}`);
        }
      }
      for (const same of person?.sameAs ?? []) {
        if (!page.html.includes(`href="${same}"`)) {
          fail(`${page.pathname} sameAs ${same} is not a link on the page`);
        }
      }
    }
  }
}

if (pages.length < 2) fail("expected both /en and /id in the sitemap");

if (failures.length) {
  console.error(`hreflang check failed (${failures.length}):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `hreflang check passed for ${pages.map((page) => page.pathname).join(", ")}`,
);
