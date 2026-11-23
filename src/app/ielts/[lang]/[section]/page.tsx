import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoriesInSection, sectionIds, sections, type SectionId } from "@/config/content";
import { countLabel, locales, type Locale } from "@/config/i18n";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { EntryList } from "@/components/article/entry-list";
import { CategoryFilter } from "@/components/article/category-filter";
import { MdxContent } from "@/components/mdx/mdx-content";
import { getEntries, getPageContent } from "@/lib/content";
import { allLanguages, ieltsMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => sectionIds.map((section) => ({ lang, section })));
}

type Props = PageProps<"/ielts/[lang]/[section]">;

function resolve(params: Awaited<Props["params"]>) {
  const section = sections[params.section as SectionId];
  if (!section) notFound();
  return { lang: params.lang as Locale, section };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, section } = resolve(await params);
  return ieltsMetadata(lang, {
    title: section.title[lang],
    description: section.description[lang],
    path: `/${lang}/${section.id}`,
    languages: allLanguages((l) => `/${l}/${section.id}`),
  });
}

export default async function SectionPage({ params }: Props) {
  const { lang, section } = resolve(await params);
  const entries = getEntries(lang, { section: section.id });
  const counts = Object.fromEntries(
    categoriesInSection(section.id).map((c) => [c.id, entries.filter((e) => e.category === c.id).length]),
  );
  // Optional section intro written in MDX (e.g. goals on the Journey page).
  const intro = getPageContent("ielts", lang, section.id);

  return (
    <Container>
      <PageIntro
        eyebrow={countLabel(lang, entries.length)}
        title={section.title[lang]}
        description={section.description[lang]}
      />
      {intro && (
        <div className="pb-16 md:grid md:grid-cols-12">
          <div className="md:col-span-8">
            <MdxContent source={intro.body} />
          </div>
        </div>
      )}
      <div className="pb-8">
        <CategoryFilter lang={lang} section={section.id} counts={counts} />
      </div>
      <EntryList entries={entries} lang={lang} />
    </Container>
  );
}
