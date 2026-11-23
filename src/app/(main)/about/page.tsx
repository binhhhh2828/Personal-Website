import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { PageIntro } from "@/components/article/page-intro";
import { MdxContent } from "@/components/mdx/mdx-content";
import { getPageContent } from "@/lib/content";
import { getStoryChapters } from "@/lib/content/chapters";
import { mainMetadata } from "@/lib/seo";

const page = () => getPageContent("main", null, "about");

export function generateMetadata(): Metadata {
  const p = page();
  return mainMetadata({ title: p?.title ?? "About", description: p?.description ?? profile.intro, path: "/about" });
}

/** The life story: chapters written in content/pages/main/about.mdx. */
export default function AboutPage() {
  const p = page();
  if (!p) notFound();
  const chapters = getStoryChapters();

  return (
    <>
      <PageIntro center eyebrow={profile.name} title={p.title} description={p.description} />

      <Container>
        <Photo src={profile.portrait} alt={`Portrait of ${profile.name}`} ratio="16/9" label="Portrait" priority />
      </Container>

      {chapters.length > 1 && (
        <Container className="mt-10">
          <nav aria-label="Chapters" className="flex flex-wrap justify-center gap-2">
            {chapters.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="btn btn-chip">
                {c.title}
              </a>
            ))}
          </nav>
        </Container>
      )}

      <Container className="mt-6">
        <MdxContent source={p.body} variant="story" />
      </Container>

      <Container className="text-center">
        <div className="tile px-7 py-14 md:py-16">
          <h2 className="t-headline">Thanks for reading.</h2>
          <p className="t-lede mx-auto mt-4 max-w-[30ch] text-muted">See what I’m making, or say hello.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href="/projects" className="btn btn-primary">
              See my work
            </Link>
            <Link href="/#contact" className="link link-more">
              Get in touch
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
