import type { MetadataRoute } from "next";
import { mainAbsolute } from "@/config/site";

/** Personal website sitemap (main domain). IELTS has its own: see app/ielts/sitemap.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/projects", "/research", "/about"].map((path) => ({
    url: mainAbsolute(path),
    priority: path === "/" ? 1 : 0.7,
  }));
}
