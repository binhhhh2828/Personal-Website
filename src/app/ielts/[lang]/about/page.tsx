import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/config/i18n";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { MdxContent } from "@/components/mdx/mdx-content";
import { getPageContent } from "@/lib/content";
import { allLanguages, ieltsMetadata } from "@/lib/seo";

type Props = PageProps<"/ielts/[lang]/about">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const page = getPageContent("ielts", lang, "about");
  return ieltsMetadata(lang, {
    title: page?.title ?? getDictionary(lang).about,
    description: page?.description ?? "",
    path: `/${lang}/about`,
    languages: allLanguages((l) => `/${l}/about`),
  });
}

export default async function AboutPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const page = getPageContent("ielts", lang, "about");
  if (!page) notFound();

  return (
    <Container>
      <PageIntro title={page.title} />
      <div className="md:grid md:grid-cols-12">
        <div className="md:col-span-8">
          <MdxContent source={page.body} />
        </div>
      </div>
    </Container>
  );
}
