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
  const { data } = await supabase
    .from("releases")
    .select()
    .order("release_date", { ascending: false });
  return data as Release[];
}

export async function GET() {
  try {
    const data = await loadReleases();

    // cache hint (Edge/CDN friendly).
    return NextResponse.json(data, {
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
