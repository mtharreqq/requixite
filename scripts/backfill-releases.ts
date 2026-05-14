import "dotenv/config";
import { execSync } from "node:child_process";
import { db } from "../lib/db";
import { releases } from "../lib/db/schema";

type TagInfo = {
  tag: string;
  version: string;
  sha: string;
  date: string;
  subject: string;
};

function listTags(): TagInfo[] {
  const raw = execSync(
    "git for-each-ref --sort=creatordate --format='%(refname:short)|%(objectname)|%(creatordate:iso-strict)|%(subject)' refs/tags/v*",
    { encoding: "utf8" },
  ).trim();

  if (!raw) return [];

  return raw
    .split("\n")
    .map((line) => line.replace(/^'|'$/g, ""))
    .map((line) => {
      const [tag, sha, date, ...rest] = line.split("|");
      return {
        tag,
        version: tag.replace(/^v/, ""),
        sha,
        date,
        subject: rest.join("|"),
      };
    });
}

async function main() {
  const tags = listTags();
  if (tags.length === 0) {
    console.log("No vX.Y.Z tags found. Nothing to backfill.");
    return;
  }

  for (const t of tags) {
    await db
      .insert(releases)
      .values({
        tag: t.tag,
        version: t.version,
        notes: t.subject || `Release ${t.tag}`,
        commit_sha: t.sha,
        released_at: new Date(t.date),
      })
      .onConflictDoNothing({ target: releases.tag });
    console.log(`Backfilled ${t.tag}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
