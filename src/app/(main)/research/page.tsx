import type { Metadata } from "next";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { WorkGrid } from "@/components/article/work-grid";
import { mainMetadata } from "@/lib/seo";

const description = "[Placeholder] Questions I am investigating, papers and research notes.";

export const metadata: Metadata = mainMetadata({ title: "Research", description, path: "/research" });

export default function ResearchPage() {
  return (
    <>
      <PageIntro eyebrow="Selected works" title="Research" description={description} />
      <Container>
        <WorkGrid works={profile.works.filter((w) => w.kind === "research")} />
      </Container>
    </>
  );
}
