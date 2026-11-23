import Link from "next/link";

/** Tag chips. `hrefFor` builds each tag's URL (IELTS and Journal differ). */
export function TagList({ tags, hrefFor }: { tags: string[]; hrefFor?: (tag: string) => string }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          {hrefFor ? (
            <Link href={hrefFor(tag)} className="btn btn-chip">
              #{tag}
            </Link>
          ) : (
            <span className="btn btn-chip pointer-events-none">#{tag}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
