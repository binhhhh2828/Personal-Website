import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCategory, READING_WPM, type SectionId } from "@/config/content";
import { locales, type Locale } from "@/config/i18n";
import { ieltsHref } from "@/config/site";
import { frontmatterSchema, type Frontmatter } from "./schema";

/**
 * File-system content loader for IELTS Writing Lab.
 * Files live in content/ielts/{lang}/**\/*.mdx. Sub-folders are for authors only;
 * the URL comes from the category's section and the front-matter slug.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content", "ielts");

export type Entry = Frontmatter & {
  section: SectionId;
  body: string;
  readingMinutes: number;
  /** Path relative to the IELTS site root, e.g. /vi/writing-lab/my-slug */
  path: string;
  sourceFile: string;
};

export type Heading = { id: string; text: string; level: 2 | 3 };

const showDrafts = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "true";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) return walk(full);
    return d.name.endsWith(".mdx") && !d.name.startsWith("_") ? [full] : [];
  });
}

export function readingMinutes(body: string) {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / READING_WPM));
}

function loadAll(): Entry[] {
  const entries: Entry[] = [];
  const seen = new Map<string, string>();

  for (const lang of locales) {
    for (const file of walk(path.join(CONTENT_ROOT, lang))) {
      const rel = path.relative(process.cwd(), file);
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
        throw new Error(`Invalid front-matter in ${rel}\n${issues}`);
      }
      const fm = parsed.data;
      if (fm.language !== lang) {
        throw new Error(`${rel}: language "${fm.language}" does not match folder "${lang}"`);
      }
      const section = getCategory(fm.category)!.section;
      const key = `${lang}/${section}/${fm.slug}`;
      if (seen.has(key)) throw new Error(`Duplicate slug "${key}" in ${rel} and ${seen.get(key)}`);
      seen.set(key, rel);

      if (fm.draft && !showDrafts) continue;
      entries.push({
        ...fm,
        section,
        body: content,
        readingMinutes: readingMinutes(content),
        path: `/${lang}/${section}/${fm.slug}`,
        sourceFile: rel,
      });
    }
  }

  return entries.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

let cache: Entry[] | null = null;
/** All published entries, newest first. Re-read on every call in dev so edits show up. */
export function getAllEntries(): Entry[] {
  if (process.env.NODE_ENV !== "production") return loadAll();
  return (cache ??= loadAll());
}

export type EntryFilter = {
  section?: SectionId;
  category?: string;
  tag?: string;
  type?: Entry["type"];
};

export function getEntries(lang: Locale, filter: EntryFilter = {}): Entry[] {
  return getAllEntries().filter(
    (e) =>
      e.language === lang &&
      (!filter.section || e.section === filter.section) &&
      (!filter.category || e.category === filter.category) &&
      (!filter.tag || e.tags.includes(filter.tag)) &&
      (!filter.type || e.type === filter.type),
  );
}

export function getEntry(lang: Locale, section: string, slug: string): Entry | undefined {
  return getAllEntries().find((e) => e.language === lang && e.section === section && e.slug === slug);
}

/** Other-language versions of the same piece (linked by translationKey). */
export function getTranslations(entry: Entry): Entry[] {
  if (!entry.translationKey) return [];
  return getAllEntries().filter(
    (e) => e.translationKey === entry.translationKey && e.language !== entry.language,
  );
}

/** Related = same language, scored by shared tags, then same category, then section. */
export function getRelated(entry: Entry, limit = 3): Entry[] {
  return getEntries(entry.language)
    .filter((e) => e.path !== entry.path)
    .map((e) => {
      const sharedTags = e.tags.filter((t) => entry.tags.includes(t)).length;
      const score =
        sharedTags * 3 + (e.category === entry.category ? 2 : 0) + (e.section === entry.section ? 1 : 0);
      return { e, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.e.publishedAt.getTime() - a.e.publishedAt.getTime())
    .slice(0, limit)
    .map(({ e }) => e);
}

/** Chronological neighbours within the same section and language. */
export function getAdjacent(entry: Entry): { previous?: Entry; next?: Entry } {
  const list = getEntries(entry.language, { section: entry.section }); // newest first
  const i = list.findIndex((e) => e.path === entry.path);
  return { previous: list[i + 1], next: list[i - 1] };
}

export function getTags(lang: Locale): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of getEntries(lang)) for (const t of e.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function entryHref(entry: Pick<Entry, "path">) {
  return ieltsHref(entry.path);
}

/** Stable heading ids, shared by the TOC and the MDX heading components. */
export function slugifyHeading(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** h2/h3 headings from the raw MDX body (ignores fenced code). */
export function extractHeadings(body: string): Heading[] {
  return body
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .map((line) => /^(#{2,3})\s+(.+?)\s*#*$/.exec(line))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => {
      const text = m[2].replace(/[*_`]/g, "");
      return { id: slugifyHeading(text), text, level: m[1].length as 2 | 3 };
    });
}

/**
 * For the language switcher: where each content URL in `lang` should go in every other
 * language. Articles map to their translation, or to the section index when none exists.
 * Tag pages map to the same tag if it exists in the other language, else the tag index.
 * Paths not listed here simply swap the language prefix (section/category pages exist in both).
 */
export function getLanguageSwitchMap(lang: Locale): Record<string, Partial<Record<Locale, string>>> {
  const map: Record<string, Partial<Record<Locale, string>>> = {};
  const others = locales.filter((l) => l !== lang);

  for (const entry of getEntries(lang)) {
    const translations = getTranslations(entry);
    map[entry.path] = Object.fromEntries(
      others.map((l) => [l, translations.find((t) => t.language === l)?.path ?? `/${l}/${entry.section}`]),
    );
  }
  for (const { tag } of getTags(lang)) {
    map[`/${lang}/tags/${tag}`] = Object.fromEntries(
      others.map((l) => [l, getTags(l).some((t) => t.tag === tag) ? `/${l}/tags/${tag}` : `/${l}/tags`]),
    );
  }
  return map;
}

/* ── Standalone pages (About, Journey intro) ──────────────────────────────── */

const PAGES_ROOT = path.join(process.cwd(), "content", "pages");

export type PageContent = { title: string; description: string; body: string };

/**
 * Loads a standalone MDX page:
 *  - IELTS:     content/pages/ielts/{lang}/{name}.mdx
 *  - personal:  content/pages/main/{name}.mdx
 * Returns undefined if the file does not exist.
 */
export function getPageContent(siteKey: "ielts", lang: Locale, name: string): PageContent | undefined;
export function getPageContent(siteKey: "main", lang: Locale, name: string): PageContent | undefined;
export function getPageContent(siteKey: "ielts" | "main", lang: Locale, name: string): PageContent | undefined {
  const file = path.join(PAGES_ROOT, siteKey, lang, `${name}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { title: String(data.title ?? ""), description: String(data.description ?? ""), body: content };
}
