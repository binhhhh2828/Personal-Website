import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { GalleryVault, type GalleryManifest } from "@/components/gallery/gallery-vault";
import { mainMetadata } from "@/lib/seo";
import manifest from "@/generated/gallery.json";

const description =
  "Childhood, school and game photo sets. A few previews are open to everyone — the full albums are encrypted and need a password.";

export const metadata: Metadata = mainMetadata({ title: "Gallery", description, path: "/gallery" });

/** Albums are produced by `npm run gallery` (scripts/gallery.mjs) from private/gallery/. */
export default function GalleryPage() {
  return (
    <>
      <PageIntro eyebrow="Gallery" title="Photos, mostly unfiltered." description={description} />
      <Container className="pb-8">
        <GalleryVault manifest={manifest as GalleryManifest} />
      </Container>
    </>
  );
}
