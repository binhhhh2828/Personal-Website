import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contentTypeLabels, getCategory, sections } from "@/config/content";
import { getDictionary, localeLabels, type Locale } from "@/config/i18n";
import { ieltsAbsolute, ieltsHref, site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
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
      {/* Header — centred, newsroom-style */}
      <header>
        <Container className="reveal pt-12 pb-10 text-center md:pt-20 md:pb-14">
          <nav aria-label="Breadcrumb" className="t-body-sm text-muted">
            <ol className="flex flex-wrap justify-center gap-x-2">
              <li>
                <Link href={ieltsHref(`/${lang}/${section.id}`)} className="hover:text-link">
                  {section.title[lang]}
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li>
                <Link href={ieltsHref(`/${lang}/${section.id}/category/${category.id}`)} className="hover:text-link">
                  {category.title[lang]}
                </Link>
              </li>
            </ol>
          </nav>
          <p className="t-eyebrow mt-6 text-badge">
            {contentTypeLabels[entry.type][lang]}
            {"task" in entry && entry.task ? ` · Task ${entry.task}` : ""}
          </p>
          <h1 className="t-display mx-auto mt-2 max-w-[20ch]">{entry.title}</h1>
          <p className="t-lede mx-auto mt-5 max-w-[36ch] text-muted">{entry.description}</p>

          <dl className="t-body-sm mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-muted">
            <div className="flex gap-1.5">
              <dt>{t.published}</dt>
              <dd className="text-ink">
                <time dateTime={isoDate(entry.publishedAt)}>{formatDate(entry.publishedAt, lang)}</time>
              </dd>
            </div>
            {entry.updatedAt && (
              <div className="flex gap-1.5">
                <dt>{t.updated}</dt>
                <dd className="text-ink">
                  <time dateTime={isoDate(entry.updatedAt)}>{formatDate(entry.updatedAt, lang)}</time>
                </dd>
              </div>
            )}
            <div className="flex gap-1.5">
              <dt className="sr-only">{t.readingTime}</dt>
              <dd className="text-ink">
                {entry.readingMinutes} {t.minRead}
              </dd>
            </div>
            {translations.length > 0 && (
              <div className="flex gap-1.5">
                <dt>{t.language}</dt>
                <dd className="flex gap-3">
                  {translations.map((tr) => (
                    <Link key={tr.path} href={entryHref(tr)} hrefLang={tr.language} className="link">
                      {localeLabels[tr.language].long}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          {entry.draft && (
            <p className="t-caption mt-6 inline-block rounded-full bg-surface px-3 py-1 text-muted">{t.draft}</p>
          )}
        </Container>
      </header>

      <Container>
        {entry.coverImage && (
          <div className="mb-12 md:mb-16">
            <Photo src={entry.coverImage} alt="" ratio="16/9" label="Cover image" priority />
          </div>
        )}

        {/* Body + TOC */}
        <div className="grid gap-10 md:grid-cols-[1fr_13rem] md:gap-14">
          <aside className="order-first md:order-last">
            <div className="md:sticky md:top-24">
              <TableOfContents headings={headings} label={t.onThisPage} />
            </div>
          </aside>
          <div className="min-w-0">
            {entry.type === "breakdown" && entry.prompt && (
              <figure className="mb-10 max-w-(--container-prose) rounded-[28px] bg-surface p-6 md:p-10">
                <figcaption className="t-caption mb-3 text-badge">
                  {entry.task ? `Writing Task ${entry.task} · ` : ""}
                  {t.question}
                </figcaption>
                <blockquote lang="en" className="t-title">
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
                  className="btn btn-primary"
                >
                  {t.visitResource} ↗
                </a>
              </p>
            )}
            <div className="mt-12 border-t border-hairline pt-6">
              <TagList tags={entry.tags} hrefFor={(tag) => ieltsHref(`/${lang}/tags/${tag}`)} />
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-18">
          <PrevNext
            previous={previous && { href: entryHref(previous), title: previous.title }}
            next={next && { href: entryHref(next), title: next.title }}
            labels={{ previous: t.previous, next: t.next }}
          />
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-12 md:mt-18">
            <SectionHeading id="related">{t.related}</SectionHeading>
            <div className="mt-8">
              <EntryList entries={related} lang={lang} />
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
