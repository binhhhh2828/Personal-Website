import type { Metadata } from "next";
import Link from "next/link";
import { getCategory, writingFramework } from "@/config/content";
import { getDictionary, type Locale } from "@/config/i18n";
import { ielts, ieltsHref } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { EntryList } from "@/components/article/entry-list";
import { getEntries } from "@/lib/content";
import { allLanguages, ieltsMetadata } from "@/lib/seo";

const copy = {
  vi: {
    intro:
      "Một phòng thí nghiệm cá nhân về IELTS Writing: ghi lại hành trình từ 7.0 đến 8.0, và chia sẻ cách tư duy đằng sau một bài viết tốt — từ đọc đề, phát triển ý đến lựa chọn ngôn ngữ.",
    taglineVi: "Học cách tư duy, không chỉ học cách viết.",
    journeyBody:
      "Mục tiêu: từ band 7.0 lên 8.0 ở kỹ năng Writing. Nhật ký học, tiến độ và những suy ngẫm được cập nhật công khai.",
    start: "Điểm xuất phát",
    target: "Mục tiêu",
    followJourney: "Theo dõi hành trình",
    aboutBody:
      "IELTS Writing Lab là một phần của trang cá nhân — nơi tôi ghi lại quá trình học và chia sẻ những gì hữu ích cho người học ở khoảng band 5.5–7.0.",
    aboutLink: "Về tác giả và triết lý học",
    frameworkIntro: "Sáu bước tư duy khi viết một bài luận — mỗi bước dẫn đến các bài học liên quan.",
  },
  en: {
    intro:
      "A personal lab for IELTS Writing: documenting the journey from 7.0 to 8.0, and sharing the thinking behind a strong essay — from reading the question to developing ideas and choosing language.",
    taglineVi: null,
    journeyBody:
      "Goal: move from band 7.0 to 8.0 in Writing. Learning logs, progress and reflections are published in the open.",
    start: "Starting point",
    target: "Target",
    followJourney: "Follow the journey",
    aboutBody:
      "IELTS Writing Lab is part of my personal website — a place to document my learning and share what is useful for learners around band 5.5–7.0.",
    aboutLink: "About the author and the approach",
    frameworkIntro: "Six steps for thinking an essay through — each leads to the lessons that teach it.",
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
    <Container>
      {/* Hero */}
      <section className="reveal grid gap-10 pt-16 pb-20 md:grid-cols-12 md:pt-28 md:pb-28">
        <div className="md:col-span-9">
          <Eyebrow className="mb-6">{ielts.name}</Eyebrow>
          <h1 lang="en" className="font-display text-[3.25rem] leading-[0.98] text-balance sm:text-7xl lg:text-[6.5rem]">
            Learn to <em>think</em>, not just to write.
          </h1>
          {c.taglineVi && <p className="mt-5 text-lg font-medium tracking-tight text-muted">{c.taglineVi}</p>}
        </div>
        <p className="max-w-[46ch] font-body text-lg leading-relaxed text-muted md:col-span-6 md:col-start-1">
          {c.intro}
        </p>
      </section>

      {/* Journey */}
      <section aria-labelledby="journey" className="grid gap-8 pb-24 md:grid-cols-12">
        <div className="md:col-span-12">
          <SectionHeading id="journey" href={ieltsHref(`/${lang}/journey`)} linkLabel={t.viewAll}>
            {t.journey}
          </SectionHeading>
        </div>
        <dl className="grid grid-cols-[auto_auto_1fr] items-end gap-x-6 md:col-span-6" lang="en">
          <div>
            <dt className="font-mono text-xs text-muted">{c.start}</dt>
            <dd className="font-display text-7xl leading-none sm:text-8xl">7.0</dd>
          </div>
          <span aria-hidden className="pb-3 font-mono text-2xl text-subtle">→</span>
          <div>
            <dt className="font-mono text-xs text-accent-ink">{c.target}</dt>
            <dd className="font-display text-7xl leading-none text-accent sm:text-8xl">8.0</dd>
          </div>
        </dl>
        <div className="md:col-span-5 md:col-start-8 md:self-end">
          <p className="font-body leading-relaxed text-muted">{c.journeyBody}</p>
          <Link
            href={ieltsHref(`/${lang}/journey`)}
            className="mt-4 inline-block text-sm font-medium underline decoration-accent decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            {c.followJourney} →
          </Link>
        </div>
      </section>

      {/* Featured lessons */}
      <section aria-labelledby="featured" className="pb-24">
        <SectionHeading id="featured" href={ieltsHref(`/${lang}/writing-lab`)} linkLabel={t.viewAll}>
          {t.featuredLessons}
        </SectionHeading>
        <div className="mt-6">
          <EntryList entries={featured} lang={lang} />
        </div>
      </section>

      {/* Writing framework */}
      <section aria-labelledby="framework" className="pb-24">
        <SectionHeading id="framework">{t.framework}</SectionHeading>
        <p className="mt-6 max-w-[52ch] font-body text-muted">{c.frameworkIntro}</p>
        <ol className="mt-10 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {writingFramework.map((step, i) => {
            const cat = getCategory(step.category)!;
            return (
              <li key={step.category} className="bg-bg">
                <Link
                  href={ieltsHref(`/${lang}/${cat.section}/category/${cat.id}`)}
                  className="group flex h-full flex-col gap-3 py-7 pr-6 sm:px-6 sm:first:pl-0"
                >
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-semibold tracking-tight group-hover:text-accent-ink">
                    {step.title[lang]}
                  </span>
                  <span className="font-body text-[0.9375rem] leading-relaxed text-muted">{step.note[lang]}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Latest */}
      <section aria-labelledby="latest" className="pb-24">
        <SectionHeading id="latest" href={ieltsHref(`/${lang}/knowledge`)} linkLabel={t.viewAll}>
          {t.latest}
        </SectionHeading>
        <div className="mt-6">
          <EntryList entries={latest} lang={lang} />
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about" className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-12">
          <SectionHeading id="about">{t.about}</SectionHeading>
        </div>
        <p className="font-body text-xl leading-relaxed text-balance md:col-span-7">{c.aboutBody}</p>
        <div className="md:col-span-4 md:col-start-9 md:self-end">
          <Link
            href={ieltsHref(`/${lang}/about`)}
            className="text-sm font-medium underline decoration-accent decoration-2 underline-offset-[6px] hover:text-accent-ink"
          >
            {c.aboutLink} →
          </Link>
        </div>
      </section>
    </Container>
  );
}
