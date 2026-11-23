import type { Heading } from "@/lib/content";
import { cx } from "@/lib/format";

export function TableOfContents({ headings, label }: { headings: Heading[]; label: string }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label={label} className="t-body-sm">
      <p className="t-caption mb-3 text-ink">{label}</p>
      <ol className="space-y-2.5">
        {headings.map((h) => (
          <li key={h.id} className={cx(h.level === 3 && "pl-3")}>
            <a href={`#${h.id}`} className="block text-muted transition-colors hover:text-link">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
