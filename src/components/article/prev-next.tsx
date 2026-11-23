import Link from "next/link";
import { getDictionary, type Locale } from "@/config/i18n";
import { entryHref, type Entry } from "@/lib/content";

export function PrevNext({ previous, next, lang }: { previous?: Entry; next?: Entry; lang: Locale }) {
  if (!previous && !next) return null;
  const t = getDictionary(lang);
  return (
    <nav aria-label={`${t.previous} / ${t.next}`} className="grid border-t border-rule sm:grid-cols-2">
      <div className="py-6 sm:pr-6">
        {previous && (
          <Link href={entryHref(previous)} rel="prev" className="group block">
            <span className="font-mono text-xs text-muted">← {t.previous}</span>
            <span className="mt-1 block font-semibold tracking-tight text-balance group-hover:text-accent-ink">{previous.title}</span>
          </Link>
        )}
      </div>
      <div className="border-t border-rule py-6 sm:border-t-0 sm:border-l sm:pl-6 sm:text-right">
        {next && (
          <Link href={entryHref(next)} rel="next" className="group block">
            <span className="font-mono text-xs text-muted">{t.next} →</span>
            <span className="mt-1 block font-semibold tracking-tight text-balance group-hover:text-accent-ink">{next.title}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
