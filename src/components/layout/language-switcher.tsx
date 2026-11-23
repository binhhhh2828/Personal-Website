"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/config/i18n";
import { cx } from "@/lib/format";

/**
 * Switches language on the IELTS site, styled as a small segmented pill.
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
    <nav aria-label={label} className="flex h-7 items-center rounded-full bg-surface p-0.5 text-[12px] font-semibold">
      {locales.map((l) => {
        const cls = cx(
          "flex h-6 min-w-8 items-center justify-center rounded-full px-2 transition-colors",
          l === lang ? "bg-body text-white" : "text-muted hover:text-ink",
        );
        return l === lang ? (
          <span key={l} aria-current="true" className={cls}>
            {localeLabels[l].short}
          </span>
        ) : (
          <Link key={l} href={hrefFor(l)} hrefLang={l} lang={l} title={localeLabels[l].long} className={cls}>
            {localeLabels[l].short}
          </Link>
        );
      })}
    </nav>
  );
}
