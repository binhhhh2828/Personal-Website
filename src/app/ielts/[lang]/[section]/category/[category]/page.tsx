import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categoriesInSection, getCategory, sections } from "@/config/content";
import { countLabel, locales, type Locale } from "@/config/i18n";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { EntryList } from "@/components/article/entry-list";
import { CategoryFilter } from "@/components/article/category-filter";
import { getEntries } from "@/lib/content";
import { allLanguages, ieltsMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    categories.map((c) => ({ lang, section: c.section, category: c.id })),
  );
}

type Props = PageProps<"/ielts/[lang]/[section]/category/[category]">;

function resolve(params: Awaited<Props["params"]>) {
  const category = getCategory(params.category);
  if (!category || category.section !== params.section) notFound();
  return { lang: params.lang as Locale, category, section: sections[category.section] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, section } = resolve(await params);
  const entries = getEntries(lang, { category: category.id });
  return ieltsMetadata(lang, {
    title: `${category.title[lang]} · ${section.title[lang]}`,
    description: section.description[lang],
    path: `/${lang}/${section.id}/category/${category.id}`,
    languages: allLanguages((l) => `/${l}/${section.id}/category/${category.id}`),
    // Empty category pages help navigation but should not appear in search results.
    noindex: entries.length === 0,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { lang, category, section } = resolve(await params);
  const sectionEntries = getEntries(lang, { section: section.id });
  const entries = sectionEntries.filter((e) => e.category === category.id);
  const counts = Object.fromEntries(
    categoriesInSection(section.id).map((c) => [
      c.id,
      sectionEntries.filter((e) => e.category === c.id).length,
    ]),
  );

  return (
    <>
      <PageIntro
      eyebrow={`${section.title[lang]} · ${countLabel(lang, entries.length)}`}
      title={category.title[lang]}
    />
      <Container>
      <div className="pb-8">
        <CategoryFilter lang={lang} section={section.id} active={category.id} counts={counts} />
      </div>
      <EntryList entries={entries} lang={lang} />
      </Container>
    </>
  );
}
