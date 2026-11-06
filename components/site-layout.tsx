import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeColorSync } from "@/providers/theme-color-sync";
import { SmoothScroll } from "@/components/smooth-scroll";
import "@/app/globals.css";
import { getPortfolioCopy, type Locale } from "@/lib/portfolio-copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sharedMetadata: Metadata = {
  title: "Requixite — Precise. Exquisite. Requisite.",
  description:
    "Independent product and web studio by Tharreq. Crafting refined, purpose-driven digital experiences.",
  icons: {
    icon: [{ url: "/icon.png", sizes: "128x128", type: "image/png" }],
    apple: "/apple-icon.png",
    shortcut: "/icon.png",
  },
};

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

export function getLocaleMetadata(language: Locale): Metadata {
  return {
    ...sharedMetadata,
    description: getPortfolioCopy(language).metadata,
    metadataBase: new URL("https://requixite.my.id"),
    alternates: {
      canonical: language === "id" ? "/id" : "/",
      languages: { en: "/", id: "/id", "x-default": "/" },
    },
    openGraph: {
      title: "Requixite — Tharreq",
      description: getPortfolioCopy(language).metadata,
      locale: language === "id" ? "id_ID" : "en_US",
      alternateLocale: language === "id" ? "en_US" : "id_ID",
    },
  };
}

export function SiteLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeColorSync />
          <SmoothScroll />
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
