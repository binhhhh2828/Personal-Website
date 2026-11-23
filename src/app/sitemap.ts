import type { MetadataRoute } from "next";
import { localeLabels, mainLocales } from "@/config/i18n";
import { mainAbsolute, mainPath } from "@/config/site";
import { getJournal } from "@/lib/content/journal";

/**
 * Personal website sitemap (main domain): every page in Vietnamese (root), English (/en) and Chinese (/zh),
 * each listing its other-language twin. IELTS has its own: see app/ielts/sitemap.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about", "/projects", "/journal", "/gallery"].flatMap((path) =>
    mainLocales.map((lang) => ({
      url: mainAbsolute(mainPath(lang, path)),
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(mainLocales.map((l) => [localeLabels[l].tag, mainAbsolute(mainPath(l, path))])),
      },
    })),
  );
  const notes = getJournal()
    .filter((e) => !e.draft)
    .map((e) => ({ url: mainAbsolute(e.path), lastModified: e.updatedAt ?? e.publishedAt }));
  return [...pages, ...notes];
}
