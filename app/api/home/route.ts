import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type Release = {
  id: number;
  created_at: Date;
  version: string;
  release_date: Date;
  description: string;
};

async function loadReleases(): Promise<Release[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("releases").select();
  return data as Release[];
}

export async function GET() {
  try {
    // cara 1: dari database (Supabase)
    const data = await loadReleases();

    const sorted = [...data].sort(
      (a, b) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
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
