import type { Metadata, Viewport } from "next";
import "../globals.css";
import { ieltsHrefFromMain, site } from "@/config/site";
import { Document } from "@/components/layout/document";
import { MainHeader } from "@/components/layout/main-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const viewport: Viewport = { themeColor: "#F7F7F5" };

export const metadata: Metadata = {
  metadataBase: new URL(site.mainUrl),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.mainUrl }],
};

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <Document lang={site.locale}>
      <MainHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter mainHref="/" ieltsHref={ieltsHrefFromMain("/")} />
    </Document>
  );
}
