/** IELTS Writing Lab languages. */
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

/** Personal-site languages: the IELTS languages plus Simplified Chinese. */
export const mainLocales = ["vi", "en", "zh"] as const;
export type MainLocale = (typeof mainLocales)[number];

export function isMainLocale(value: string): value is MainLocale {
  return (mainLocales as readonly string[]).includes(value);
}

/** IELTS has no Chinese version — Chinese readers are sent to the English one. */
export function ieltsLocaleFor(lang: MainLocale): Locale {
  return lang === "zh" ? "en" : lang;
}

export const localeLabels: Record<MainLocale, { short: string; long: string; ogLocale: string; tag: string }> = {
  vi: { short: "VI", long: "Tiếng Việt", ogLocale: "vi_VN", tag: "vi" },
  en: { short: "EN", long: "English", ogLocale: "en_US", tag: "en" },
  zh: { short: "中", long: "中文", ogLocale: "zh_CN", tag: "zh-CN" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocales(lang: Locale): Locale[] {
  return locales.filter((l) => l !== lang);
}

/** UI strings for the IELTS site. Content itself lives in MDX, not here. */
const dictionaries = {
  vi: {
    backToMain: "Trang cá nhân",
    menu: "Menu",
    close: "Đóng",
    language: "Ngôn ngữ",
    readMore: "Đọc tiếp",
    viewAll: "Xem tất cả",
    minRead: "phút đọc",
    readingTime: "Thời gian đọc",
    visitResource: "Mở tài liệu",
    question: "Đề bài",
    published: "Đăng",
    updated: "Cập nhật",
    tags: "Thẻ",
    allTags: "Tất cả thẻ",
    category: "Chuyên mục",
    all: "Tất cả",
    related: "Bài liên quan",
    previous: "Bài trước",
    next: "Bài tiếp",
    onThisPage: "Trong bài",
    empty: "Chưa có bài viết nào ở đây. Nội dung đang được viết.",
    notTranslated: "Bài này chưa có bản tiếng Việt.",
    translationAvailable: "Đọc bản tiếng Anh",
    draft: "Bản nháp — chỉ hiển thị khi phát triển",
    latest: "Bài mới",
    featuredLessons: "Bài học nổi bật",
    framework: "Khung tư duy viết",
    journey: "Hành trình 7.0 → 8.0",
    about: "Giới thiệu",
    taggedWith: "Gắn thẻ",
    notFoundTitle: "Không tìm thấy trang",
    notFoundBody: "Trang bạn tìm không tồn tại hoặc đã được di chuyển.",
    home: "Trang chủ",
    articles: "bài",
    article: "bài",
  },
  en: {
    backToMain: "Personal site",
    menu: "Menu",
    close: "Close",
    language: "Language",
    readMore: "Read",
    viewAll: "View all",
    minRead: "min read",
    readingTime: "Reading time",
    visitResource: "Open resource",
    question: "Question",
    published: "Published",
    updated: "Updated",
    tags: "Tags",
    allTags: "All tags",
    category: "Category",
    all: "All",
    related: "Related",
    previous: "Previous",
    next: "Next",
    onThisPage: "On this page",
    empty: "Nothing published here yet. Writing in progress.",
    notTranslated: "This piece is not available in English yet.",
    translationAvailable: "Read the Vietnamese version",
    draft: "Draft — visible in development only",
    latest: "Latest insights",
    featuredLessons: "Featured lessons",
    framework: "Writing framework",
    journey: "Journey 7.0 → 8.0",
    about: "About",
    taggedWith: "Tagged",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you are looking for does not exist or has moved.",
    home: "Home",
    articles: "pieces",
    article: "piece",
  },
} satisfies Record<Locale, Record<string, string>>;

export type Dictionary = (typeof dictionaries)["en"];

/** "1 piece" / "3 pieces" */
export function countLabel(lang: Locale, n: number) {
  const t = dictionaries[lang];
  return `${n} ${n === 1 ? t.article : t.articles}`;
}

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
