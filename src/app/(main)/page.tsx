import type { Metadata } from "next";
import Link from "next/link";
import { ielts, ieltsHrefFromMain, site } from "@/config/site";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { Split } from "@/components/ui/split";
import { JournalList } from "@/components/article/journal-list";
import { FlipCard } from "@/components/effects/flip-card";
import { PolaroidBoard } from "@/components/effects/polaroid-board";
import { ScratchReveal } from "@/components/effects/scratch-reveal";
import { Spotlight } from "@/components/effects/spotlight";
import { StoryTimeline } from "@/components/effects/story-timeline";
import { TextScramble } from "@/components/effects/text-scramble";
import { getStoryChapters } from "@/lib/content/chapters";
import { getJournal } from "@/lib/content/journal";
import { mainMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...mainMetadata({ description: site.description, path: "/" }),
  title: { absolute: site.name },
};

/**
 * Home — seven sections that flow into each other: photos dissolve into the page
 * (split layouts) and sage bands melt into white (band-soft), so there are no hard edges.
 * Hero · About · Selected Works · Explorations · Journal · Beyond Work · Contact
 *
 * Effects: scratch-to-reveal photos, text scramble eyebrows, parallax hero glow,
 * story timeline, hover-reveal works, flip cards, cursor spotlight, draggable Polaroids.
 */
export default function Home() {
  const chapters = getStoryChapters();
  const works = profile.works.filter((w) => w.featured).slice(0, 3);
  const journal = getJournal().slice(0, 3);

  return (
    <>
      {/* 1 · Hero — text beside a full-bleed portrait that fades into the page */}
      <Split
        hero
        image={profile.portrait}
        alt={`Portrait of ${profile.name}`}
        label="Portrait"
        priority
        labelledBy="hero"
        className="aurora"
      >
        <div className="reveal">
          <p className="t-eyebrow text-badge">
            <TextScramble text={profile.name} className="text-fresh" />
          </p>
          <h1 id="hero" className="t-hero mt-3">
            {profile.headline}
          </h1>
          <p className="mt-5 max-w-[34ch] text-[19px] leading-[1.42] text-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/about" className="btn btn-primary">
              Read my story
            </Link>
            <a href="#works" className="link link-more">
              See my work
            </a>
          </div>
        </div>
      </Split>

      {/* 2 · About — the photo swaps sides; the grey band melts in and out */}
      <div className="band-soft">
        <Split side="left" image="/images/home/about.jpg" alt="Me as a kid, smiling on a pillow" label="About" labelledBy="about">
          <p className="t-eyebrow text-badge">About</p>
          <h2 id="about" className="t-headline mt-2">
            {profile.role}
          </h2>
          <p className="t-body-sm mt-3 text-muted">{profile.location}</p>
          <div className="mt-6 space-y-4 text-[19px] leading-[1.42]">
            {profile.aboutTeaser.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10">
            <StoryTimeline chapters={chapters} />
          </div>
          <Link href="/about" className="btn btn-primary mt-8">
            Read the full story
          </Link>
        </Split>
      </div>

      {/* 3 · Selected Works */}
      <section id="works" aria-labelledby="works-title" className="py-16 md:py-24">
        <Container>
          <SectionHeading
            id="works-title"
            eyebrow={<TextScramble text="Selected works" />}
            href="/projects"
            linkLabel="All projects"
            className="reveal-scroll"
          >
            Things I’ve built and studied.
          </SectionHeading>
          <ul className="reveal-scroll mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => {
              const inner = (
                <>
                  <Photo
                    src={w.image}
                    alt={w.title}
                    ratio="4/3"
                    rounded={false}
                    tone="raised"
                    label={w.title}
                    sizes="(min-width: 1068px) 480px, (min-width: 768px) 50vw, 100vw"
                  />
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
                    <a href={w.href} className="tile tile-link hover-reveal block h-full">
                      {inner}
                    </a>
                  ) : (
                    <div className="tile hover-reveal h-full">{inner}</div>
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
          <SectionHeading id="explorations" eyebrow={<TextScramble text="Explorations" />} className="reveal-scroll">
            What I keep coming back to.
          </SectionHeading>
          <ul className="reveal-scroll mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {profile.explorations.map((x, i) => (
              <li key={x.title}>
                <FlipCard index={i} title={x.title} note={x.note} />
              </li>
            ))}
          </ul>

          {/* IELTS Writing Lab — one exploration, given a black "Pro" tile */}
          <a
            href={ieltsHrefFromMain("/")}
            className="on-black tile-link reveal-scroll relative mt-5 block overflow-hidden rounded-[28px] px-7 py-12 text-center md:px-12 md:py-20"
          >
            <Spotlight />
            <p className="t-eyebrow text-on-black-muted">An exploration in language</p>
            <p className="t-display mx-auto mt-2">{ielts.name}</p>
            <p className="t-lede mx-auto mt-4 max-w-[30ch]">{ielts.tagline}</p>
            <span className="link link-more mt-6 inline-block">Visit the lab</span>
          </a>
        </Container>
      </section>

      {/* 5 · Journal — soft grey band, no hard edges */}
      <section aria-labelledby="journal" className="band-soft py-20 md:py-32">
        <Container>
          <SectionHeading
            id="journal"
            eyebrow={<TextScramble text="Journal" />}
            href="/journal"
            linkLabel="All notes"
            className="reveal-scroll"
          >
            Thoughts and notes.
          </SectionHeading>
          <div className="reveal-scroll mt-10">
            <JournalList entries={journal} emptyText="The first notes are being written." />
          </div>
        </Container>
      </section>

      {/* 6 · Beyond Work — Polaroids on a table: drag them around, scratch to see each photo */}
      <section aria-labelledby="beyond" className="py-16 md:py-24">
        <Container>
          <SectionHeading
            id="beyond"
            eyebrow={<TextScramble text="Beyond work" />}
            href="/about#leisure"
            linkLabel="More in my story"
            className="reveal-scroll"
          >
            Life outside the desk.
          </SectionHeading>
          <p className="reveal-scroll mt-3 text-muted">
            Scratch to see each photo<span className="hidden md:inline"> — and drag them around the table</span>.
          </p>
          <div className="reveal-scroll mt-10">
            <PolaroidBoard
              cards={profile.beyondWork.map((b) => (
                <figure key={b.image}>
                  <ScratchReveal id={b.image} hint="Scratch">
                    <Photo src={b.image} alt={b.title} ratio="1/1" rounded={false} label={b.title} sizes="320px" />
                  </ScratchReveal>
                  <figcaption className="px-1 pt-4">
                    <span className="polaroid-title">{b.title}</span>
                    <span className="mt-1 block text-[14px] leading-[1.4] text-muted">{b.note}</span>
                  </figcaption>
                </figure>
              ))}
            />
          </div>
        </Container>
      </section>

      {/* 7 · Contact — flows straight into the footer's grey */}
      <section id="contact" aria-labelledby="contact-title" className="relative pt-8 pb-4 md:pt-16">
        <Spotlight color="rgba(57, 181, 74, 0.28)" size={640} />
        <Container className="reveal-scroll text-center">
          <p className="t-eyebrow text-badge">Contact</p>
          <h2 id="contact-title" className="t-display mx-auto mt-2 w-fit text-fresh">
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
