import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { PrevNext } from "@/components/article/prev-next";
import { TableOfContents } from "@/components/article/table-of-contents";
import { TagList } from "@/components/article/tag-list";
import { MdxContent } from "@/components/mdx/mdx-content";
import { extractHeadings } from "@/lib/content";
import { getJournal, getJournalAdjacent, getJournalEntry } from "@/lib/content/journal";
import { formatDate, isoDate } from "@/lib/format";
import { mainMetadata } from "@/lib/seo";
import { mainAbsolute } from "@/config/site";
import type { MainLocale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";

export const dynamicParams = false;

/** Each note is published only in the language it is written in. */
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getJournal()
    .filter((e) => e.language === params.lang)
    .map((e) => ({ slug: e.slug }));
}

type Props = PageProps<"/[lang]/journal/[slug]">;

async function load(params: Props["params"]) {
  const { lang, slug } = await params;
  const entry = getJournalEntry(slug);
  if (!entry || entry.language !== lang) notFound();
  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await load(params);
  return mainMetadata(e.language, {
    bilingual: false,
    title: e.title,
    description: e.description,
    path: `/journal/${e.slug}`,
    image: e.coverImage,
    noindex: e.draft,
  });
}

export default async function JournalEntryPage({ params }: Props) {
  const entry = await load(params);
  const { previous, next } = getJournalAdjacent(entry);
  const headings = extractHeadings(entry.body);
  const lang: MainLocale = entry.language;
  const t = getMainDict(lang).journal;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.description,
    inLanguage: entry.language,
    datePublished: entry.publishedAt.toISOString(),
    dateModified: (entry.updatedAt ?? entry.publishedAt).toISOString(),
    author: { "@type": "Person", name: site.name, url: site.mainUrl },
    mainEntityOfPage: mainAbsolute(entry.path),
  };

  return (
    <article lang={entry.language}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header>
        <Container className="reveal pt-14 pb-10 text-center md:pt-20 md:pb-14">
          <p className="t-body-sm text-muted">
            <time dateTime={isoDate(entry.publishedAt)}>{formatDate(entry.publishedAt, lang)}</time>
            <span aria-hidden> · </span>
            {entry.readingMinutes} {t.minRead}
          </p>
          <h1 className="t-display mx-auto mt-3 max-w-[20ch]">{entry.title}</h1>
          <p className="t-lede mx-auto mt-5 max-w-[36ch] text-muted">{entry.description}</p>
          {entry.draft && (
            <p className="t-caption mt-6 inline-block rounded-full bg-surface px-3 py-1 text-muted">
              {t.draft}
            </p>
          )}
        </Container>
      </header>

      {entry.coverImage && (
        <Container className="mb-12 md:mb-16">
          <Photo src={entry.coverImage} alt="" ratio="16/9" label={t.cover} priority />
        </Container>
      )}

      <Container className="grid gap-10 md:grid-cols-[1fr_13rem] md:gap-14">
        <aside className="order-first md:order-last">
          <div className="md:sticky md:top-20">
            <TableOfContents headings={headings} label={t.onThisPage} />
          </div>
        </aside>
        <div className="min-w-0">
          <MdxContent source={entry.body} />
          {entry.tags.length > 0 && (
            <div className="mt-12 border-t border-hairline pt-6">
              <TagList tags={entry.tags} />
            </div>
          )}
        </div>
      </Container>

      <Container className="mt-16">
        <PrevNext
          previous={previous && { href: previous.path, title: previous.title }}
          next={next && { href: next.path, title: next.title }}
          labels={{ previous: t.previous, next: t.next }}
        />
      </Container>
    </article>
  );
}
