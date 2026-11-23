import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contentTypeLabels, getCategory, sections } from "@/config/content";
import { getDictionary, localeLabels, type Locale } from "@/config/i18n";
import { ieltsAbsolute, ieltsHref, site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { EntryList } from "@/components/article/entry-list";
import { PrevNext } from "@/components/article/prev-next";
import { TableOfContents } from "@/components/article/table-of-contents";
import { TagList } from "@/components/article/tag-list";
import { MdxContent } from "@/components/mdx/mdx-content";
import {
  entryHref,
  extractHeadings,
  getAdjacent,
  getAllEntries,
  getEntry,
  getRelated,
  getTranslations,
} from "@/lib/content";
import { formatDate, isoDate } from "@/lib/format";
import { ieltsMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEntries().map((e) => ({ lang: e.language, section: e.section, slug: e.slug }));
}

type Props = PageProps<"/ielts/[lang]/[section]/[slug]">;

async function load(params: Props["params"]) {
  const { lang, section, slug } = await params;
  const entry = getEntry(lang as Locale, section, slug);
  if (!entry) notFound();
  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await load(params);
  const translations = getTranslations(entry);
  return ieltsMetadata(entry.language, {
    title: entry.title,
    description: entry.description,
    path: entry.path,
    type: "article",
    image: entry.coverImage,
    publishedTime: entry.publishedAt,
    modifiedTime: entry.updatedAt,
    tags: entry.tags,
    languages: Object.fromEntries([entry, ...translations].map((e) => [e.language, e.path])),
    noindex: entry.draft,
  });
}

export default async function ArticlePage({ params }: Props) {
  const entry = await load(params);
  const lang = entry.language;
  const t = getDictionary(lang);
  const section = sections[entry.section];
  const category = getCategory(entry.category)!;
  const headings = extractHeadings(entry.body);
  const translations = getTranslations(entry);
  const related = getRelated(entry);
  const { previous, next } = getAdjacent(entry);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    inLanguage: lang,
    datePublished: entry.publishedAt.toISOString(),
    dateModified: (entry.updatedAt ?? entry.publishedAt).toISOString(),
    author: { "@type": "Person", name: site.name, url: site.mainUrl },
    mainEntityOfPage: ieltsAbsolute(entry.path),
    keywords: entry.tags.join(", "),
    ...(entry.coverImage && { image: entry.coverImage }),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // Escape "<" so content can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container>
        {/* Header */}
        <header className="reveal grid gap-6 pt-12 pb-12 md:grid-cols-12 md:pt-20 md:pb-16">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted md:col-span-12">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href={ieltsHref(`/${lang}/${section.id}`)} className="hover:text-fg">
                  {section.title[lang]}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={ieltsHref(`/${lang}/${section.id}/category/${category.id}`)} className="hover:text-fg">
                  {category.title[lang]}
                </Link>
              </li>
            </ol>
          </nav>
          <div className="md:col-span-9">
            <Eyebrow className="mb-4 text-accent-ink">
              {contentTypeLabels[entry.type][lang]}
              {"task" in entry && entry.task ? ` · Task ${entry.task}` : ""}
            </Eyebrow>
            <h1 className="text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-5xl md:text-6xl">
              {entry.title}
            </h1>
            <p className="mt-6 max-w-[56ch] font-body text-lg leading-relaxed text-muted">{entry.description}</p>
          </div>
          <dl className="grid grid-cols-2 gap-4 border-t border-rule pt-4 font-mono text-xs md:col-span-12 md:grid-cols-4">
            <div>
              <dt className="text-muted">{t.published}</dt>
              <dd>
                <time dateTime={isoDate(entry.publishedAt)}>{formatDate(entry.publishedAt, lang)}</time>
              </dd>
            </div>
            {entry.updatedAt && (
              <div>
                <dt className="text-muted">{t.updated}</dt>
                <dd>
                  <time dateTime={isoDate(entry.updatedAt)}>{formatDate(entry.updatedAt, lang)}</time>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-muted">{t.readingTime}</dt>
              <dd>
                {entry.readingMinutes} {t.minRead}
              </dd>
            </div>
            {translations.length > 0 && (
              <div>
                <dt className="text-muted">{t.language}</dt>
                <dd className="flex gap-3">
                  {translations.map((tr) => (
                    <Link
                      key={tr.path}
                      href={entryHref(tr)}
                      hrefLang={tr.language}
                      className="text-accent-ink underline underline-offset-4 hover:text-fg"
                    >
                      {localeLabels[tr.language].long}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          {entry.draft && (
            <p className="border border-dashed border-accent px-3 py-2 font-mono text-xs text-accent-ink md:col-span-12">
              {t.draft}
            </p>
          )}
        </header>

        {entry.coverImage && (
          // Plain <img>: cover paths are author-supplied and may be external.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={entry.coverImage} alt="" className="mb-16 aspect-[2/1] w-full rounded-sm object-cover" />
        )}

        {/* Body + TOC */}
        <div className="grid gap-12 md:grid-cols-12">
          <aside className="order-first md:order-last md:col-span-3 md:col-start-10">
            <div className="md:sticky md:top-8">
              <TableOfContents headings={headings} label={t.onThisPage} />
            </div>
          </aside>
          <div className="min-w-0 md:col-span-8">
            {entry.type === "breakdown" && entry.prompt && (
              <figure className="mb-10 max-w-(--container-prose) border-y border-rule py-5">
                <figcaption className="mb-2 font-mono text-xs tracking-wider text-muted uppercase">
                  {entry.task ? `Writing Task ${entry.task} · ` : ""}
                  {t.question}
                </figcaption>
                <blockquote lang="en" className="font-body text-[1.0625rem] leading-relaxed">
                  {entry.prompt}
                </blockquote>
              </figure>
            )}
            <MdxContent source={entry.body} />
            {entry.type === "resource" && entry.url && (
              <p className="mt-8">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium underline decoration-accent decoration-2 underline-offset-[6px] hover:text-accent-ink"
                >
                  {t.visitResource} ↗
                </a>
              </p>
            )}
            <div className="mt-12 border-t border-rule pt-4">
              <TagList tags={entry.tags} lang={lang} />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <PrevNext previous={previous} next={next} lang={lang} />
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-16">
            <SectionHeading id="related">{t.related}</SectionHeading>
            <div className="mt-6">
              <EntryList entries={related} lang={lang} />
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
