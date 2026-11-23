import type { Locale } from "./i18n";
import { ieltsHref, ieltsHrefFromMain, mainHrefFromIelts } from "./site";
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
 * so links are built relative to whichever site is rendering.
 */
export function globalNav(from: From): NavItem[] {
  const main = (path: string): NavItem =>
    from === "main" ? { label: "", href: path } : { label: "", href: mainHrefFromIelts(path), crossSite: true };
  return [
    { ...main("/about"), label: "About" },
    { ...main("/projects"), label: "Projects" },
    { ...main("/research"), label: "Research" },
    { ...main("/journal"), label: "Journal" },
    { ...main("/gallery"), label: "Gallery" },
    from === "main"
      ? { label: "IELTS", href: ieltsHrefFromMain("/"), crossSite: true }
      : { label: "IELTS", href: ieltsHref("/") },
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
export function footerColumns(from: From, lang: Locale = "en") {
  const m = (path: string) => (from === "main" ? path : mainHrefFromIelts(path));
  const i = (path: string) => (from === "main" ? ieltsHrefFromMain(path) : ieltsHref(path));
  const crossToIelts = from === "main";
  return [
    {
      title: "Personal",
      crossSite: from === "ielts",
      links: [
        { label: "About", href: m("/about") },
        { label: "Projects", href: m("/projects") },
        { label: "Research", href: m("/research") },
        { label: "Journal", href: m("/journal") },
        { label: "Contact", href: m("/#contact") },
      ],
    },
    {
      title: "IELTS Writing Lab",
      crossSite: crossToIelts,
      links: ieltsSectionOrder.map((id) => ({ label: sections[id].title[lang], href: i(`/${lang}/${id}`) })),
    },
  ];
}
