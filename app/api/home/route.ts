import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { releases } from "@/lib/db/schema";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(releases)
      .orderBy(desc(releases.released_at));

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load releases" },
      { status: 500 },
    );
  }
}
