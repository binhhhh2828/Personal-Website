import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { getDictionary } from "@/config/i18n";
import { ieltsNav } from "@/config/navigation";
import { ielts, ieltsHref } from "@/config/site";
import { Container } from "@/components/ui/container";
import { NavLinks } from "./nav-links";
import { LanguageSwitcher } from "./language-switcher";

/**
 * IELTS local navigation — like an Apple product sub-bar: product name on the left,
 * sections on the right, translucent light surface, sticky under the global bar.
 */
export function IeltsLocalNav({
  lang,
  switchMap,
}: {
  lang: Locale;
  switchMap: Record<string, Partial<Record<Locale, string>>>;
}) {
  const t = getDictionary(lang);
  return (
    <div className="sticky top-0 z-10 border-b border-hairline/70 bg-[rgba(250,253,251,0.82)] backdrop-blur-xl backdrop-saturate-[1.8]">
      <Container className="relative flex h-[52px] items-center justify-between">
        <Link
          href={ieltsHref(`/${lang}`)}
          lang="en"
          className="font-display text-[19px] font-semibold tracking-[0.012em] text-ink min-[1068px]:text-[21px]"
        >
          {ielts.name}
        </Link>
        <NavLinks
          items={ieltsNav(lang)}
          menuLabel={t.menu}
          closeLabel={t.close}
          variant="local"
          extra={<LanguageSwitcher lang={lang} basePath={ielts.basePath} switchMap={switchMap} label={t.language} />}
        />
      </Container>
    </div>
  );
}
