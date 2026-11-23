import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { getDictionary } from "@/config/i18n";
import { ieltsNav } from "@/config/navigation";
import { ielts, ieltsHref, mainHrefFromIelts, site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { NavLinks } from "./nav-links";
import { LanguageSwitcher } from "./language-switcher";

/**
 * Two-tier header: a thin brand strip that ties IELTS Writing Lab back to the
 * personal site, then the lab's own navigation.
 */
export function IeltsHeader({
  lang,
  switchMap,
}: {
  lang: Locale;
  switchMap: Record<string, Partial<Record<Locale, string>>>;
}) {
  const t = getDictionary(lang);
  return (
    <header className="relative z-30 border-b border-rule">
      <div className="border-b border-rule">
        <Container className="flex h-9 items-center justify-between font-mono text-xs">
          <a href={mainHrefFromIelts("/")} className="text-muted transition-colors hover:text-fg">
            ← {site.wordmark} <span className="hidden sm:inline">· {t.backToMain}</span>
          </a>
          <LanguageSwitcher lang={lang} basePath={ielts.basePath} switchMap={switchMap} label={t.language} />
        </Container>
      </div>
      <Container className="flex h-16 items-center justify-between">
        <Link href={ieltsHref(`/${lang}`)} className="flex items-baseline gap-2" lang="en">
          <span className="font-display text-[1.4rem] leading-none italic">IELTS</span>
          <span className="text-[0.9375rem] font-semibold tracking-tight">Writing Lab</span>
        </Link>
        <NavLinks items={ieltsNav(lang)} menuLabel={t.menu} closeLabel={t.close} />
      </Container>
    </header>
  );
}
