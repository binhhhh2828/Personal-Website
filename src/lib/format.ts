import type { Locale } from "@/config/i18n";

export function formatDate(date: Date, lang: Locale | "en" = "en") {
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", {
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
