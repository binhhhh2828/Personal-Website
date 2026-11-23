import type { Metadata } from "next";
import type { Locale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { GalleryVault, type GalleryManifest } from "@/components/gallery/gallery-vault";
import { mainMetadata } from "@/lib/seo";
import manifest from "@/generated/gallery.json";

type Props = PageProps<"/[lang]/gallery">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang).pages;
  return mainMetadata(lang, { title: t.galleryEyebrow, description: t.galleryDescription, path: "/gallery" });
}

/** Albums are produced by `npm run gallery` (scripts/gallery.mjs) from private/gallery/. */
export default async function GalleryPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getMainDict(lang).pages;
  return (
    <>
      <PageIntro eyebrow={t.galleryEyebrow} title={t.galleryTitle} description={t.galleryDescription} />
      <Container className="pb-8">
        <GalleryVault manifest={manifest as GalleryManifest} lang={lang} />
      </Container>
    </>
  );
}
