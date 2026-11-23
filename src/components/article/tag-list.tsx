import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { ieltsHref } from "@/config/site";

export function TagList({ tags, lang }: { tags: string[]; lang: Locale }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={ieltsHref(`/${lang}/tags/${tag}`)} className="text-muted transition-colors hover:text-accent-ink">
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
