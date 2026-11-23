import type { Metadata } from "next";
import Link from "next/link";
import { ielts, ieltsHrefFromMain, site } from "@/config/site";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { mainMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...mainMetadata({ description: site.description, path: "/" }),
  title: { absolute: site.name },
};

export default function Home() {
  return (
    <Container>
      {/* Hero */}
      <section className="reveal grid gap-8 pt-16 pb-20 md:grid-cols-12 md:pt-28 md:pb-28">
        <div className="md:col-span-10">
          <Eyebrow className="mb-6">{profile.name}</Eyebrow>
          <h1 className="text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
            {profile.headline}
          </h1>
        </div>
        <div className="space-y-4 font-body text-lg leading-relaxed text-muted md:col-span-6">
          {profile.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {/* Areas of interest — an index, not cards */}
      <section aria-labelledby="areas" className="pb-24">
        <SectionHeading id="areas">Areas</SectionHeading>
        <ol className="mt-2">
          {profile.interests.map((item, i) => (
            <li key={item.label} className="grid gap-1 border-b border-rule py-5 md:grid-cols-12 md:gap-8">
              <span className="font-mono text-xs text-subtle md:col-span-1 md:pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg font-semibold tracking-tight md:col-span-4">{item.label}</span>
              <span className="font-body text-muted md:col-span-7">{item.note}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* IELTS Writing Lab — the sub-publication */}
      <section aria-labelledby="ielts" className="grid gap-8 pb-24 md:grid-cols-12">
        <div className="md:col-span-12">
          <SectionHeading id="ielts">Sub-publication</SectionHeading>
        </div>
        <div className="md:col-span-7">
          <p className="font-display text-5xl leading-none italic sm:text-6xl">IELTS</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">Writing Lab</p>
          <p className="mt-6 max-w-[48ch] font-body text-lg leading-relaxed text-muted">
            {ielts.tagline} A bilingual (Vietnamese / English) notebook on writing, argument and language — and
            a public log of the journey from IELTS 7.0 to 8.0.
          </p>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:self-end">
          <a
            href={ieltsHrefFromMain("/")}
            className="text-sm font-medium underline decoration-accent decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            Enter IELTS Writing Lab ↗
          </a>
        </div>
      </section>

      {/* Selected projects */}
      <section aria-labelledby="projects" className="pb-8">
        <SectionHeading id="projects" href="/projects" linkLabel="All projects">
          Selected projects
        </SectionHeading>
        <ul className="mt-2">
          {profile.projects.slice(0, 3).map((p) => (
            <li key={p.title} className="grid gap-1 border-b border-rule py-5 md:grid-cols-12 md:gap-8">
              <span className="font-mono text-xs text-muted md:col-span-2 md:pt-1">{p.year}</span>
              <span className="text-lg font-semibold tracking-tight md:col-span-4">{p.title}</span>
              <span className="font-body text-muted md:col-span-6">{p.summary}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/about" className="text-sm text-muted hover:text-fg">
            About →
          </Link>
        </p>
      </section>
    </Container>
  );
}
