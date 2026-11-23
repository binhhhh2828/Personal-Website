import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { readingMinutes } from "./index";
import { mainPath } from "@/config/site";

/**
 * Journal — personal thoughts and notes on the main site.
 * Files: content/journal/*.mdx (files starting with "_" are ignored).
 * URL: /journal/{slug} for Vietnamese notes, /en/… or /zh/journal/{slug} for English or Chinese ones —
 * each note lives in the language it is written in.
 */

const JOURNAL_ROOT = path.join(process.cwd(), "content", "journal");

const date = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v : new Date(v)))
  .refine((d) => !Number.isNaN(d.getTime()), "Invalid date (use YYYY-MM-DD)");

const journalSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  description: z.string().min(1),
  publishedAt: date,
  updatedAt: date.optional(),
  tags: z.array(z.string()).default([]),
  /** Language the note is written in; it is published under that language only. */
  language: z.enum(["vi", "en", "zh"]).default("vi"),
  /** Public path or URL. Shown as a frame until the file exists. */
  coverImage: z.string().optional(),
  draft: z.boolean().default(false),
});

export type JournalEntry = z.infer<typeof journalSchema> & {
  body: string;
  readingMinutes: number;
  path: string;
};

const showDrafts = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "true";

function load(): JournalEntry[] {
  if (!fs.existsSync(JOURNAL_ROOT)) return [];
  const seen = new Set<string>();
  const entries: JournalEntry[] = [];
  for (const name of fs.readdirSync(JOURNAL_ROOT)) {
    if (!name.endsWith(".mdx") || name.startsWith("_")) continue;
    const rel = path.join("content", "journal", name);
    const { data, content } = matter(fs.readFileSync(path.join(JOURNAL_ROOT, name), "utf8"));
    const parsed = journalSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
      throw new Error(`Invalid front-matter in ${rel}\n${issues}`);
    }
    if (seen.has(parsed.data.slug)) throw new Error(`Duplicate journal slug "${parsed.data.slug}" in ${rel}`);
    seen.add(parsed.data.slug);
    if (parsed.data.draft && !showDrafts) continue;
    entries.push({
      ...parsed.data,
      body: content,
      readingMinutes: readingMinutes(content),
      path: mainPath(parsed.data.language, `/journal/${parsed.data.slug}`),
    });
  }
  return entries.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

let cache: JournalEntry[] | null = null;
export function getJournal(): JournalEntry[] {
  if (process.env.NODE_ENV !== "production") return load();
  return (cache ??= load());
}

export function getJournalEntry(slug: string) {
  return getJournal().find((e) => e.slug === slug);
}

export function getJournalAdjacent(entry: JournalEntry) {
  const list = getJournal();
  const i = list.findIndex((e) => e.slug === entry.slug);
  return { previous: list[i + 1], next: list[i - 1] };
}
