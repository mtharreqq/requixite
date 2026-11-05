/**
 * Print per-run Lighthouse scores and the LCP breakdown for the home pages.
 * Reads the JSON LHRs that `lhci autorun` writes into .lighthouseci.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const dir = process.argv[2] ?? ".lighthouseci";
const names = (await readdir(dir)).filter(
  (name) => name.endsWith(".json") && name.startsWith("lhr-"),
);

if (names.length === 0) {
  console.error(`No lhr-*.json files in ${dir}`);
  process.exitCode = 1;
}

const reports = [];
for (const name of names) {
  const raw = await readFile(path.join(dir, name), "utf8");
  reports.push(JSON.parse(raw));
}

reports.sort((a, b) => {
  const url = a.finalUrl.localeCompare(b.finalUrl);
  if (url !== 0) return url;
  return String(a.fetchTime).localeCompare(String(b.fetchTime));
});

const AUDITS = [
  "largest-contentful-paint",
  "first-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "cumulative-layout-shift",
  "interactive",
  "server-response-time",
  "max-potential-fid",
];

function ms(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  return `${Math.round(value)}ms`;
}

function score(value) {
  if (typeof value !== "number") return "n/a";
  return value.toFixed(2);
}

function snippets(audit) {
  const found = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.snippet === "string") found.push(node.snippet);
    if (typeof node.nodeLabel === "string") found.push(node.nodeLabel);
    for (const value of Object.values(node)) {
      if (value && typeof value === "object") walk(value);
    }
  };
  walk(audit?.details);
  return [...new Set(found)].slice(0, 6);
}

function items(audit) {
  const list = audit?.details?.items;
  return Array.isArray(list) ? list : [];
}

const byUrl = new Map();
for (const report of reports) {
  const list = byUrl.get(report.finalUrl) ?? [];
  list.push(report);
  byUrl.set(report.finalUrl, list);
}

for (const [url, runs] of byUrl) {
  const scores = runs.map((run) => run.categories?.performance?.score);
  const finite = scores.filter((value) => typeof value === "number");
  const sorted = [...finite].sort((a, b) => a - b);
  const median = sorted.length
    ? sorted.length % 2 === 1
      ? sorted[(sorted.length - 1) / 2]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : null;
  console.log(
    `\n${url}  runs=${runs.length}  scores=${scores.map(score).join(", ")}  median=${score(median)}`,
  );
}

console.log("\n--- /en and /id LCP breakdown ---");

for (const report of reports) {
  const pathName = new URL(report.finalUrl).pathname;
  if (pathName !== "/en" && pathName !== "/id") continue;
  const audits = report.audits ?? {};
  console.log(`\n${report.finalUrl}  fetchTime=${report.fetchTime}`);
  console.log(
    `  perf=${score(report.categories?.performance?.score)} a11y=${score(report.categories?.accessibility?.score)} seo=${score(report.categories?.seo?.score)}`,
  );
  for (const id of AUDITS) {
    const audit = audits[id];
    if (!audit) continue;
    console.log(
      `  ${id}: score=${score(audit.score)} value=${ms(audit.numericValue)}`,
    );
  }

  const lcpElement = audits["largest-contentful-paint-element"];
  const lcpSnippets = snippets(lcpElement);
  console.log(
    `  largest-contentful-paint-element: ${lcpSnippets.join(" | ") || "(none)"}`,
  );

  for (const id of ["lcp-lazy-loaded", "prioritized-lcp-image"]) {
    const audit = audits[id];
    if (!audit) continue;
    console.log(
      `  ${id}: score=${score(audit.score)} ${snippets(audit).join(" | ")}`,
    );
  }

  const blocking = items(audits["render-blocking-resources"]);
  if (blocking.length) {
    console.log("  render-blocking-resources:");
    for (const item of blocking.slice(0, 8)) {
      console.log(
        `    ${ms(item.wastedMs)} ${item.url ?? ""}`,
      );
    }
  } else {
    console.log("  render-blocking-resources: none");
  }

  const requests = items(audits["network-requests"]);
  const interesting = requests.filter((item) => {
    const type = item.resourceType;
    return type === "Document" || type === "Font" || type === "Image" || type === "Stylesheet";
  });
  console.log("  document/font/image/css:");
  for (const item of interesting.slice(0, 16)) {
    const start = item.networkRequestTime ?? item.startTime;
    const end = item.networkEndTime ?? item.endTime;
    const delta =
      typeof start === "number" && typeof end === "number" ? end - start : null;
    const duration =
      delta == null ? "n/a" : delta > 0 && delta < 30 ? ms(delta * 1000) : ms(delta);
    console.log(
      `    ${item.resourceType} ${duration} p=${item.priority ?? "?"} ${item.transferSize ?? "?"}B ${item.url}`,
    );
  }

  const chains = audits["critical-request-chains"]?.details;
  if (chains?.longestChain) {
    console.log(
      `  longest critical chain: ${ms(chains.longestChain.duration)} length=${chains.longestChain.length}`,
    );
  }
}
