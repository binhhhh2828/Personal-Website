import type { MetadataRoute } from "next";
import { categories, sectionIds } from "@/config/content";
import { locales } from "@/config/i18n";
import { ieltsAbsolute } from "@/config/site";
import { getEntries, getTags, getTranslations } from "@/lib/content";

/**
 * IELTS sitemap. Served at /ielts/sitemap.xml, which the proxy exposes as
 * ielts.<domain>/sitemap.xml in subdomain mode.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const both = (path: (l: string) => string) => ({
    languages: Object.fromEntries(locales.map((l) => [l, ieltsAbsolute(path(l))])),
  });

  const pages: MetadataRoute.Sitemap = locales.flatMap((lang) => [
    { url: ieltsAbsolute(`/${lang}`), alternates: both((l) => `/${l}`), priority: 1 },
    { url: ieltsAbsolute(`/${lang}/about`), alternates: both((l) => `/${l}/about`) },
    ...sectionIds.map((s) => ({ url: ieltsAbsolute(`/${lang}/${s}`), alternates: both((l) => `/${l}/${s}`) })),
    // Only categories with content are worth indexing.
    ...categories
      .filter((c) => getEntries(lang, { category: c.id }).length > 0)
      .map((c) => ({ url: ieltsAbsolute(`/${lang}/${c.section}/category/${c.id}`) })),
    ...getTags(lang).map(({ tag }) => ({ url: ieltsAbsolute(`/${lang}/tags/${tag}`) })),
  ]);

  const articles: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    getEntries(lang)
      .filter((e) => !e.draft)
      .map((e) => {
        const versions = [e, ...getTranslations(e)];
        return {
          url: ieltsAbsolute(e.path),
          lastModified: e.updatedAt ?? e.publishedAt,
          ...(versions.length > 1 && {
            alternates: { languages: Object.fromEntries(versions.map((v) => [v.language, ieltsAbsolute(v.path)])) },
          }),
        };
      }),
  );

  return [...pages, ...articles];
}
