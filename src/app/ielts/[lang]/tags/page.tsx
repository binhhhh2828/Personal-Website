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
    <Container>
      <PageIntro title={t.allTags} />
      {tags.length === 0 ? (
        <p className="border-t border-rule py-8 font-mono text-sm text-muted">{t.empty}</p>
      ) : (
        <ul className="grid border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
          {tags.map(({ tag, count }) => (
            <li key={tag} className="border-b border-rule">
              <Link
                href={ieltsHref(`/${lang}/tags/${tag}`)}
                className="flex items-baseline justify-between py-4 pr-6 font-mono text-sm hover:text-accent-ink"
              >
                #{tag}
                <span className="text-xs text-muted">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
