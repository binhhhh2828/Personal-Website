import Link from "next/link";

type Item = { href: string; title: string };

/** Previous / next as two surface tiles. Labels are passed in so both sites can localise. */
export function PrevNext({
  previous,
  next,
  labels,
}: {
  previous?: Item;
  next?: Item;
  labels: { previous: string; next: string };
}) {
  if (!previous && !next) return null;
  const tile = (item: Item, label: string, rel: "prev" | "next", align: string) => (
    <Link href={item.href} rel={rel} className={`tile tile-link group block p-6 md:p-8 ${align}`}>
      <span className="t-body-sm text-muted">{label}</span>
      <span className="t-title mt-2 block text-balance group-hover:text-link">{item.title}</span>
    </Link>
  );
  return (
    <nav aria-label={`${labels.previous} / ${labels.next}`} className="grid gap-4 md:grid-cols-2">
      <div>{previous && tile(previous, `‹ ${labels.previous}`, "prev", "")}</div>
      <div>{next && tile(next, `${labels.next} ›`, "next", "md:text-right")}</div>
    </nav>
  );
}
