import Link from "next/link";
import { getCategory } from "@/config/content";
import { getDictionary, type Locale } from "@/config/i18n";
import { entryHref, type Entry } from "@/lib/content";
import { formatDate, isoDate } from "@/lib/format";

/**
 * Editorial index: one ruled row per piece. Date | title + description | meta.
 * Deliberately not cards — reads like a table of contents.
 */
export function EntryList({
  entries,
  lang,
  emptyText,
}: {
  entries: Entry[];
  lang: Locale;
  emptyText?: string;
}) {
  const t = getDictionary(lang);
  if (entries.length === 0) {
    return <p className="border-t border-rule py-8 font-mono text-sm text-muted">{emptyText ?? t.empty}</p>;
  }
  return (
    <ol className="border-t border-rule">
      {entries.map((e) => (
        <li key={e.path} className="border-b border-rule">
          <Link
            href={entryHref(e)}
            className="group grid gap-x-8 gap-y-1.5 py-6 md:grid-cols-12 md:py-7"
          >
            <time dateTime={isoDate(e.publishedAt)} className="font-mono text-xs text-muted md:col-span-2 md:pt-1.5">
              {formatDate(e.publishedAt, lang)}
            </time>
            <div className="md:col-span-7">
              <h3 className="text-lg leading-snug font-semibold tracking-tight text-balance transition-colors group-hover:text-accent-ink md:text-xl">
                {e.title}
                {e.draft && <span className="ml-2 align-middle font-mono text-[0.625rem] font-normal tracking-wider text-accent-ink uppercase">Draft</span>}
              </h3>
              <p className="mt-1.5 max-w-[60ch] font-body text-[0.9375rem] leading-relaxed text-muted">{e.description}</p>
            </div>
            <p className="font-mono text-xs text-muted md:col-span-3 md:pt-1.5 md:text-right">
              {getCategory(e.category)?.title[lang]} · 
              {e.readingMinutes} {t.minRead}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
