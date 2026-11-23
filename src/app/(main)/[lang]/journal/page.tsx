import type { Metadata } from "next";
import type { Locale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { JournalList } from "@/components/article/journal-list";
import { getJournal } from "@/lib/content/journal";
import { mainMetadata } from "@/lib/seo";

type Props = PageProps<"/[lang]/journal">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang);
  return mainMetadata(lang, { title: t.nav.journal, description: t.pages.journalDescription, path: "/journal" });
}

/** Every note, whichever language it is written in (other-language notes carry a badge). */
export default async function JournalPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang);
  return (
    <>
      <PageIntro eyebrow={t.nav.journal} title={t.pages.journalTitle} description={t.pages.journalDescription} />
      <Container>
        <JournalList entries={getJournal()} emptyText={t.home.journalEmpty} lang={lang} />
      </Container>
    </>
  );
}
