import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/home-page";
import {
  hreflangLanguages,
  isLocale,
  localePath,
  seoCopy,
  type Locale,
} from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  if (!isLocale(requested)) return {};
  const locale: Locale = requested;
  const copy = seoCopy(locale);
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: localePath(locale),
      languages: hreflangLanguages(),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: localePath(locale),
      siteName: "Requixite",
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomePage locale={locale} />;
}
