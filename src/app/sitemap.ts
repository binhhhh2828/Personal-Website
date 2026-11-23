import type { MetadataRoute } from "next";
import { mainAbsolute } from "@/config/site";
import { getJournal } from "@/lib/content/journal";

/** Personal website sitemap (main domain). IELTS has its own: see app/ielts/sitemap.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about", "/projects", "/research", "/journal", "/gallery"].map((path) => ({
    url: mainAbsolute(path),
    priority: path === "/" ? 1 : 0.7,
  }));
  const notes = getJournal()
    .filter((e) => !e.draft)
    .map((e) => ({ url: mainAbsolute(e.path), lastModified: e.updatedAt ?? e.publishedAt }));
  return [...pages, ...notes];
}
