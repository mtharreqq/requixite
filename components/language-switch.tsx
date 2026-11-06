import Link from "next/link";
import type { Locale } from "@/lib/portfolio-copy";

export function LanguageSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const action =
    locale === "id" ? "Ganti ke bahasa Inggris" : "Switch to Indonesian";
  return (
    <Link
      href={locale === "id" ? "/" : "/id"}
      hrefLang={locale === "id" ? "en" : "id"}
      aria-label={`${label}: ${locale.toUpperCase()}. ${action}`}
      title={action}
      className="text-muted-foreground hover:text-foreground relative mt-1 -ml-2 grid size-7 place-items-center rounded-full font-sans text-[10px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {locale.toUpperCase()}
    </Link>
  );
}
