import type { Metadata } from "next";
import type { MainLocale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { getProfile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { WorkGrid } from "@/components/article/work-grid";
import { mainMetadata } from "@/lib/seo";

type Props = PageProps<"/[lang]/projects">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as MainLocale;
  const t = getMainDict(lang).pages;
  return mainMetadata(lang, { title: t.projectsTitle, description: t.projectsDescription, path: "/projects" });
}

/** Projects and academic work together (the old /research page redirects here). */
export default async function ProjectsPage({ params }: Props) {
  const lang = (await params).lang as MainLocale;
  const t = getMainDict(lang).pages;
  return (
    <>
      <PageIntro eyebrow={t.projectsEyebrow} title={t.projectsTitle} description={t.projectsDescription} />
      <Container>
        <WorkGrid
          works={getProfile(lang).works}
          emptyText={t.comingSoon}
          kindLabels={{ project: getMainDict(lang).home.project, research: getMainDict(lang).home.researchKind }}
        />
      </Container>
    </>
  );
}
