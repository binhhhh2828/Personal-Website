import Link from "next/link";
import { contentTypeLabels, getCategory } from "@/config/content";
import { getDictionary, type Locale } from "@/config/i18n";
import { entryHref, type Entry } from "@/lib/content";
import { formatDate, isoDate } from "@/lib/format";

/**
 * Article index: hairline-separated rows on the white canvas — the quiet, newsroom-style
 * list Apple uses for text-led content. Title in Heading SM/MD, meta in muted body-sm.
 */
export function EntryList({ entries, lang, emptyText }: { entries: Entry[]; lang: Locale; emptyText?: string }) {
  const t = getDictionary(lang);
  if (entries.length === 0) {
    return <p className="tile px-6 py-10 text-center text-muted md:px-10">{emptyText ?? t.empty}</p>;
  }
  return (
    <ol className="border-t border-hairline">
      {entries.map((e) => (
        <li key={e.path} className="border-b border-hairline">
          <Link href={entryHref(e)} className="group grid gap-x-10 gap-y-2 py-7 md:grid-cols-[1fr_11rem] md:py-9">
            <div>
              <p className="t-caption mb-2 text-badge">
                {contentTypeLabels[e.type][lang]}
                <span className="text-muted"> · {getCategory(e.category)?.title[lang]}</span>
                {e.draft && <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-muted">Draft</span>}
              </p>
              <h3 className="t-title text-balance transition-colors group-hover:text-link">{e.title}</h3>
              <p className="mt-2 max-w-[56ch] text-muted">{e.description}</p>
            </div>
            <p className="t-body-sm text-muted md:pt-6 md:text-right">
              <time dateTime={isoDate(e.publishedAt)}>{formatDate(e.publishedAt, lang)}</time>
              <span aria-hidden> · </span>
              {e.readingMinutes} {t.minRead}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
