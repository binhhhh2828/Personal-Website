import type { MetadataRoute } from "next";
import { locales } from "@/config/i18n";
import { mainAbsolute, mainPath } from "@/config/site";
import { getJournal } from "@/lib/content/journal";

/**
 * Personal website sitemap (main domain): every page in Vietnamese (root) and English (/en),
 * each listing its other-language twin. IELTS has its own: see app/ielts/sitemap.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about", "/projects", "/research", "/journal", "/gallery"].flatMap((path) =>
    locales.map((lang) => ({
      url: mainAbsolute(mainPath(lang, path)),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, mainAbsolute(mainPath(l, path))])) },
    })),
  );
  const notes = getJournal()
    .filter((e) => !e.draft)
    .map((e) => ({ url: mainAbsolute(e.path), lastModified: e.updatedAt ?? e.publishedAt }));
  return [...pages, ...notes];
}
