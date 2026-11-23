import Link from "next/link";
import { categoriesInSection, type SectionId } from "@/config/content";
import { getDictionary, type Locale } from "@/config/i18n";
import { ieltsHref } from "@/config/site";

/** Category filter as pill chips; the active chip is filled dark. Plain links, crawlable. */
export function CategoryFilter({
  lang,
  section,
  active,
  counts,
}: {
  lang: Locale;
  section: SectionId;
  active?: string;
  counts: Record<string, number>;
}) {
  const t = getDictionary(lang);
  const base = `/${lang}/${section}`;
  return (
    <nav aria-label={t.category}>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href={ieltsHref(base)} className="btn btn-chip" aria-current={!active ? "page" : undefined}>
            {t.all}
          </Link>
        </li>
        {categoriesInSection(section).map((c) => (
          <li key={c.id}>
            <Link
              href={ieltsHref(`${base}/category/${c.id}`)}
              className="btn btn-chip"
              aria-current={active === c.id ? "page" : undefined}
            >
              {c.title[lang]}
              <span className="opacity-60">{counts[c.id] ?? 0}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
