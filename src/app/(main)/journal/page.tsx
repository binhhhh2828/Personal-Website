import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { JournalList } from "@/components/article/journal-list";
import { getJournal } from "@/lib/content/journal";
import { mainMetadata } from "@/lib/seo";

const description = "Personal thoughts and notes — on learning, building and everything in between.";

export const metadata: Metadata = mainMetadata({ title: "Journal", description, path: "/journal" });

export default function JournalPage() {
  return (
    <>
      <PageIntro eyebrow="Journal" title="Thoughts and notes." description={description} />
      <Container>
        <JournalList entries={getJournal()} emptyText="The first notes are being written." />
      </Container>
    </>
  );
}
