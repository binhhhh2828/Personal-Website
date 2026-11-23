import Link from "next/link";
import type { JournalEntry } from "@/lib/content/journal";
import { formatDate, isoDate } from "@/lib/format";
import type { MainLocale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";

/** Journal index rows: date, title, description. Hairline separated. */
export function JournalList({ entries, emptyText, lang = "vi" }: { entries: JournalEntry[]; emptyText: string; lang?: MainLocale }) {
  const t = getMainDict(lang).journal;
  if (entries.length === 0) {
    return <p className="rounded-[28px] bg-canvas px-6 py-10 text-center text-muted md:px-10">{emptyText}</p>;
  }
  return (
    <ol className="border-t border-hairline">
      {entries.map((e) => (
        <li key={e.slug} className="border-b border-hairline">
          <Link href={e.path} className="group grid gap-x-10 gap-y-1 py-7 md:grid-cols-[10rem_1fr] md:py-8">
            <time dateTime={isoDate(e.publishedAt)} className="t-body-sm pt-1 text-muted">
              {formatDate(e.publishedAt, lang)}
            </time>
            <div>
              <h3 className="t-title text-balance transition-colors group-hover:text-link">
                <span lang={e.language}>{e.title}</span>
                {e.language !== lang && (
                  <span className="t-caption ml-2 rounded-full bg-surface px-2 py-0.5 align-middle text-muted">
                    {e.language.toUpperCase()}
                  </span>
                )}
                {e.draft && (
                  <span className="t-caption ml-2 rounded-full bg-surface px-2 py-0.5 align-middle text-muted">{t.draftBadge}</span>
                )}
              </h3>
              <p className="mt-2 max-w-[56ch] text-muted">{e.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
