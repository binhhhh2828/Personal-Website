"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/config/i18n";
import { mainPath } from "@/config/site";
import { cx } from "@/lib/format";

/** Language-neutral path of the current page ("/en/about" → "/about"). */
function neutralPath(pathname: string, lang: Locale) {
  if (lang === "en") return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return pathname.replace(/^\/vi(?=\/|$)/, "") || "/";
}

/**
 * VI | EN switch for the personal site, in the dark global bar. Keeps the reader on the
 * same page in the other language. Journal notes exist in one language only, so a note
 * switches to the journal index instead.
 */
export function MainLanguageSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? "/";
  let path = neutralPath(pathname, lang);
  if (/^\/journal\/[^/]+/.test(path)) path = "/journal";

  return (
    <nav aria-label={label} className="flex h-7 items-center rounded-full bg-white/12 p-0.5 text-[12px] font-semibold">
      {locales.map((l) => {
        const cls = cx(
          "flex h-6 min-w-8 items-center justify-center rounded-full px-2 transition-colors",
          l === lang ? "bg-white text-black" : "text-white/75 hover:text-white",
        );
        return l === lang ? (
          <span key={l} aria-current="true" lang={l} className={cls}>
            {localeLabels[l].short}
          </span>
        ) : (
          <Link
            key={l}
            href={mainPath(l, path)}
            hrefLang={l}
            lang={l}
            title={localeLabels[l].long}
            className={cls}
            onClick={() => {
              // Remember the choice for a year, so "/" can send returning readers to it.
              document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
            }}
          >
            {localeLabels[l].short}
          </Link>
        );
      })}
    </nav>
  );
}
