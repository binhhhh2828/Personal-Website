import Link from "next/link";
import type { MainLocale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { globalNav } from "@/config/navigation";
import { mainHrefFromIelts, mainPath, site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { cx } from "@/lib/format";
import { MainLanguageSwitch } from "./main-language-switch";
import { NavLinks } from "./nav-links";

/**
 * Global navigation (spec "Primary Navigation Bar"): 44px, dark translucent.
 * The same bar on both sites — the personal brand is always one click away.
 * Sticky on the personal site, with a VI | EN | 中 switch; on IELTS it scrolls away and the
 * local bar (which has its own switch) sticks instead.
 */
export function GlobalNav({ from, lang, sticky }: { from: "main" | "ielts"; lang: MainLocale; sticky: boolean }) {
  const t = getMainDict(lang);
  const brand = <span className="t-body-sm font-semibold text-white">{site.wordmark}</span>;
  return (
    <header className={cx("z-20 bg-nav backdrop-blur-xl backdrop-saturate-[1.8]", sticky ? "sticky top-0" : "relative")}>
      <Container size="nav" className="relative flex h-11 items-center justify-between gap-4">
        {from === "main" ? (
          <Link href={mainPath(lang, "/")} data-brand>
            {brand}
          </Link>
        ) : (
          <a href={mainHrefFromIelts(mainPath(lang, "/"))}>{brand}</a>
        )}
        <NavLinks
          items={globalNav(from, lang)}
          menuLabel={t.menu}
          closeLabel={t.close}
          variant="global"
          extra={from === "main" ? <MainLanguageSwitch lang={lang} label={t.langSwitch} /> : undefined}
        />
      </Container>
    </header>
  );
}
