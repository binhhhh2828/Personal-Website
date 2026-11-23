import type { Metadata } from "next";
import Link from "next/link";
import { ielts, ieltsHrefFromMain, mainPath, site } from "@/config/site";
import { ieltsLocaleFor, type MainLocale } from "@/config/i18n";
import { getMainDict } from "@/config/main-i18n";
import { getProfile } from "@/config/profile";
import { Container } from "@/components/ui/container";
import { Photo, imageExists } from "@/components/ui/photo";
import { isPlaceholder, showDrafts } from "@/lib/drafts";
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

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = (await params).lang as MainLocale;
  return {
    ...mainMetadata(lang, {
      description: getMainDict(lang).siteDescription,
      path: "/",
    }),
    title: { absolute: site.name },
  };
}

/**
 * Home — seven sections that flow into each other: photos dissolve into the page
 * (split layouts) and sage bands melt into white (band-soft), so there are no hard edges.
 * Hero · About · Selected Works · Explorations · Journal · Beyond Work · Contact
 *
 * Effects: scratch-to-reveal photos, text scramble eyebrows, parallax hero glow,
 * story timeline, hover-reveal works, flip cards, cursor spotlight, draggable Polaroids.
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as MainLocale;
  const t = getMainDict(lang);
  const h = t.home;
  const profile = getProfile(lang);
  const href = (path: string) => mainPath(lang, path);
  const chapters = getStoryChapters(lang);
  // Placeholder works stay out of sight for visitors until real ones are added.
  const works = profile.works
    .filter((w) => w.featured && (showDrafts || !isPlaceholder(w.title)))
    .slice(0, 3);
  const journal = getJournal().slice(0, 3);

  return (
    <>
      {/* 1 · Hero — text beside a full-bleed portrait that fades into the page */}
      <Split
        hero
        image={profile.portrait}
        alt={`${h.portraitAlt} ${profile.name}`}
        label={h.portraitLabel}
        lang={lang}
        priority
        labelledBy="hero"
        className="night aurora"
      >
        <div className="reveal">
          <p className="t-eyebrow text-badge">
            <TextScramble text={profile.name} className="text-fresh" />
          </p>
          <h1 id="hero" className="t-hero mt-3">
            {profile.headline}
          </h1>
          <p className="mt-5 max-w-[34ch] text-[19px] leading-[1.42] text-muted">
            {profile.intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href={href("/about")} className="btn btn-primary">
              {h.readStory}
            </Link>
            {works.length > 0 ? (
              <a href="#works" className="link link-more">
                {h.seeWork}
              </a>
            ) : (
              <Link href={href("/gallery")} className="link link-more">
                {h.seeAlbum}
              </Link>
            )}
          </div>
        </div>
      </Split>

      {/* 2 · About — the photo swaps sides; the grey band melts in and out */}
      <div className="band-soft">
        <Split
          side="left"
          scratch={false}
          lang={lang}
          image="/images/home/about.jpg"
          alt={h.aboutPhotoAlt}
          label={h.aboutEyebrow}
          labelledBy="about"
        >
          <p className="t-eyebrow text-badge">{h.aboutEyebrow}</p>
          <h2 id="about" className="t-headline mt-2">
            {profile.role}
          </h2>
          <p className="t-body-sm mt-3 text-muted">{profile.location}</p>
          <div className="mt-6 space-y-4 text-[19px] leading-[1.42]">
            {profile.aboutTeaser.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="facts mt-8">
            {profile.facts.map((f) => (
              <div key={f.label} className="fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <StoryTimeline chapters={chapters} lang={lang} />
          </div>
          <Link href={href("/about")} className="btn btn-primary mt-8">
            {h.readFullStory}
          </Link>
        </Split>
      </div>

      {/* 3 · Selected Works — hidden until there is at least one real work */}
      {works.length > 0 && (
        <section
          id="works"
          aria-labelledby="works-title"
          className="py-16 md:py-24"
        >
          <Container>
            <SectionHeading
              id="works-title"
              eyebrow={h.worksEyebrow}
              href={href("/projects")}
              linkLabel={h.allProjects}
              className="reveal-scroll"
            >
              {h.worksTitle}
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
                        {w.kind === "project" ? h.project : h.researchKind}
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
                      <a
                        href={w.href}
                        className="tile tile-link hover-reveal block h-full"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="tile hover-reveal h-full">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      {/* 4 · Explorations */}
      <section aria-labelledby="explorations" className="pb-16 md:pb-24">
        <Container>
          <SectionHeading
            id="explorations"
            eyebrow={h.explorationsEyebrow}
            className="reveal-scroll"
          >
            {h.explorationsTitle}
          </SectionHeading>
          <ul className="reveal-scroll mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {profile.explorations.map((x, i) => (
              <li key={x.title}>
                <FlipCard
                  index={i}
                  title={x.title}
                  note={x.note}
                  hint={t.effects.flip}
                />
              </li>
            ))}
          </ul>

          {/* IELTS Writing Lab — one exploration, given a black "Pro" tile */}
          <a
            href={ieltsHrefFromMain(`/${ieltsLocaleFor(lang)}`)}
            className="on-black tile-link reveal-scroll relative mt-5 block overflow-hidden rounded-[28px] px-7 py-12 text-center md:px-12 md:py-20"
          >
            <Spotlight />
            <p className="t-eyebrow text-on-black-muted">{h.ieltsEyebrow}</p>
            <p className="t-display mx-auto mt-2">{ielts.name}</p>
            <p className="t-lede mx-auto mt-4 max-w-[30ch]">{h.ieltsTagline}</p>
            <span className="link link-more mt-6 inline-block">
              {h.visitLab}
            </span>
          </a>
        </Container>
      </section>

      {/* 5 · Journal — soft grey band, no hard edges */}
      <section aria-labelledby="journal" className="band-soft py-20 md:py-32">
        <Container>
          <SectionHeading
            id="journal"
            eyebrow={h.journalEyebrow}
            href={href("/journal")}
            linkLabel={h.allNotes}
            className="reveal-scroll"
          >
            {h.journalTitle}
          </SectionHeading>
          <div className="reveal-scroll mt-10">
            <JournalList
              entries={journal}
              emptyText={h.journalEmpty}
              lang={lang}
            />
          </div>
        </Container>
      </section>

      {/* 6 · Beyond Work — Polaroids on a table: drag them around, scratch to see each photo */}
      <section aria-labelledby="beyond" className="py-16 md:py-24">
        <Container>
          <SectionHeading
            id="beyond"
            eyebrow={h.beyondEyebrow}
            href={href("/about#leisure")}
            linkLabel={h.moreInStory}
            className="reveal-scroll"
          >
            {h.beyondTitle}
          </SectionHeading>
          <p className="reveal-scroll mt-3 text-muted">
            {h.beyondHint}
            <span className="hidden md:inline">{h.beyondHintDrag}</span>.
          </p>
          <div className="reveal-scroll mt-10">
            <PolaroidBoard
              tidyLabel={h.tidy}
              cards={profile.beyondWork.map((b) => (
                <figure key={b.image}>
                  {imageExists(b.image) ? (
                    <ScratchReveal
                      id={b.image}
                      lang={lang}
                      hint={t.effects.scratchShort}
                    >
                      <Photo
                        src={b.image}
                        alt={b.title}
                        ratio="1/1"
                        rounded={false}
                        label={b.title}
                        sizes="320px"
                      />
                    </ScratchReveal>
                  ) : (
                    <Photo
                      src={b.image}
                      alt={b.title}
                      ratio="1/1"
                      rounded={false}
                      label={b.title}
                      sizes="320px"
                    />
                  )}
                  <figcaption className="px-1 pt-4">
                    <span className="polaroid-title">{b.title}</span>
                    <span className="mt-1 block text-[14px] leading-[1.4] text-muted">
                      {b.note}
                    </span>
                  </figcaption>
                </figure>
              ))}
            />
          </div>
        </Container>
      </section>

      {/* 7 · Contact — flows straight into the footer's grey */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="night-both relative pt-40 pb-36 md:pt-52 md:pb-44"
      >
        <Spotlight color="rgba(197, 240, 74, 0.14)" size={640} />
        <Container className="reveal-scroll text-center">
          <p className="t-eyebrow text-badge">{h.contactEyebrow}</p>
          <h2
            id="contact-title"
            className="t-display mx-auto mt-2 w-fit text-fresh"
          >
            {h.contactTitle}
          </h2>
          <p className="t-lede mx-auto mt-5 max-w-[34ch] text-muted">
            {profile.contact.note}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {profile.contact.email ? (
              <a
                href={`mailto:${profile.contact.email}`}
                className="btn btn-primary"
              >
                {profile.contact.email}
              </a>
            ) : (
              showDrafts && (
                <span className="btn btn-chip">{h.emailMissing}</span>
              )
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
