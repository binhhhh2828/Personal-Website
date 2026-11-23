import type { Work } from "@/config/profile";
import { Photo } from "@/components/ui/photo";

/** Works as photo tiles: image frame on top, meta, title, summary, tag chips. */
export function WorkGrid({ works }: { works: Work[] }) {
  if (works.length === 0) {
    return <p className="tile px-6 py-10 text-center text-muted">Coming soon.</p>;
  }
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {works.map((w) => {
        const inner = (
          <>
            <Photo
              src={w.image}
              alt={w.title}
              ratio="16/10"
              rounded={false}
              tone="raised"
              label={w.title}
              sizes="(min-width: 768px) 490px, 100vw"
            />
            <div className="p-6 md:p-8">
              <p className="t-caption text-badge">
                {w.year}
                {w.role && <span className="text-muted"> · {w.role}</span>}
                {w.venue && <span className="text-muted"> · {w.venue}</span>}
              </p>
              <h2 className="t-title mt-2">
                {w.title}
                {w.href && <span aria-hidden className="text-link"> ↗</span>}
              </h2>
              <p className="mt-2 text-muted">{w.summary}</p>
              {w.tags.length > 0 && (
                <p className="mt-5 flex flex-wrap gap-2">
                  {w.tags.map((t) => (
                    <span key={t} className="t-body-sm rounded-full bg-canvas px-3 py-1 text-muted">
                      {t}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </>
        );
        return (
          <li key={w.title}>
            {w.href ? (
              <a href={w.href} className="tile tile-link block h-full">
                {inner}
              </a>
            ) : (
              <div className="tile h-full">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
