import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

type Release = {
  version: string;
  releaseDate: string; // bebas: string/Date sesuai kebutuhan
  description: string;
};

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "releases.json",
    );
    const file = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(file) as Release[];

    // (opsional) sort terbaru dulu
    const sorted = [...data].sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
    );

    // cache hint (Edge/CDN friendly). Ubah sesuai kebutuhan.
    return NextResponse.json(sorted, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load releases.json" },
      { status: 500 },
    );
  }
}
