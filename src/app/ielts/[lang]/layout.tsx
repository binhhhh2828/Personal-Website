import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { isLocale, locales } from "@/config/i18n";
import { ielts, ieltsHref, mainHrefFromIelts, site } from "@/config/site";
import { Document } from "@/components/layout/document";
import { IeltsHeader } from "@/components/layout/ielts-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getLanguageSwitchMap } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#F7F7F5" };

export const metadata: Metadata = {
  // Relative OG/canonical values resolve against the public IELTS origin.
  metadataBase: new URL(`${ielts.url}/`),
  title: { default: ielts.name, template: `%s — ${ielts.name}` },
  description: ielts.tagline,
  applicationName: ielts.name,
  authors: [{ name: site.name, url: site.mainUrl }],
};

export default async function IeltsLayout({ children, params }: LayoutProps<"/ielts/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <Document lang={lang} skipLabel={lang === "vi" ? "Chuyển đến nội dung" : "Skip to content"}>
      <IeltsHeader lang={lang} switchMap={getLanguageSwitchMap(lang)} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter
        mainHref={mainHrefFromIelts("/")}
        ieltsHref={ieltsHref(`/${lang}`)}
        note={`${ielts.name} — ${ielts.tagline}`}
      />
    </Document>
  );
}
