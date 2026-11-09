import {
  SiteLayout,
  getLocaleMetadata,
  siteViewport,
} from "@/components/layout/site-layout";

export const metadata = getLocaleMetadata("id");
export const viewport = siteViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="id">{children}</SiteLayout>;
}
