import { notFound } from "next/navigation";
import { AboutPage, type Mock } from "@/components/sub-page";

export const metadata = { robots: { index: false } };

export function generateStaticParams() {
  return [{ v: "a" }, { v: "b" }, { v: "c" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ v: string }>;
}) {
  const { v } = await params;
  if (!["a", "b", "c"].includes(v)) notFound();
  return <AboutPage locale="en" mock={v as Mock} />;
}
