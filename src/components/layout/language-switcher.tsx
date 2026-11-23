"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/config/i18n";
import { cx } from "@/lib/format";

/**
 * Switches language on the IELTS site.
 * `basePath` is "" on the subdomain or "/ielts" in path mode.
 * `switchMap` (built on the server) handles content pages whose URL differs per language;
 * every other page keeps its path and swaps the language segment.
 */
export function LanguageSwitcher({
  lang,
  basePath,
  switchMap,
  label,
}: {
  lang: Locale;
  basePath: string;
  switchMap: Record<string, Partial<Record<Locale, string>>>;
  label: string;
}) {
  const pathname = usePathname();
  const sitePath = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;

  function hrefFor(target: Locale) {
    const mapped = switchMap[sitePath]?.[target];
    if (mapped) return `${basePath}${mapped}`;
    return `${basePath}${sitePath.replace(new RegExp(`^/${lang}(?=/|$)`), `/${target}`)}`;
  }

  return (
    <nav aria-label={label} className="flex items-center gap-1 font-mono text-xs">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="text-subtle">
              /
            </span>
          )}
          {l === lang ? (
            <span aria-current="true" className="text-fg">
              {localeLabels[l].short}
            </span>
          ) : (
            <Link
              href={hrefFor(l)}
              hrefLang={l}
              lang={l}
              title={localeLabels[l].long}
              className={cx("text-muted transition-colors hover:text-fg")}
            >
              {localeLabels[l].short}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
