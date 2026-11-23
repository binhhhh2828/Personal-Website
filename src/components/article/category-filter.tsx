import Link from "next/link";
import { categoriesInSection, type SectionId } from "@/config/content";
import { getDictionary, type Locale } from "@/config/i18n";
import { ieltsHref } from "@/config/site";
import { cx } from "@/lib/format";

/** Category filter as plain links (static, crawlable, works without JS). */
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
  const linkCls = (on: boolean) =>
    cx(
      "inline-flex items-baseline gap-1.5 whitespace-nowrap py-1 transition-colors",
      on ? "text-fg underline decoration-accent decoration-2 underline-offset-[6px]" : "text-muted hover:text-fg",
    );
  return (
    <nav aria-label={t.category}>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <li>
          <Link href={ieltsHref(base)} className={linkCls(!active)} aria-current={!active ? "page" : undefined}>
            {t.all}
          </Link>
        </li>
        {categoriesInSection(section).map((c) => (
          <li key={c.id}>
            <Link
              href={ieltsHref(`${base}/category/${c.id}`)}
              className={linkCls(active === c.id)}
              aria-current={active === c.id ? "page" : undefined}
            >
              {c.title[lang]}
              <sup className="font-mono text-[0.625rem] text-subtle">{counts[c.id] ?? 0}</sup>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
