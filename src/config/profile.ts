import type { MainLocale } from "./i18n";

/**
 * Personal website data — the short, structured facts about you, in Vietnamese and English.
 * Your longer life story lives in content/pages/main/{vi,en,zh}/about.mdx.
 *
 * `shared` holds things that don't change with the language (name, photos, links);
 * `text.vi` / `text.en` / `text.zh` hold the words. Keep the languages in step when you edit.
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
  beyondImages: [1, 2, 3, 4, 5, 6].map((n) => `/images/beyond/${n}.jpg`),
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
  /** Quick facts shown as chips in the home "About" block. */
  facts: { label: string; value: string }[];
  /** Easter-egg messages (Konami code, clicking the nav wordmark 5×, the DevTools console). */
  secrets: { konami: string; logo: string; console: string };
  contactNote: string;
};

const text: Record<MainLocale, ProfileText> = {
  vi: {
    role: "Sinh viên IT · Người hay viết nhật ký · Vibe coder",
    location: "Uông Bí, Việt Nam",
    headline: "Hơi ngây ngô, hơi hoài niệm — đang học cách làm ra những thứ bền lâu.",
    intro:
      "Mình học tại Học viện Kỹ thuật Mật mã (KMA). Mình hay viết nhật ký, kể chuyện dài, và chia sẻ hơi nhiều meme về AI với vibe coding.",
    aboutTeaser: [
      "Mình là một người khá tò mò về thế giới xung quanh, thích khám phá những điều mới mẻ và tìm hiểu cách mọi thứ vận hành. Mình thích trò chuyện, trao đổi ý tưởng và lắng nghe những góc nhìn khác nhau.",
      "Mình khá hướng nội, dù có lẽ điều đó không dễ nhận ra khi tiếp xúc. Mình thích gặp gỡ mọi người, nhưng cũng rất trân trọng khoảng thời gian dành riêng cho bản thân.",
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
      { title: "Tử vi & MBTI", note: "Mình thích tìm hiểu về tử vi và MBTI. Hai năm trước mình là INFJ-T, bây giờ là ENTJ-T." },
      { title: "Ngôn ngữ & học tập", note: "Học tiếng Anh một cách công khai — ghi lại trong IELTS Writing Lab." },
    ],
    beyondWork: [
      { title: "TFT & Liên Quân", note: "Đấu Trường Chân Lý là nơi mình tính toán đội hình; Liên Quân là nơi mình… cố gắng hết sức." },
      { title: "Cầu lông & chạy bộ", note: "Cầu lông thì đánh chưa giỏi nhưng đứt cước rất đều. Chạy bộ để đầu óc được nghỉ." },
      { title: "Rubik", note: "Chơi khá lâu rồi. Thích cảm giác tìm ra lời giải cho một khối tưởng chừng hỗn độn — hoặc chỉ vì vui." },
      { title: "Tử vi & MBTI", note: "INFJ-T hai năm trước, ENTJ-T bây giờ. Không biết là tính cách đã thay đổi thật hay chưa." },
      { title: "Thiên nhiên & những chuyến đi", note: "Cảnh đẹp, vùng đất mới, những chuyến đi ngẫu hứng và vài buổi cà phê với bạn bè." },
      { title: "Bơ xoài dầm sữa", note: "Gần như ngày nào cũng ăn. Không hối hận." },
    ],
    facts: [
      { label: "MBTI", value: "INFJ-T → ENTJ-T" },
      { label: "Game", value: "TFT · Liên Quân" },
      { label: "Thể thao", value: "Cầu lông · Chạy bộ" },
      { label: "Hay tìm hiểu", value: "Tử vi · MBTI" },
      { label: "Giải đố", value: "Rubik" },
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
      "I’m quite curious about the world around me — I like discovering new things and figuring out how they work. I love conversations, swapping ideas and hearing different points of view.",
      "I’m fairly introverted, even if it doesn’t show when we meet. I enjoy being around people, but I also really value time to myself.",
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
      { title: "Astrology & MBTI", note: "I like reading about tử vi (Vietnamese astrology) and MBTI. Two years ago I was INFJ-T; now I’m ENTJ-T." },
      { title: "Language & learning", note: "Learning English in public — documented in IELTS Writing Lab." },
    ],
    beyondWork: [
      { title: "TFT & Arena of Valor", note: "Teamfight Tactics is where I plan team comps; Arena of Valor (Liên Quân) is where I… try my best." },
      { title: "Badminton & running", note: "Not great at badminton, very consistent at snapping strings. Running is how my head gets a break." },
      { title: "Rubik’s cube", note: "I’ve played for quite a while. I love solving something that looks like chaos — or just doing it for fun." },
      { title: "Astrology & MBTI", note: "INFJ-T two years ago, ENTJ-T now. Not sure yet whether my personality really changed." },
      { title: "Nature & trips", note: "Beautiful places, new towns, spontaneous trips, and coffee with friends." },
      { title: "Avocado & mango", note: "Mashed with condensed milk. Almost every day. No regrets." },
    ],
    facts: [
      { label: "MBTI", value: "INFJ-T → ENTJ-T" },
      { label: "Games", value: "TFT · Arena of Valor" },
      { label: "Sports", value: "Badminton · Running" },
      { label: "Into", value: "Astrology (tử vi) · MBTI" },
      { label: "Puzzle", value: "Rubik’s cube" },
    ],
    secrets: {
      konami: "You found the secret. Reward: go mash some avocado and mango with condensed milk. 🥑🥭",
      logo: "Five clicks. You’re more persistent than my badminton strings.",
      console: "Hi there, fellow tinkerer 👋 — try ↑↑↓↓←→←→BA on this page.",
    },
    contactNote: "Questions, collaborations, meme recommendations or a strange dream to share — say hello.",
  },
  zh: {
    role: "信息技术专业学生 · 写日记的人 · Vibe coder",
    location: "越南 汪秘（Uông Bí）",
    headline: "有点天真，有点怀旧 —— 正在学着做出能留得住的东西。",
    intro: "我在越南密码技术学院（KMA）读书。我爱写日记、讲长长的故事，还会分享太多关于 AI 和 vibe coding 的表情包。",
    aboutTeaser: [
      "我对身边的世界很好奇，喜欢发现新鲜事物，弄明白它们是怎么运作的。我喜欢聊天、交流想法，也喜欢听不同的观点。",
      "我其实挺内向的，虽然见面时可能看不出来。我喜欢和人相处，但也非常珍惜属于自己的时间。",
    ],
    works: [
      {
        kind: "project",
        title: "[Placeholder] 项目名称",
        year: "[年份]",
        summary: "[Placeholder] 问题、你的做法和结果 —— 用一两句话说明。",
        role: "[角色]",
        tags: ["[tag]"],
        featured: true,
      },
      {
        kind: "project",
        title: "[Placeholder] 第二个项目",
        year: "[年份]",
        summary: "[Placeholder] 一两句话。",
        role: "[角色]",
        tags: ["[tag]"],
        featured: true,
      },
      {
        kind: "research",
        title: "[Placeholder] 研究主题",
        year: "[年份]",
        summary: "[Placeholder] 问题、方法和你的发现。",
        venue: "[课程 / 实验室]",
        tags: ["[tag]"],
        featured: true,
      },
    ],
    explorations: [
      { title: "技术", note: "在 KMA 学信息技术，学 Linux，做些小项目 —— 现在一定会做备份。" },
      { title: "AI 与 vibe coding", note: "用 AI 做东西，分享表情包，分辨哪些是炒作、哪些真的好用。" },
      { title: "命理与 MBTI", note: "我喜欢研究越南的命理（tử vi）和 MBTI。两年前我是 INFJ-T，现在是 ENTJ-T。" },
      { title: "语言与学习", note: "公开地学英语 —— 记录在 IELTS Writing Lab 里。" },
    ],
    beyondWork: [
      { title: "云顶之弈 & 传说对决", note: "在云顶之弈里我精打细算地配阵容；在传说对决（Liên Quân）里我……尽力而为。" },
      { title: "羽毛球 & 跑步", note: "羽毛球打得一般，断线倒是很稳定。跑步是让脑子放空的方式。" },
      { title: "魔方", note: "玩了挺久了。喜欢从一团混乱里找到解法的感觉 —— 或者只是因为好玩。" },
      { title: "命理与 MBTI", note: "两年前是 INFJ-T，现在是 ENTJ-T。还不确定性格是不是真的变了。" },
      { title: "自然与旅行", note: "美丽的风景、陌生的地方、说走就走的旅行，还有和朋友的咖啡时光。" },
      { title: "牛油果芒果炼乳", note: "几乎每天都吃。毫不后悔。" },
    ],
    facts: [
      { label: "MBTI", value: "INFJ-T → ENTJ-T" },
      { label: "游戏", value: "云顶之弈 · 传说对决" },
      { label: "运动", value: "羽毛球 · 跑步" },
      { label: "爱研究", value: "命理（tử vi）· MBTI" },
      { label: "解谜", value: "魔方" },
    ],
    secrets: {
      konami: "你发现了秘密。奖励：去做一碗牛油果芒果拌炼乳吧。🥑🥭",
      logo: "连点五下。你比我的羽毛球线还要坚韧。",
      console: "你好呀，爱折腾的朋友 👋 —— 在这个页面试试 ↑↑↓↓←→←→BA。",
    },
    contactNote: "有问题、想合作、想推荐表情包，或者想讲一个奇怪的梦 —— 都欢迎来打个招呼。",
  },
};

/** The profile in one language, with photos and links merged in. */
export function getProfile(lang: MainLocale) {
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
    facts: t.facts,
    secrets: t.secrets,
    contact: { note: t.contactNote, email: shared.email, links: shared.links },
  };
}

/** Language-independent facts (name, links) for places that have no language, e.g. metadata. */
export const profileShared = shared;
