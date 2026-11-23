import "server-only";
import { getPageContent } from "./index";

/**
 * Reads the chapter list (id + title) from content/pages/main/about.mdx so the home page
 * can link to each chapter without duplicating titles anywhere.
 */
export function getStoryChapters(): { id: string; title: string }[] {
  const page = getPageContent("main", null, "about");
  if (!page) return [];
  const chapters: { id: string; title: string }[] = [];
  for (const m of page.body.matchAll(/<Chapter\b([^>]*)>/g)) {
    const attrs = m[1];
    const id = /\bid="([^"]+)"/.exec(attrs)?.[1];
    const title = /\btitle="([^"]+)"/.exec(attrs)?.[1];
    if (id && title) chapters.push({ id, title });
  }
  return chapters;
}
