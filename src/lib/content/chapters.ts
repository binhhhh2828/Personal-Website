import "server-only";
import { getPageContent } from "./index";

export type StoryChapter = { id: string; title: string; eyebrow?: string; summary?: string };

/**
 * Reads the chapter list from the <Chapter> tags in content/pages/main/about.mdx, so the
 * home page timeline and chapter links never duplicate titles anywhere.
 */
export function getStoryChapters(): StoryChapter[] {
  const page = getPageContent("main", null, "about");
  if (!page) return [];
  const attr = (attrs: string, name: string) => new RegExp(`(?:^|\\s)${name}="([^"]+)"`).exec(attrs)?.[1];
  const chapters: StoryChapter[] = [];
  for (const m of page.body.matchAll(/<Chapter\b([^>]*)>/g)) {
    const id = attr(m[1], "id");
    const title = attr(m[1], "title");
    if (id && title) chapters.push({ id, title, eyebrow: attr(m[1], "eyebrow"), summary: attr(m[1], "summary") });
  }
  return chapters;
}
