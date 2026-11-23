import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { getProfile } from "@/config/profile";
import { mainPath } from "@/config/site";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { MdxContent } from "@/components/mdx/mdx-content";
import { getPageContent } from "@/lib/content";
import { getStoryChapters } from "@/lib/content/chapters";
import { mainMetadata } from "@/lib/seo";

type Props = PageProps<"/[lang]/about">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const p = getPageContent("main", lang, "about");
  return mainMetadata(lang, {
    title: p?.title ?? getMainDict(lang).nav.about,
    description: p?.description ?? getProfile(lang).intro,
    path: "/about",
  });
}

/** The life story: chapters written in content/pages/main/{lang}/about.mdx. */
export default async function AboutPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const p = getPageContent("main", lang, "about");
  if (!p) notFound();
  const t = getMainDict(lang).about;
  const chapters = getStoryChapters(lang);

  return (
    <>
      <PageIntro center eyebrow={getProfile(lang).name} title={p.title} description={p.description} />

      {chapters.length > 1 && (
        <Container>
          <nav aria-label={t.chapters} className="flex flex-wrap justify-center gap-2">
            {chapters.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="btn btn-chip">
                {c.title}
              </a>
            ))}
          </nav>
        </Container>
      )}

      {/* Chapters render full-bleed: each photo dissolves into the text beside it. */}
      <div className="mt-4">
        <MdxContent source={p.body} variant="story" lang={lang} />
      </div>

      <Container className="text-center">
        <div className="tile px-7 py-14 md:py-16">
          <h2 className="t-headline">{t.thanksTitle}</h2>
          <p className="t-lede mx-auto mt-4 max-w-[30ch] text-muted">{t.thanksBody}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href={mainPath(lang, "/projects")} className="btn btn-primary">
              {t.seeWork}
            </Link>
            <Link href={mainPath(lang, "/#contact")} className="link link-more">
              {t.getInTouch}
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
