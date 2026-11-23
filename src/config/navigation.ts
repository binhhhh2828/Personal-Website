import type { Locale } from "./i18n";
import { ieltsHref, ieltsHrefFromMain, mainHrefFromIelts, mainPath } from "./site";
import { getMainDict } from "./main-i18n";
import { sections, type SectionId } from "./content";

export type NavItem = {
  label: string;
  href: string;
  /** Link leaves the current site (different host or root layout): render a plain <a>. */
  crossSite?: boolean;
};

type From = "main" | "ielts";

/**
 * Global navigation — the personal brand. Rendered on BOTH sites (Apple-style global bar),
 * so links are built relative to whichever site is rendering, in the reader's language.
 */
export function globalNav(from: From, lang: Locale = "vi"): NavItem[] {
  const t = getMainDict(lang).nav;
  const main = (path: string): NavItem =>
    from === "main"
      ? { label: "", href: mainPath(lang, path) }
      : { label: "", href: mainHrefFromIelts(mainPath(lang, path)), crossSite: true };
  return [
    { ...main("/about"), label: t.about },
    { ...main("/projects"), label: t.projects },
    { ...main("/research"), label: t.research },
    { ...main("/journal"), label: t.journal },
    { ...main("/gallery"), label: t.gallery },
    from === "main"
      ? { label: t.ielts, href: ieltsHrefFromMain(`/${lang}`), crossSite: true }
      : { label: t.ielts, href: ieltsHref(`/${lang}`) },
  ];
}

const ieltsSectionOrder: SectionId[] = ["journey", "writing-lab", "language-thinking", "knowledge"];

/** IELTS local navigation (product-style sub-bar). */
export function ieltsNav(lang: Locale): NavItem[] {
  return [
    ...ieltsSectionOrder.map((id) => ({
      label: sections[id].title[lang],
      href: ieltsHref(`/${lang}/${id}`),
    })),
    { label: lang === "vi" ? "Giới thiệu" : "About", href: ieltsHref(`/${lang}/about`) },
  ];
}

/** Footer directory, shared by both sites. */
export function footerColumns(from: From, lang: Locale = "vi") {
  const t = getMainDict(lang);
  const m = (path: string) => (from === "main" ? mainPath(lang, path) : mainHrefFromIelts(mainPath(lang, path)));
  const i = (path: string) => (from === "main" ? ieltsHrefFromMain(path) : ieltsHref(path));
  const crossToIelts = from === "main";
  return [
    {
      title: t.footer.personal,
      crossSite: from === "ielts",
      links: [
        { label: t.nav.about, href: m("/about") },
        { label: t.nav.projects, href: m("/projects") },
        { label: t.nav.research, href: m("/research") },
        { label: t.nav.journal, href: m("/journal") },
        { label: t.nav.gallery, href: m("/gallery") },
        { label: t.footer.contact, href: m("/#contact") },
      ],
    },
    {
      title: "IELTS Writing Lab",
      crossSite: crossToIelts,
      links: ieltsSectionOrder.map((id) => ({ label: sections[id].title[lang], href: i(`/${lang}/${id}`) })),
    },
  ];
}
