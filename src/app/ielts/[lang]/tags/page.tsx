import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, type Locale } from "@/config/i18n";
import { ieltsHref } from "@/config/site";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { getTags } from "@/lib/content";
import { allLanguages, ieltsMetadata } from "@/lib/seo";

type Props = PageProps<"/ielts/[lang]/tags">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  return ieltsMetadata(lang, {
    title: t.allTags,
    description: t.allTags,
    path: `/${lang}/tags`,
    languages: allLanguages((l) => `/${l}/tags`),
  });
}

export default async function TagsPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const tags = getTags(lang);

  return (
    <>
      <PageIntro title={t.allTags} />
      <Container>
      {tags.length === 0 ? (
        <p className="tile px-6 py-10 text-center text-muted">{t.empty}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                href={ieltsHref(`/${lang}/tags/${tag}`)}
                className="btn btn-chip"
              >
                #{tag}
                <span className="opacity-60">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      </Container>
    </>
  );
}
