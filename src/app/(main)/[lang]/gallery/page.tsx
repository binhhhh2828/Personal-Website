import type { Metadata } from "next";
import type { MainLocale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { Container } from "@/components/ui/container";
import { GalleryVault, type GalleryManifest } from "@/components/gallery/gallery-vault";
import { mainMetadata } from "@/lib/seo";
import manifest from "@/generated/gallery.json";

type Props = PageProps<"/[lang]/gallery">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as MainLocale;
  const t = getMainDict(lang).pages;
  return mainMetadata(lang, { title: t.galleryEyebrow, description: t.galleryDescription, path: "/gallery" });
}

/**
 * The photo album, on a dark page — old photos look best on black.
 * Albums are produced by `npm run gallery` (scripts/gallery.mjs) from private/gallery/.
 */
export default async function GalleryPage({ params }: Props) {
  const lang = (await params).lang as MainLocale;
  const t = getMainDict(lang).pages;
  return (
    <div className="night gallery-page pb-40">
      <Container className="reveal pt-20 pb-14 md:pt-28 md:pb-20">
        <p className="t-eyebrow text-badge">{t.galleryEyebrow}</p>
        <h1 className="t-hero mt-3 max-w-[16ch]">{t.galleryTitle}</h1>
        <p className="mt-6 max-w-[52ch] text-[19px] leading-[1.5] text-muted">{t.galleryDescription}</p>
      </Container>
      <Container>
        <GalleryVault manifest={manifest as GalleryManifest} lang={lang} />
      </Container>
    </div>
  );
}
