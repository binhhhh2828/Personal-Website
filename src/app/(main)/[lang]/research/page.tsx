import type { Metadata } from "next";
import type { Locale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { getProfile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { WorkGrid } from "@/components/article/work-grid";
import { mainMetadata } from "@/lib/seo";

type Props = PageProps<"/[lang]/research">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang).pages;
  return mainMetadata(lang, { title: t.researchTitle, description: t.researchDescription, path: "/research" });
}

export default async function ResearchPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang).pages;
  return (
    <>
      <PageIntro eyebrow={t.researchEyebrow} title={t.researchTitle} description={t.researchDescription} />
      <Container>
        <WorkGrid works={getProfile(lang).works.filter((w) => w.kind === "research")} emptyText={t.comingSoon} />
      </Container>
    </>
  );
}
