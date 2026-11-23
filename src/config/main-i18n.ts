import type { Locale } from "./i18n";

/**
 * UI strings for the personal site (vi is the default language, en is under /en).
 * Personal content (headline, works, hobbies…) lives in profile.ts; the life story in
 * content/pages/main/{vi,en}/about.mdx.
 */
const vi = {
  siteDescription:
    "Lại Bình — sinh viên IT ở KMA, người hay ghi chép: code, nhật ký, những giấc mơ kỳ lạ và hành trình học tiếng Anh.",
  langSwitch: "Ngôn ngữ",
  skip: "Chuyển đến nội dung",
  menu: "Menu",
  close: "Đóng",
  nav: { about: "Giới thiệu", projects: "Dự án", research: "Nghiên cứu", journal: "Nhật ký", gallery: "Ảnh", ielts: "IELTS" },
  footer: { personal: "Cá nhân", contact: "Liên hệ", elsewhere: "Mạng xã hội" },

  home: {
    readStory: "Đọc câu chuyện của tôi",
    seeWork: "Xem các dự án",
    aboutEyebrow: "Giới thiệu",
    readFullStory: "Đọc toàn bộ câu chuyện",
    worksEyebrow: "Dự án tiêu biểu",
    worksTitle: "Những thứ tôi đã làm và học.",
    allProjects: "Tất cả dự án",
    research: "Nghiên cứu",
    explorationsEyebrow: "Khám phá",
    explorationsTitle: "Những điều tôi cứ quay lại mãi.",
    ieltsEyebrow: "Một chuyến khám phá ngôn ngữ",
    visitLab: "Ghé phòng lab",
    ieltsTagline: "Học cách tư duy, không chỉ học cách viết.",
    journalEyebrow: "Nhật ký",
    journalTitle: "Suy nghĩ và ghi chép.",
    allNotes: "Tất cả ghi chép",
    journalEmpty: "Những ghi chép đầu tiên đang được viết.",
    beyondEyebrow: "Ngoài giờ học",
    beyondTitle: "Cuộc sống ngoài bàn phím.",
    moreInStory: "Đọc thêm trong câu chuyện",
    beyondHint: "Cào để xem từng ảnh",
    beyondHintDrag: " — và kéo chúng đi khắp mặt bàn",
    tidy: "Xếp gọn",
    contactEyebrow: "Liên hệ",
    contactTitle: "Nói chuyện nhé.",
    emailMissing: "[Placeholder] Thêm email trong src/config/profile.ts",
    portraitAlt: "Ảnh chân dung của",
    portraitLabel: "Chân dung",
    aboutPhotoAlt: "Tôi lúc nhỏ, đang cười trên gối",
    project: "Dự án",
    researchKind: "Nghiên cứu",
  },

  effects: {
    scratch: "Cào để xem ảnh",
    scratchShort: "Cào",
    reveal: "Hiện ảnh",
    flip: "Chạm để lật ↻",
    timeline: "Các chương trong câu chuyện",
    readChapter: "Đọc chương này",
    openAlbum: "Mở album",
  },

  about: {
    chapters: "Các chương",
    thanksTitle: "Cảm ơn bạn đã đọc.",
    thanksBody: "Xem những gì tôi đang làm, hoặc gửi một lời chào.",
    seeWork: "Xem dự án",
    getInTouch: "Liên hệ với tôi",
  },

  pages: {
    projectsEyebrow: "Dự án tiêu biểu",
    projectsTitle: "Dự án",
    projectsDescription: "Những thứ tôi đã làm — sản phẩm, công cụ và các thử nghiệm nhỏ.",
    researchEyebrow: "Dự án tiêu biểu",
    researchTitle: "Nghiên cứu",
    researchDescription: "Những câu hỏi tôi đang tìm hiểu, và những gì tôi tìm ra.",
    comingSoon: "Sắp có.",
    journalTitle: "Suy nghĩ và ghi chép.",
    journalDescription: "Những suy nghĩ cá nhân — về học, về làm, và mọi thứ ở giữa.",
    galleryEyebrow: "Ảnh",
    galleryTitle: "Ảnh, gần như không chỉnh sửa.",
    galleryDescription:
      "Tuổi thơ, thời đi học và vài bộ ảnh game. Một vài ảnh xem trước được mở cho mọi người — album đầy đủ đã được mã hóa và cần mật khẩu.",
  },

  journal: {
    minRead: "phút đọc",
    draft: "Bản nháp — chỉ hiển thị khi phát triển",
    draftBadge: "Nháp",
    onThisPage: "Trong bài",
    previous: "Bài trước",
    next: "Bài tiếp",
    otherLanguage: "Bài viết bằng tiếng Anh",
    cover: "Ảnh bìa",
  },

  gallery: {
    locked: "Album đầy đủ đang bị khóa",
    password: "Mật khẩu",
    unlock: "Mở khóa",
    unlocking: "Đang mở…",
    wait: (s: number) => `Chờ ${s}s`,
    wrong: "Chưa đúng rồi. Thử lại nhé.",
    unlocked: "Đã mở khóa — album đầy đủ đang mở trên tab này.",
    lockAgain: "Khóa lại",
    count: (n: number) => `${n} ảnh`,
    lockedCount: (n: number) => `${n} ảnh bị khóa`,
    enterPassword: "Nhập mật khẩu để xem",
    empty: "Album đang được chuẩn bị.",
    openPhoto: (n: number) => `Mở ảnh ${n}`,
    preview: (n: number) => `ảnh xem trước ${n}`,
    photoOf: (i: number, n: number) => `ảnh ${i} / ${n}`,
    previous: "Ảnh trước",
    nextPhoto: "Ảnh tiếp",
    close: "Đóng",
  },
};

const en: typeof vi = {
  siteDescription:
    "Lại Bình — an IT student at KMA who writes things down: code, diaries, strange dreams and an English-learning journey.",
  langSwitch: "Language",
  skip: "Skip to content",
  menu: "Menu",
  close: "Close",
  nav: { about: "About", projects: "Projects", research: "Research", journal: "Journal", gallery: "Gallery", ielts: "IELTS" },
  footer: { personal: "Personal", contact: "Contact", elsewhere: "Elsewhere" },

  home: {
    readStory: "Read my story",
    seeWork: "See my work",
    aboutEyebrow: "About",
    readFullStory: "Read the full story",
    worksEyebrow: "Selected works",
    worksTitle: "Things I’ve built and studied.",
    allProjects: "All projects",
    research: "Research",
    explorationsEyebrow: "Explorations",
    explorationsTitle: "What I keep coming back to.",
    ieltsEyebrow: "An exploration in language",
    visitLab: "Visit the lab",
    ieltsTagline: "Learn to think, not just to write.",
    journalEyebrow: "Journal",
    journalTitle: "Thoughts and notes.",
    allNotes: "All notes",
    journalEmpty: "The first notes are being written.",
    beyondEyebrow: "Beyond work",
    beyondTitle: "Life outside the desk.",
    moreInStory: "More in my story",
    beyondHint: "Scratch to see each photo",
    beyondHintDrag: " — and drag them around the table",
    tidy: "Tidy up",
    contactEyebrow: "Contact",
    contactTitle: "Let’s talk.",
    emailMissing: "[Placeholder] Add your email in src/config/profile.ts",
    portraitAlt: "Portrait of",
    portraitLabel: "Portrait",
    aboutPhotoAlt: "Me as a kid, smiling on a pillow",
    project: "Project",
    researchKind: "Research",
  },

  effects: {
    scratch: "Scratch to reveal",
    scratchShort: "Scratch",
    reveal: "Reveal photo",
    flip: "Tap to flip ↻",
    timeline: "Chapters of my story",
    readChapter: "Read this chapter",
    openAlbum: "Open the album",
  },

  about: {
    chapters: "Chapters",
    thanksTitle: "Thanks for reading.",
    thanksBody: "See what I’m making, or say hello.",
    seeWork: "See my work",
    getInTouch: "Get in touch",
  },

  pages: {
    projectsEyebrow: "Selected works",
    projectsTitle: "Projects",
    projectsDescription: "Things I have built — products, tools and experiments.",
    researchEyebrow: "Selected works",
    researchTitle: "Research",
    researchDescription: "Questions I am investigating, and what I found.",
    comingSoon: "Coming soon.",
    journalTitle: "Thoughts and notes.",
    journalDescription: "Personal thoughts and notes — on learning, building and everything in between.",
    galleryEyebrow: "Gallery",
    galleryTitle: "Photos, mostly unfiltered.",
    galleryDescription:
      "Childhood, school and game photo sets. A few previews are open to everyone — the full albums are encrypted and need a password.",
  },

  journal: {
    minRead: "min read",
    draft: "Draft — visible in development only",
    draftBadge: "Draft",
    onThisPage: "On this page",
    previous: "Previous",
    next: "Next",
    otherLanguage: "Written in Vietnamese",
    cover: "Cover image",
  },

  gallery: {
    locked: "Full albums are locked",
    password: "Password",
    unlock: "Unlock",
    unlocking: "Unlocking…",
    wait: (s: number) => `Wait ${s}s`,
    wrong: "That’s not it. Try again.",
    unlocked: "Unlocked — full albums are open on this tab.",
    lockAgain: "Lock again",
    count: (n: number) => `${n} ${n === 1 ? "photo" : "photos"}`,
    lockedCount: (n: number) => `${n} locked`,
    enterPassword: "Enter the password to see them",
    empty: "Albums are on their way.",
    openPhoto: (n: number) => `Open photo ${n}`,
    preview: (n: number) => `preview ${n}`,
    photoOf: (i: number, n: number) => `photo ${i} of ${n}`,
    previous: "Previous photo",
    nextPhoto: "Next photo",
    close: "Close",
  },
};

export type MainDict = typeof vi;
const dicts: Record<Locale, MainDict> = { vi, en };

export function getMainDict(lang: Locale): MainDict {
  return dicts[lang];
}
