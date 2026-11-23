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

export const dynamicParams = false;

export function generateStaticParams() {
  return getJournal().map((e) => ({ slug: e.slug }));
}

type Props = PageProps<"/journal/[slug]">;

async function load(params: Props["params"]) {
  const entry = getJournalEntry((await params).slug);
  if (!entry) notFound();
  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await load(params);
  return mainMetadata({
    title: e.title,
    description: e.description,
    path: e.path,
    image: e.coverImage,
    noindex: e.draft,
  });
}

export default async function JournalEntryPage({ params }: Props) {
  const entry = await load(params);
  const { previous, next } = getJournalAdjacent(entry);
  const headings = extractHeadings(entry.body);

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
            <time dateTime={isoDate(entry.publishedAt)}>{formatDate(entry.publishedAt, "en")}</time>
            <span aria-hidden> · </span>
            {entry.readingMinutes} min read
          </p>
          <h1 className="t-display mx-auto mt-3 max-w-[20ch]">{entry.title}</h1>
          <p className="t-lede mx-auto mt-5 max-w-[36ch] text-muted">{entry.description}</p>
          {entry.draft && (
            <p className="t-caption mt-6 inline-block rounded-full bg-surface px-3 py-1 text-muted">
              Draft — visible in development only
            </p>
          )}
        </Container>
      </header>

      {entry.coverImage && (
        <Container className="mb-12 md:mb-16">
          <Photo src={entry.coverImage} alt="" ratio="16/9" label="Cover image" priority />
        </Container>
      )}

      <Container className="grid gap-10 md:grid-cols-[1fr_13rem] md:gap-14">
        <aside className="order-first md:order-last">
          <div className="md:sticky md:top-20">
            <TableOfContents headings={headings} label="On this page" />
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
          labels={{ previous: "Previous", next: "Next" }}
        />
      </Container>
    </article>
  );
}
