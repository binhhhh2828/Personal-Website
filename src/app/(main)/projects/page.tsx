import type { Metadata } from "next";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { mainMetadata } from "@/lib/seo";

const description = "[Placeholder] Things I have built — products, tools and experiments.";

export const metadata: Metadata = mainMetadata({ title: "Projects", description, path: "/projects" });

export default function ProjectsPage() {
  return (
    <Container>
      <PageIntro eyebrow="Index" title="Projects" description={description} />
      <ol className="border-t border-rule">
        {profile.projects.map((p) => (
          <li key={p.title} className="grid gap-2 border-b border-rule py-7 md:grid-cols-12 md:gap-8">
            <span className="font-mono text-xs text-muted md:col-span-2 md:pt-1.5">{p.year}</span>
            <div className="md:col-span-6">
              <h2 className="text-xl font-semibold tracking-tight">
                {p.href ? (
                  <a href={p.href} className="hover:text-accent-ink">
                    {p.title} ↗
                  </a>
                ) : (
                  p.title
                )}
              </h2>
              <p className="mt-2 font-body leading-relaxed text-muted">{p.summary}</p>
            </div>
            <div className="font-mono text-xs text-muted md:col-span-4 md:pt-1.5 md:text-right">
              {p.role && <p>{p.role}</p>}
              <p>{p.tags.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  );
}
