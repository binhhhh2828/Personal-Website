import type { Metadata, Viewport } from "next";
import "../globals.css";
import { site } from "@/config/site";
import { Document } from "@/components/layout/document";
import { GlobalNav } from "@/components/layout/global-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { EasterEggs } from "@/components/effects/easter-eggs";
import { profile } from "@/config/profile";

export const viewport: Viewport = { themeColor: "#06200f" };

export const metadata: Metadata = {
  metadataBase: new URL(site.mainUrl),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.mainUrl }],
};

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <Document lang={site.locale}>
      <GlobalNav from="main" sticky />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter from="main" />
      <EasterEggs {...profile.secrets} />
    </Document>
  );
}
