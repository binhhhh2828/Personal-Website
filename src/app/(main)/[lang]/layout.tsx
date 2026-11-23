import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { isLocale, locales } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { getProfile } from "@/config/profile";
import { site } from "@/config/site";
import { Document } from "@/components/layout/document";
import { GlobalNav } from "@/components/layout/global-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { EasterEggs } from "@/components/effects/easter-eggs";

/** Personal site, in Vietnamese (served at the root via proxy.ts) and English (/en). */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#06200f" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(site.mainUrl),
    title: { default: site.name, template: `%s — ${site.name}` },
    description: isLocale(lang) ? getMainDict(lang).siteDescription : site.description,
    authors: [{ name: site.name, url: site.mainUrl }],
  };
}

export default async function MainLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMainDict(lang);

  return (
    <Document lang={lang} skipLabel={t.skip}>
      <GlobalNav from="main" lang={lang} sticky />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter from="main" lang={lang} />
      <EasterEggs {...getProfile(lang).secrets} />
    </Document>
  );
}
