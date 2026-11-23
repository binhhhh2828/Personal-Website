import type { Metadata } from "next";
import Link from "next/link";
import { ielts, ieltsHrefFromMain, site } from "@/config/site";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { JournalList } from "@/components/article/journal-list";
import { getStoryChapters } from "@/lib/content/chapters";
import { getJournal } from "@/lib/content/journal";
import { mainMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...mainMetadata({ description: site.description, path: "/" }),
  title: { absolute: site.name },
};

/**
 * Home — seven sections, alternating white and #F5F5F7 bands (Apple colour-blocking):
 * Hero · About · Selected Works · Explorations · Journal · Beyond Work · Contact
 */
export default function Home() {
  const chapters = getStoryChapters();
  const works = profile.works.filter((w) => w.featured).slice(0, 3);
  const journal = getJournal().slice(0, 3);

  return (
    <>
      {/* 1 · Hero */}
      <section aria-labelledby="hero" className="pt-14 pb-16 md:pt-24 md:pb-24">
        <Container className="reveal text-center">
          <p className="t-eyebrow text-badge">{profile.name}</p>
          <h1 id="hero" className="t-hero mx-auto mt-3 max-w-[16ch]">
            {profile.headline}
          </h1>
          <p className="t-lede mx-auto mt-6 max-w-[38ch] text-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href="/about" className="btn btn-primary">
              Read my story
            </Link>
            <a href="#works" className="link link-more">
              See my work
            </a>
          </div>
        </Container>
        <Container className="mt-12 md:mt-16">
          <Photo src={profile.portrait} alt={`Portrait of ${profile.name}`} ratio="16/9" label="Portrait" priority />
        </Container>
      </section>

      {/* 2 · About */}
      <section aria-labelledby="about" className="bg-surface py-16 md:py-24">
        <Container className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div>
            <p className="t-eyebrow text-badge">About</p>
            <h2 id="about" className="t-headline mt-2">
              {profile.role}
            </h2>
            <p className="t-body-sm mt-4 text-muted">{profile.location}</p>
          </div>
          <div>
            <div className="t-lede space-y-4 text-body">
              {profile.aboutTeaser.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {chapters.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Chapters of my story">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <Link href={`/about#${c.id}`} className="btn btn-chip !bg-canvas hover:!bg-surface-raised">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/about" className="link link-more mt-8 inline-block">
              Read the full story
            </Link>
          </div>
        </Container>
      </section>

      {/* 3 · Selected Works */}
      <section id="works" aria-labelledby="works-title" className="py-16 md:py-24">
        <Container>
          <SectionHeading id="works-title" eyebrow="Selected works" href="/projects" linkLabel="All projects">
            Things I’ve built and studied.
          </SectionHeading>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => {
              const inner = (
                <>
                  <Photo src={w.image} alt={w.title} ratio="4/3" rounded={false} tone="raised" label={w.title} sizes="(min-width: 1068px) 320px, (min-width: 768px) 50vw, 100vw" />
                  <div className="p-6 md:p-7">
                    <p className="t-caption text-badge">
                      {w.kind === "project" ? "Project" : "Research"}
                      <span className="text-muted"> · {w.year}</span>
                    </p>
                    <h3 className="t-title mt-2">{w.title}</h3>
                    <p className="mt-2 text-muted">{w.summary}</p>
                  </div>
                </>
              );
              return (
                <li key={w.title}>
                  {w.href ? (
                    <a href={w.href} className="tile tile-link block h-full">
                      {inner}
                    </a>
                  ) : (
                    <div className="tile h-full">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-8">
            <Link href="/research" className="link link-more">
              Research
            </Link>
          </p>
        </Container>
      </section>

      {/* 4 · Explorations */}
      <section aria-labelledby="explorations" className="pb-16 md:pb-24">
        <Container>
          <SectionHeading id="explorations" eyebrow="Explorations">
            What I keep coming back to.
          </SectionHeading>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {profile.explorations.map((x) => (
              <li key={x.title} className="tile p-7 md:p-9">
                <h3 className="t-title">{x.title}</h3>
                <p className="mt-2 text-muted">{x.note}</p>
              </li>
            ))}
          </ul>

          {/* IELTS Writing Lab — one exploration, given a black "Pro" tile */}
          <a
            href={ieltsHrefFromMain("/")}
            className="on-black tile-link mt-5 block rounded-[28px] px-7 py-12 text-center md:px-12 md:py-16"
          >
            <p className="t-eyebrow text-on-black-muted">An exploration in language</p>
            <p className="t-display mx-auto mt-2">{ielts.name}</p>
            <p className="t-lede mx-auto mt-4 max-w-[30ch]">{ielts.tagline}</p>
            <span className="link link-more mt-6 inline-block">Visit the lab</span>
          </a>
        </Container>
      </section>

      {/* 5 · Journal */}
      <section aria-labelledby="journal" className="bg-surface py-16 md:py-24">
        <Container>
          <SectionHeading id="journal" eyebrow="Journal" href="/journal" linkLabel="All notes">
            Thoughts and notes.
          </SectionHeading>
          <div className="mt-10">
            <JournalList entries={journal} emptyText="The first notes are being written." />
          </div>
        </Container>
      </section>

      {/* 6 · Beyond Work */}
      <section aria-labelledby="beyond" className="py-16 md:py-24">
        <Container>
          <SectionHeading id="beyond" eyebrow="Beyond work" href="/about#leisure" linkLabel="More in my story">
            Life outside the desk.
          </SectionHeading>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {profile.beyondWork.map((b) => (
              <li key={b.image}>
                <Photo src={b.image} alt={b.title} ratio="4/5" label={b.title} sizes="(min-width: 768px) 320px, 100vw" />
                <h3 className="t-title mt-5">{b.title}</h3>
                <p className="mt-1 text-muted">{b.note}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 7 · Contact */}
      <section id="contact" aria-labelledby="contact-title" className="border-t border-hairline pt-16 md:pt-24">
        <Container className="text-center">
          <p className="t-eyebrow text-badge">Contact</p>
          <h2 id="contact-title" className="t-display mx-auto mt-2">
            Let’s talk.
          </h2>
          <p className="t-lede mx-auto mt-5 max-w-[34ch] text-muted">{profile.contact.note}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {profile.contact.email ? (
              <a href={`mailto:${profile.contact.email}`} className="btn btn-primary">
                {profile.contact.email}
              </a>
            ) : (
              <span className="btn btn-chip">[Placeholder] Add your email in src/config/profile.ts</span>
            )}
            {profile.contact.links.map((l) => (
              <a key={l.href} href={l.href} className="btn btn-outline">
                {l.label}
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
