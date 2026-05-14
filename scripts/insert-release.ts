import "dotenv/config";
import { db } from "../lib/db";
import { releases } from "../lib/db/schema";

async function main() {
  const { TAG, VERSION, NOTES, COMMIT_SHA, RELEASED_AT } = process.env;

  if (!TAG || !VERSION || !NOTES || !COMMIT_SHA || !RELEASED_AT) {
    console.error(
      "Missing env vars. Required: TAG, VERSION, NOTES, COMMIT_SHA, RELEASED_AT",
    );
    process.exit(1);
  }

  await db
    .insert(releases)
    .values({
      tag: TAG,
      version: VERSION,
      notes: NOTES,
      commit_sha: COMMIT_SHA,
      released_at: new Date(RELEASED_AT),
    })
    .onConflictDoNothing({ target: releases.tag });

  console.log(`Inserted release ${TAG}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
