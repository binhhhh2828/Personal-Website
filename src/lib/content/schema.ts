import { z } from "zod";
import { categoryIds, contentTypes, reservedSlugs } from "@/config/content";
import { locales } from "@/config/i18n";

const date = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v : new Date(v)))
  .refine((d) => !Number.isNaN(d.getTime()), "Invalid date (use YYYY-MM-DD)");

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
  .refine((s) => !(reservedSlugs as readonly string[]).includes(s), "Slug is reserved");

/** Front-matter shared by every content type. */
const base = z.object({
  title: z.string().min(1),
  slug,
  description: z.string().min(1),
  category: z.enum(categoryIds),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/, "Tags must be lowercase kebab-case")).default([]),
  language: z.enum(locales),
  publishedAt: date,
  updatedAt: date.optional(),
  coverImage: z.string().optional(),
  /** Shared key linking translations of the same piece across languages. */
  translationKey: z.string().optional(),
  /** Drafts are visible in development only (or with SHOW_DRAFTS=true). */
  draft: z.boolean().default(false),
  /** Pin to "Featured" on the IELTS home page. */
  featured: z.boolean().default(false),
});

/** One schema per content type; extra fields are type-specific. */
export const frontmatterSchema = z.discriminatedUnion("type", [
  base.extend({ type: z.literal("article") }),
  base.extend({
    type: z.literal("lesson"),
    task: z.union([z.literal(1), z.literal(2)]).optional(),
  }),
  base.extend({
    type: z.literal("breakdown"),
    task: z.union([z.literal(1), z.literal(2)]).optional(),
    /** The essay question being analysed. */
    prompt: z.string().optional(),
  }),
  base.extend({ type: z.literal("log") }),
  base.extend({ type: z.literal("language-note") }),
  base.extend({
    type: z.literal("resource"),
    /** External link for the resource. */
    url: z.url().optional(),
  }),
]);

export type Frontmatter = z.infer<typeof frontmatterSchema>;

// Compile-time check that the schema covers every configured content type.
type _AllTypesCovered = [Frontmatter["type"]] extends [(typeof contentTypes)[number]]
  ? [(typeof contentTypes)[number]] extends [Frontmatter["type"]]
    ? true
    : never
  : never;
export const _typesCovered: _AllTypesCovered = true;
