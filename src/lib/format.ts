import type { MainLocale } from "@/config/i18n";

export function formatDate(date: Date, lang: MainLocale = "en") {
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : lang === "zh" ? "zh-CN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
