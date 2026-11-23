import type { Metadata } from "next";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { WorkGrid } from "@/components/article/work-grid";
import { mainMetadata } from "@/lib/seo";

const description = "[Placeholder] Things I have built — products, tools and experiments.";

export const metadata: Metadata = mainMetadata({ title: "Projects", description, path: "/projects" });

export default function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="Selected works" title="Projects" description={description} />
      <Container>
        <WorkGrid works={profile.works.filter((w) => w.kind === "project")} />
      </Container>
    </>
  );
}
