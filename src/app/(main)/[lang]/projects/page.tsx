import type { Metadata } from "next";
import type { Locale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { getProfile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { WorkGrid } from "@/components/article/work-grid";
import { mainMetadata } from "@/lib/seo";

type Props = PageProps<"/[lang]/projects">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang).pages;
  return mainMetadata(lang, { title: t.projectsTitle, description: t.projectsDescription, path: "/projects" });
}

export default async function ProjectsPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang).pages;
  return (
    <>
      <PageIntro eyebrow={t.projectsEyebrow} title={t.projectsTitle} description={t.projectsDescription} />
      <Container>
        <WorkGrid works={getProfile(lang).works.filter((w) => w.kind === "project")} emptyText={t.comingSoon} />
      </Container>
    </>
  );
}
