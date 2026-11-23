import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { countLabel, getDictionary, locales, type Locale } from "@/config/i18n";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { EntryList } from "@/components/article/entry-list";
import { getEntries, getTags } from "@/lib/content";
import { ieltsMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getTags(lang).map(({ tag }) => ({ lang, tag })));
}

type Props = PageProps<"/ielts/[lang]/tags/[tag]">;

async function resolve(params: Props["params"]) {
  const p = await params;
  return { lang: p.lang as Locale, tag: decodeURIComponent(p.tag) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await resolve(params);
  const t = getDictionary(lang);
  const languages = Object.fromEntries(
    locales.filter((l) => getTags(l).some((x) => x.tag === tag)).map((l) => [l, `/${l}/tags/${tag}`]),
  );
  return ieltsMetadata(lang, {
    title: `#${tag}`,
    description: `${t.taggedWith} #${tag}`,
    path: `/${lang}/tags/${tag}`,
    languages,
  });
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await resolve(params);
  const t = getDictionary(lang);
  const entries = getEntries(lang, { tag });
  if (entries.length === 0) notFound();

  return (
    <>
      <PageIntro eyebrow={`${t.taggedWith} · ${countLabel(lang, entries.length)}`} title={`#${tag}`} />
      <Container>
      <EntryList entries={entries} lang={lang} />
      </Container>
    </>
  );
}
