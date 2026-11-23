import type { Locale } from "./i18n";

/**
 * Centralised content taxonomy for IELTS Writing Lab.
 * Sections are top-level areas (URL segment). Every category belongs to one section;
 * an article's URL is derived from its category: /{lang}/{section}/{slug}.
 */

type Localized = Record<Locale, string>;

export const contentTypes = [
  "article",
  "lesson",
  "breakdown",
  "log",
  "language-note",
  "resource",
] as const;
export type ContentType = (typeof contentTypes)[number];

export const contentTypeLabels: Record<ContentType, Localized> = {
  article: { vi: "Bài viết", en: "Article" },
  lesson: { vi: "Bài học", en: "Writing lesson" },
  breakdown: { vi: "Phân tích bài luận", en: "Essay breakdown" },
  log: { vi: "Nhật ký học", en: "Learning log" },
  "language-note": { vi: "Ghi chú ngôn ngữ", en: "Language note" },
  resource: { vi: "Tài liệu", en: "Resource" },
};

export const sectionIds = [
  "journey",
  "writing-lab",
  "language-thinking",
  "knowledge",
] as const;
export type SectionId = (typeof sectionIds)[number];

export type Section = {
  id: SectionId;
  title: Localized;
  description: Localized;
};

export const sections: Record<SectionId, Section> = {
  journey: {
    id: "journey",
    title: { vi: "Hành trình", en: "My Journey" },
    description: {
      vi: "Nhật ký học tập công khai trên hành trình từ IELTS 7.0 đến 8.0: mục tiêu, tiến độ và suy ngẫm.",
      en: "A public learning log on the way from IELTS 7.0 to 8.0: goals, progress and reflections.",
    },
  },
  "writing-lab": {
    id: "writing-lab",
    title: { vi: "Writing Lab", en: "Writing Lab" },
    description: {
      vi: "Từ đọc hiểu đề bài đến xây dựng lập luận — cách tư duy đằng sau một bài viết IELTS tốt.",
      en: "From reading the question to building the argument — the thinking behind a strong IELTS essay.",
    },
  },
  "language-thinking": {
    id: "language-thinking",
    title: { vi: "Tư duy ngôn ngữ", en: "Language Thinking" },
    description: {
      vi: "Từ vựng, ngữ pháp, cú pháp, ngữ nghĩa và ngữ dụng — hiểu vì sao tiếng Anh vận hành như vậy.",
      en: "Vocabulary, grammar, syntax, semantics and pragmatics — understanding why English works the way it does.",
    },
  },
  knowledge: {
    id: "knowledge",
    title: { vi: "Kho kiến thức", en: "Knowledge Hub" },
    description: {
      vi: "Mẹo viết, lỗi thường gặp, phương pháp học và tài liệu tham khảo.",
      en: "Writing tips, common mistakes, learning methods and resources.",
    },
  },
};

export type Category = {
  id: string;
  section: SectionId;
  title: Localized;
};

const c = (id: string, section: SectionId, vi: string, en: string): Category => ({
  id,
  section,
  title: { vi, en },
});

export const categories = [
  // My Journey
  c("background", "journey", "Xuất phát điểm", "Background"),
  c("goals", "journey", "Mục tiêu", "Goals"),
  c("learning-logs", "journey", "Nhật ký học", "Learning logs"),
  c("progress", "journey", "Cập nhật tiến độ", "Progress updates"),
  c("reflections", "journey", "Suy ngẫm", "Reflections"),
  // Writing Lab
  c("task-1", "writing-lab", "Writing Task 1", "Writing Task 1"),
  c("task-2", "writing-lab", "Writing Task 2", "Writing Task 2"),
  c("understanding-questions", "writing-lab", "Hiểu đề bài", "Understanding questions"),
  c("brainstorming", "writing-lab", "Brainstorming", "Brainstorming"),
  c("idea-development", "writing-lab", "Phát triển ý", "Idea development"),
  c("argument-construction", "writing-lab", "Xây dựng lập luận", "Argument construction"),
  c("coherence-cohesion", "writing-lab", "Coherence & Cohesion", "Coherence & Cohesion"),
  c("lexical-resource", "writing-lab", "Lexical Resource", "Lexical Resource"),
  c("grammatical-range", "writing-lab", "Grammatical Range & Accuracy", "Grammatical Range & Accuracy"),
  c("essay-breakdowns", "writing-lab", "Phân tích bài luận", "Essay breakdowns"),
  // Language Thinking
  c("vocabulary", "language-thinking", "Từ vựng", "Vocabulary"),
  c("grammar", "language-thinking", "Ngữ pháp", "Grammar"),
  c("syntax", "language-thinking", "Cú pháp", "Syntax"),
  c("semantics", "language-thinking", "Ngữ nghĩa", "Semantics"),
  c("pragmatics", "language-thinking", "Ngữ dụng", "Pragmatics"),
  c("collocations", "language-thinking", "Collocations", "Collocations"),
  c("context-usage", "language-thinking", "Ngữ cảnh & cách dùng tự nhiên", "Context & natural usage"),
  // Knowledge Hub
  c("writing-tips", "knowledge", "Mẹo viết", "Writing tips"),
  c("common-mistakes", "knowledge", "Lỗi thường gặp", "Common mistakes"),
  c("learning-methods", "knowledge", "Phương pháp học", "Learning methods"),
  c("vocabulary-collections", "knowledge", "Bộ từ vựng", "Vocabulary collections"),
  c("resources", "knowledge", "Tài liệu", "Learning resources"),
] as const satisfies readonly Category[];

export type CategoryId = (typeof categories)[number]["id"];

export const categoryIds = categories.map((cat) => cat.id) as [CategoryId, ...CategoryId[]];

export function getCategory(id: string): Category | undefined {
  return categories.find((cat) => cat.id === id);
}

export function categoriesInSection(section: SectionId): Category[] {
  return categories.filter((cat) => cat.section === section);
}

/** URL segments under a section that cannot be used as article slugs. */
export const reservedSlugs = ["category"] as const;

/** Words per minute used for reading time. */
export const READING_WPM = 220;

/**
 * The writing framework shown on the IELTS home page: the order in which an essay
 * is thought through. Each step links to the category that teaches it.
 */
export const writingFramework: { category: CategoryId; title: Localized; note: Localized }[] = [
  {
    category: "understanding-questions",
    title: { vi: "Hiểu đề", en: "Understand" },
    note: { vi: "Chủ đề, phạm vi và yêu cầu thực sự của đề bài.", en: "Topic, scope and the real task in the question." },
  },
  {
    category: "brainstorming",
    title: { vi: "Brainstorm", en: "Brainstorm" },
    note: { vi: "Tìm nhiều hướng tiếp cận trước khi chọn một.", en: "Find several angles before choosing one." },
  },
  {
    category: "idea-development",
    title: { vi: "Phát triển ý", en: "Develop" },
    note: { vi: "Biến một ý chung thành lý do, ví dụ và hệ quả.", en: "Turn a general idea into reasons, examples and consequences." },
  },
  {
    category: "argument-construction",
    title: { vi: "Lập luận", en: "Argue" },
    note: { vi: "Một quan điểm rõ ràng, được bảo vệ xuyên suốt.", en: "One clear position, defended throughout." },
  },
  {
    category: "coherence-cohesion",
    title: { vi: "Kết nối", en: "Connect" },
    note: { vi: "Đoạn văn và câu dẫn dắt người đọc một cách tự nhiên.", en: "Paragraphs and sentences that guide the reader." },
  },
  {
    category: "lexical-resource",
    title: { vi: "Tinh chỉnh", en: "Refine" },
    note: { vi: "Từ vựng chính xác và ngữ pháp đa dạng, đúng.", en: "Precise vocabulary and accurate, varied grammar." },
  },
];
