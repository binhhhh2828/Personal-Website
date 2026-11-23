import type { Locale } from "./i18n";
import { ieltsHrefFromMain, ieltsHref } from "./site";
import { sections, type SectionId } from "./content";

export type NavItem = {
  label: string;
  href: string;
  /** Link leaves the current site (different host or root layout): render a plain <a>. */
  crossSite?: boolean;
};

/** Personal website navigation. */
export function mainNav(): NavItem[] {
  return [
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
    { label: "About", href: "/about" },
    { label: "IELTS", href: ieltsHrefFromMain("/"), crossSite: true },
  ];
}

const ieltsSectionOrder: SectionId[] = ["journey", "writing-lab", "language-thinking", "knowledge"];

/** IELTS Writing Lab navigation for a given language. */
export function ieltsNav(lang: Locale): NavItem[] {
  return [
    ...ieltsSectionOrder.map((id) => ({
      label: sections[id].title[lang],
      href: ieltsHref(`/${lang}/${id}`),
    })),
    { label: lang === "vi" ? "Giới thiệu" : "About", href: ieltsHref(`/${lang}/about`) },
  ];
}
