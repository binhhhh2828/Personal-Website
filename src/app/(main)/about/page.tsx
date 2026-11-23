import type { Metadata } from "next";
import { ieltsHrefFromMain } from "@/config/site";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/article/page-intro";
import { mainMetadata } from "@/lib/seo";

export const metadata: Metadata = mainMetadata({
  title: "About",
  description: profile.about[0],
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container>
      <PageIntro title="About" />
      <div className="grid gap-12 md:grid-cols-12">
        <div className="prose md:col-span-7">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            I also keep <a href={ieltsHrefFromMain("/")}>IELTS Writing Lab</a>, a bilingual notebook on writing and
            language learning.
          </p>
        </div>
        <aside className="md:col-span-3 md:col-start-10">
          <p className="mb-3 font-mono text-xs tracking-[0.08em] text-muted uppercase">Elsewhere</p>
          {profile.links.length === 0 ? (
            <p className="font-mono text-xs text-muted">[Placeholder] Add links in src/config/profile.ts</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {profile.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="underline decoration-rule underline-offset-4 hover:decoration-fg">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </Container>
  );
}
