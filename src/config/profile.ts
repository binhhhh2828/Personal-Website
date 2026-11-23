import type { Locale } from "./i18n";

/**
 * Personal website data — the short, structured facts about you, in Vietnamese and English.
 * Your longer life story lives in content/pages/main/{vi,en}/about.mdx.
 *
 * `shared` holds things that don't change with the language (name, photos, links);
 * `text.vi` / `text.en` hold the words. Keep both languages in step when you edit.
 * Anything still marked "[Placeholder]" or "[...]" (e.g. works) is waiting for your real details.
 *
 * Photos: every `image` is the path where the photo WILL live under /public.
 * Until the file exists, the site shows an empty frame labelled with that path.
 */

export type Work = {
  kind: "project" | "research";
  title: string;
  year: string;
  summary: string;
  role?: string;
  /** Venue, course or lab — mostly for research. */
  venue?: string;
  href?: string;
  tags: string[];
  image: string;
  /** Show on the home page. */
  featured?: boolean;
};

export type Exploration = { title: string; note: string };
export type BeyondWorkItem = { title: string; note: string; image: string };

const shared = {
  name: "Lại Bình",
  portrait: "/images/portrait.jpg",
  /** e.g. "hello@yourname.id.vn". Left empty until you add it. */
  email: "",
  links: [
    { label: "Facebook", href: "https://www.facebook.com/lai.binh.2910" },
    { label: "Instagram", href: "https://www.instagram.com/why_soethereal" },
    { label: "Threads", href: "https://www.threads.net/@why_soethereal" },
  ] as { label: string; href: string }[],
  /** Images used by works and beyond-work cards, in order. */
  workImages: ["/images/works/project-1.jpg", "/images/works/project-2.jpg", "/images/works/research-1.jpg"],
  beyondImages: ["/images/beyond/1.jpg", "/images/beyond/2.jpg", "/images/beyond/3.jpg"],
};

type ProfileText = {
  /** One short line under your name. */
  role: string;
  location: string;
  /** The big statement in the hero. */
  headline: string;
  intro: string;
  /** Home page "About" teaser. */
  aboutTeaser: string[];
  works: Omit<Work, "image">[];
  explorations: Exploration[];
  beyondWork: Omit<BeyondWorkItem, "image">[];
  /** Easter-egg messages (Konami code, clicking the nav wordmark 5×, the DevTools console). */
  secrets: { konami: string; logo: string; console: string };
  contactNote: string;
};

const text: Record<Locale, ProfileText> = {
  vi: {
    role: "Sinh viên IT · Người hay viết nhật ký · Vibe coder",
    location: "Uông Bí, Việt Nam",
    headline: "Hơi ngây ngô, hơi hoài niệm — đang học cách làm ra những thứ bền lâu.",
    intro:
      "Mình học tại Học viện Kỹ thuật Mật mã (KMA). Mình hay viết nhật ký, kể chuyện dài, và chia sẻ hơi nhiều meme về AI với vibe coding.",
    aboutTeaser: [
      "Mình là sinh viên IT ở KMA, đang tập làm hòa với Linux. Điểm của mình quanh mức B+ — và mình thật sự tò mò mấy bạn 4.0 làm thế nào.",
      "Rời bàn phím, mình viết nhật ký, kể những câu chuyện dài (thường là tự trào), thua cầu lông, và nhớ giấc mơ của mình chi tiết hơi quá mức.",
    ],
    works: [
      {
        kind: "project",
        title: "[Placeholder] Tên dự án",
        year: "[Năm]",
        summary: "[Placeholder] Vấn đề, cách bạn làm và kết quả — trong một hai câu.",
        role: "[Vai trò]",
        tags: ["[tag]"],
        featured: true,
      },
      {
        kind: "project",
        title: "[Placeholder] Dự án thứ hai",
        year: "[Năm]",
        summary: "[Placeholder] Một hai câu.",
        role: "[Vai trò]",
        tags: ["[tag]"],
        featured: true,
      },
      {
        kind: "research",
        title: "[Placeholder] Chủ đề nghiên cứu",
        year: "[Năm]",
        summary: "[Placeholder] Câu hỏi, phương pháp và điều bạn tìm ra.",
        venue: "[Môn học / Lab]",
        tags: ["[tag]"],
        featured: true,
      },
    ],
    explorations: [
      { title: "Công nghệ", note: "Học IT ở KMA, học Linux, làm vài dự án nhỏ — và giờ thì luôn có bản sao lưu." },
      { title: "AI & vibe coding", note: "Làm đồ với AI, chia sẻ meme, và tìm xem đâu là hype, đâu là thứ thật sự dùng được." },
      { title: "Viết", note: "Nhật ký, những câu chuyện dài, những giấc mơ kỳ lạ. Viết là cách mình ghi nhớ." },
      { title: "Ngôn ngữ & học tập", note: "Học tiếng Anh một cách công khai — ghi lại trong IELTS Writing Lab." },
    ],
    beyondWork: [
      { title: "Cầu lông", note: "Đánh không giỏi lắm. Nhưng làm đứt cước và đi căng vợt thì rất giỏi." },
      { title: "Bơ xoài dầm sữa", note: "Gần như ngày nào cũng ăn. Không hối hận." },
      { title: "Những giấc mơ kỳ lạ", note: "Mình nhớ chúng, và sẽ kể cho bạn nghe — dù bạn có hỏi hay không." },
    ],
    secrets: {
      konami: "Bạn tìm ra bí mật rồi. Phần thưởng: đi dầm một bát bơ xoài sữa đặc đi. 🥑🥭",
      logo: "Năm cú click. Bạn còn bền bỉ hơn cả dây cước vợt cầu lông của mình.",
      console: "Chào bạn, người thích vọc vạch 👋 — thử gõ ↑↑↓↓←→←→BA trên trang này xem.",
    },
    contactNote: "Câu hỏi, rủ làm chung, gợi ý meme hay một giấc mơ kỳ lạ muốn kể — cứ nhắn mình nhé.",
  },
  en: {
    role: "IT student · Diary keeper · Vibe coder",
    location: "Uông Bí, Vietnam",
    headline: "A little naive, a little nostalgic — learning to build things that last.",
    intro:
      "I study at the Academy of Cryptography Techniques (KMA). I keep diaries, tell long stories, and share far too many memes about AI and vibe coding.",
    aboutTeaser: [
      "I’m an IT student at KMA, currently making peace with Linux. My grades sit around a B+ — and I’m honestly curious how the 4.0 people do it.",
      "Off the keyboard I write diaries, tell long (often self-roasting) stories, lose badminton games, and remember my dreams in too much detail.",
    ],
    works: [
      {
        kind: "project",
        title: "[Placeholder] Project title",
        year: "[Year]",
        summary: "[Placeholder] The problem, your approach, and the outcome — in one or two sentences.",
        role: "[Role]",
        tags: ["[tag]"],
        featured: true,
      },
      {
        kind: "project",
        title: "[Placeholder] Second project",
        year: "[Year]",
        summary: "[Placeholder] One or two sentences.",
        role: "[Role]",
        tags: ["[tag]"],
        featured: true,
      },
      {
        kind: "research",
        title: "[Placeholder] Research topic or paper",
        year: "[Year]",
        summary: "[Placeholder] The question, the method, and what you found.",
        venue: "[Course / Lab / Venue]",
        tags: ["[tag]"],
        featured: true,
      },
    ],
    explorations: [
      { title: "Technology", note: "Studying IT at KMA, learning Linux, and building small projects — with backups now." },
      { title: "AI & vibe coding", note: "Building with AI, sharing the memes, and figuring out what is hype and what actually works." },
      { title: "Writing", note: "Diaries, long stories, strange dreams. Writing is how I remember things." },
      { title: "Language & learning", note: "Learning English in public — documented in IELTS Writing Lab." },
    ],
    beyondWork: [
      { title: "Badminton", note: "Not very good at it. Very good at snapping strings and restringing my racket." },
      { title: "Avocado & mango", note: "Mashed with condensed milk. Almost every day. No regrets." },
      { title: "Strange dreams", note: "I remember them, and I will tell you about them — whether you asked or not." },
    ],
    secrets: {
      konami: "You found the secret. Reward: go mash some avocado and mango with condensed milk. 🥑🥭",
      logo: "Five clicks. You’re more persistent than my badminton strings.",
      console: "Hi there, fellow tinkerer 👋 — try ↑↑↓↓←→←→BA on this page.",
    },
    contactNote: "Questions, collaborations, meme recommendations or a strange dream to share — say hello.",
  },
};

/** The profile in one language, with photos and links merged in. */
export function getProfile(lang: Locale) {
  const t = text[lang];
  return {
    name: shared.name,
    portrait: shared.portrait,
    role: t.role,
    location: t.location,
    headline: t.headline,
    intro: t.intro,
    aboutTeaser: t.aboutTeaser,
    works: t.works.map((w, i) => ({ ...w, image: shared.workImages[i] ?? shared.workImages[0] })) as Work[],
    explorations: t.explorations,
    beyondWork: t.beyondWork.map((b, i) => ({ ...b, image: shared.beyondImages[i] ?? "" })) as BeyondWorkItem[],
    secrets: t.secrets,
    contact: { note: t.contactNote, email: shared.email, links: shared.links },
  };
}

/** Language-independent facts (name, links) for places that have no language, e.g. metadata. */
export const profileShared = shared;
