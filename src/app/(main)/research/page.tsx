import type { Metadata } from "next";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { mainMetadata } from "@/lib/seo";

const description = "[Placeholder] Questions I am investigating, papers and research notes.";

export const metadata: Metadata = mainMetadata({ title: "Research", description, path: "/research" });

export default function ResearchPage() {
  return (
    <Container>
      <PageIntro eyebrow="Index" title="Research" description={description} />
      <ol className="border-t border-rule">
        {profile.research.map((r) => (
          <li key={r.title} className="grid gap-2 border-b border-rule py-7 md:grid-cols-12 md:gap-8">
            <span className="font-mono text-xs text-muted md:col-span-2 md:pt-1.5">{r.year}</span>
            <div className="md:col-span-7">
              <h2 className="text-xl font-semibold tracking-tight">
                {r.href ? (
                  <a href={r.href} className="hover:text-accent-ink">
                    {r.title} ↗
                  </a>
                ) : (
                  r.title
                )}
              </h2>
              <p className="mt-2 font-body leading-relaxed text-muted">{r.summary}</p>
            </div>
            {r.venue && <p className="font-mono text-xs text-muted md:col-span-3 md:pt-1.5 md:text-right">{r.venue}</p>}
          </li>
        ))}
      </ol>
    </Container>
  );
}
