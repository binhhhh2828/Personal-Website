import type { Metadata } from "next";
import { localeLabels, locales, type Locale } from "@/config/i18n";
import { ielts, ieltsAbsolute, mainAbsolute, mainPath, site } from "@/config/site";

/**
 * Metadata builders. Canonical URLs are always absolute and always point to the
 * public host for that site (the IELTS subdomain in subdomain mode).
 */

type PageMeta = {
  title?: string;
  description: string;
  /** Path relative to the site root, e.g. "/projects" or "/vi/writing-lab". */
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: Date;
  modifiedTime?: Date;
  tags?: string[];
  noindex?: boolean;
};

/**
 * Personal-site metadata. `path` is the language-neutral path ("/about"); the canonical URL
 * and hreflang alternates are built for both languages (vi at the root, en under /en).
 * Set `bilingual: false` for pages that exist in one language only (journal entries).
 */
export function mainMetadata(lang: Locale, meta: PageMeta & { bilingual?: boolean }): Metadata {
  const url = mainAbsolute(mainPath(lang, meta.path));
  const bilingual = meta.bilingual ?? true;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      ...(bilingual && {
        languages: {
          vi: mainAbsolute(mainPath("vi", meta.path)),
          en: mainAbsolute(mainPath("en", meta.path)),
          "x-default": mainAbsolute(mainPath("vi", meta.path)),
        },
      }),
    },
    openGraph: {
      type: meta.type ?? "website",
      url,
      siteName: site.name,
      title: meta.title ?? site.name,
      description: meta.description,
      locale: localeLabels[lang].ogLocale,
      ...(bilingual && { alternateLocale: locales.filter((l) => l !== lang).map((l) => localeLabels[l].ogLocale) }),
      ...(meta.image && { images: [meta.image] }),
    },
    twitter: { card: meta.image ? "summary_large_image" : "summary" },
    ...(meta.noindex && { robots: { index: false } }),
  };
}

export function ieltsMetadata(
  lang: Locale,
  meta: PageMeta & {
    /** Language → path of the same page in that language. Only include versions that exist. */
    languages?: Partial<Record<Locale, string>>;
  },
): Metadata {
  const url = ieltsAbsolute(meta.path);
  const languages = meta.languages
    ? Object.fromEntries(Object.entries(meta.languages).map(([l, p]) => [l, ieltsAbsolute(p!)]))
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      ...(languages && Object.keys(languages).length > 1 && { languages }),
    },
    openGraph: {
      type: meta.type ?? "website",
      url,
      siteName: ielts.name,
      title: meta.title ?? ielts.name,
      description: meta.description,
      locale: localeLabels[lang].ogLocale,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeLabels[l].ogLocale),
      ...(meta.image && { images: [meta.image] }),
      ...(meta.type === "article" && {
        publishedTime: meta.publishedTime?.toISOString(),
        modifiedTime: (meta.modifiedTime ?? meta.publishedTime)?.toISOString(),
        tags: meta.tags,
        authors: [site.name],
      }),
    },
    twitter: { card: meta.image ? "summary_large_image" : "summary" },
    ...(meta.noindex && { robots: { index: false } }),
  };
}

/** Same page in every language — for section/category pages that always exist in both. */
export function allLanguages(pathFor: (l: Locale) => string) {
  return Object.fromEntries(locales.map((l) => [l, pathFor(l)])) as Record<Locale, string>;
}
