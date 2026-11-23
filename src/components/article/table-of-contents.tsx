import type { Heading } from "@/lib/content";
import { cx } from "@/lib/format";

export function TableOfContents({ headings, label }: { headings: Heading[]; label: string }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label={label} className="text-sm">
      <p className="mb-3 font-mono text-xs tracking-[0.08em] text-muted uppercase">{label}</p>
      <ol className="space-y-2 border-l border-rule">
        {headings.map((h) => (
          <li key={h.id} className={cx(h.level === 3 && "pl-3")}>
            <a
              href={`#${h.id}`}
              className="-ml-px block border-l border-transparent pl-3 leading-snug text-muted transition-colors hover:border-fg hover:text-fg"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
