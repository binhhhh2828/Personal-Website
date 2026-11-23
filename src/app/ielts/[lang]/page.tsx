import type { Metadata } from "next";
import Link from "next/link";
import { contentTypeLabels, getCategory, writingFramework } from "@/config/content";
import { getDictionary, type Locale } from "@/config/i18n";
import { ielts, ieltsHref } from "@/config/site";
import { Container } from "@/components/ui/container";
import { BlackBand } from "@/components/ui/band";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { EntryList } from "@/components/article/entry-list";
import { entryHref, getEntries } from "@/lib/content";
import { allLanguages, ieltsMetadata } from "@/lib/seo";

const copy = {
  vi: {
    intro:
      "Một phòng thí nghiệm cá nhân về IELTS Writing: ghi lại hành trình từ 7.0 đến 8.0, và chia sẻ cách tư duy đằng sau một bài viết tốt — từ đọc đề, phát triển ý đến lựa chọn ngôn ngữ.",
    taglineVi: "Học cách tư duy, không chỉ học cách viết.",
    startReading: "Bắt đầu với Writing Lab",
    journeyTitle: "Từ 7.0 đến 8.0.",
    journeyBody:
      "Mục tiêu ở kỹ năng Writing. Nhật ký học, tiến độ và những suy ngẫm được cập nhật công khai.",
    start: "Điểm xuất phát",
    target: "Mục tiêu",
    followJourney: "Theo dõi hành trình",
    featuredTitle: "Những bài nên đọc trước.",
    frameworkTitle: "Sáu bước để nghĩ trọn một bài luận.",
    frameworkIntro: "Mỗi bước dẫn đến các bài học liên quan.",
    latestTitle: "Mới nhất từ phòng lab.",
    aboutBody:
      "IELTS Writing Lab là một phần của trang cá nhân — nơi tôi ghi lại quá trình học và chia sẻ những gì hữu ích cho người học ở khoảng band 5.5–7.0.",
    aboutLink: "Về tác giả và triết lý học",
  },
  en: {
    intro:
      "A personal lab for IELTS Writing: documenting the journey from 7.0 to 8.0, and sharing the thinking behind a strong essay — from reading the question to developing ideas and choosing language.",
    taglineVi: null,
    startReading: "Start with the Writing Lab",
    journeyTitle: "From 7.0 to 8.0.",
    journeyBody: "The goal, in Writing. Learning logs, progress and reflections are published in the open.",
    start: "Starting point",
    target: "Target",
    followJourney: "Follow the journey",
    featuredTitle: "Where to begin.",
    frameworkTitle: "Six steps to think an essay through.",
    frameworkIntro: "Each step leads to the lessons that teach it.",
    latestTitle: "Latest from the lab.",
    aboutBody:
      "IELTS Writing Lab is part of my personal website — a place to document my learning and share what is useful for learners around band 5.5–7.0.",
    aboutLink: "About the author and the approach",
  },
} satisfies Record<Locale, Record<string, string | null>>;

export async function generateMetadata({ params }: PageProps<"/ielts/[lang]">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return {
    ...ieltsMetadata(lang, {
      description: `${ielts.tagline} ${copy[lang].intro}`,
      path: `/${lang}`,
      languages: allLanguages((l) => `/${l}`),
    }),
    title: { absolute: `${ielts.name} — ${ielts.tagline}` },
  };
}

export default async function IeltsHome({ params }: PageProps<"/ielts/[lang]">) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = copy[lang];

  const all = getEntries(lang);
  const lessons = all.filter((e) => e.type === "lesson" || e.type === "breakdown");
  const featured = (all.some((e) => e.featured) ? all.filter((e) => e.featured) : lessons).slice(0, 3);
  const latest = all.filter((e) => !featured.includes(e)).slice(0, 5);

  return (
    <>
      {/* Hero — black "Pro" tile */}
      <BlackBand className="band-black-soft pt-14 pb-28 md:pt-24 md:pb-40">
        <Container className="reveal text-center">
          <p className="t-eyebrow text-on-black-muted">{ielts.name}</p>
          <h1 lang="en" className="t-hero mx-auto mt-3 max-w-[14ch]">
            Learn to think, not just to write.
          </h1>
          {c.taglineVi && <p className="t-lede mx-auto mt-5">{c.taglineVi}</p>}
          <p className="mx-auto mt-5 max-w-[52ch] text-on-black-muted">{c.intro}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href={ieltsHref(`/${lang}/writing-lab`)} className="btn btn-primary">
              {c.startReading}
            </Link>
            <Link href={ieltsHref(`/${lang}/journey`)} className="link link-more">
              {c.followJourney}
            </Link>
          </div>
        </Container>
        <Container className="mt-12 md:mt-16">
          <Photo src="/images/ielts/hero.jpg" alt="IELTS Writing Lab" ratio="16/9" label="IELTS Writing Lab" priority tone="dark" className="fade-bottom" />
        </Container>
      </BlackBand>

      {/* Journey */}
      <section
        aria-labelledby="journey"
        className="bg-[linear-gradient(to_bottom,var(--surface)_calc(100%-7rem),var(--canvas))] pt-4 pb-20 md:pb-32"
      >
        <Container className="text-center">
          <p className="t-eyebrow text-badge">{t.journey}</p>
          <h2 id="journey" className="t-headline mt-2">
            {c.journeyTitle}
          </h2>
          <dl className="mx-auto mt-10 flex max-w-xl items-end justify-center gap-6 md:gap-12" lang="en">
            <div>
              <dt className="t-body-sm text-muted">{c.start}</dt>
              <dd className="mt-1 font-display text-[72px] leading-none font-semibold tracking-[-0.02em] text-ink md:text-[112px]">
                7.0
              </dd>
            </div>
            <span aria-hidden className="pb-3 text-3xl text-faint md:pb-5 md:text-5xl">
              →
            </span>
            <div>
              <dt className="t-body-sm text-link">{c.target}</dt>
              <dd className="mt-1 font-display text-[72px] leading-none font-semibold tracking-[-0.02em] text-primary md:text-[112px]">
                8.0
              </dd>
            </div>
          </dl>
          <p className="t-lede mx-auto mt-10 max-w-[34ch] text-muted">{c.journeyBody}</p>
          <Link href={ieltsHref(`/${lang}/journey`)} className="link link-more mt-6 inline-block">
            {c.followJourney}
          </Link>
        </Container>
      </section>

      {/* Featured lessons */}
      <section aria-labelledby="featured" className="py-16 md:py-24">
        <Container>
          <SectionHeading
            id="featured"
            eyebrow={t.featuredLessons}
            href={ieltsHref(`/${lang}/writing-lab`)}
            linkLabel={t.viewAll}
          >
            {c.featuredTitle}
          </SectionHeading>
          {featured.length === 0 ? (
            <div className="mt-10">
              <EntryList entries={[]} lang={lang} />
            </div>
          ) : (
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((e) => (
                <li key={e.path}>
                  <Link href={entryHref(e)} className="tile tile-link group flex h-full flex-col p-7 md:p-8">
                    <span className="t-caption text-badge">
                      {contentTypeLabels[e.type][lang]}
                      <span className="text-muted"> · {getCategory(e.category)?.title[lang]}</span>
                    </span>
                    <span className="t-title mt-3 text-balance group-hover:text-link">{e.title}</span>
                    <span className="mt-3 line-clamp-3 text-muted">{e.description}</span>
                    <span className="t-body-sm mt-auto pt-8 text-muted">
                      {e.readingMinutes} {t.minRead}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* Writing framework */}
      <section aria-labelledby="framework" className="pb-16 md:pb-24">
        <Container>
          <SectionHeading id="framework" eyebrow={t.framework}>
            {c.frameworkTitle}
          </SectionHeading>
          <p className="t-lede mt-4 max-w-[34ch] text-muted">{c.frameworkIntro}</p>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {writingFramework.map((step, i) => {
              const cat = getCategory(step.category)!;
              return (
                <li key={step.category}>
                  <Link
                    href={ieltsHref(`/${lang}/${cat.section}/category/${cat.id}`)}
                    className="tile tile-link group flex h-full flex-col p-7 md:p-8"
                  >
                    <span className="font-display text-[40px] leading-none font-semibold text-faint md:text-[48px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="t-title mt-6 group-hover:text-link">{step.title[lang]}</span>
                    <span className="mt-2 text-muted">{step.note[lang]}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Latest */}
      <section aria-labelledby="latest" className="pb-16 md:pb-24">
        <Container>
          <SectionHeading id="latest" eyebrow={t.latest} href={ieltsHref(`/${lang}/knowledge`)} linkLabel={t.viewAll}>
            {c.latestTitle}
          </SectionHeading>
          <div className="mt-10">
            <EntryList entries={latest} lang={lang} />
          </div>
        </Container>
      </section>

      {/* About */}
      <section aria-labelledby="about" className="border-t border-hairline pt-16 md:pt-24">
        <Container className="text-center">
          <p className="t-eyebrow text-badge">{t.about}</p>
          <p id="about" className="t-lede mx-auto mt-3 max-w-[36ch] text-ink">
            {c.aboutBody}
          </p>
          <Link href={ieltsHref(`/${lang}/about`)} className="link link-more mt-6 inline-block">
            {c.aboutLink}
          </Link>
        </Container>
      </section>
    </>
  );
}
