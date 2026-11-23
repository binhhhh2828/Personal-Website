import { ielts, site } from "@/config/site";
import { Container } from "@/components/ui/container";

/** Shared footer: the same brand line on both sites. */
export function SiteFooter({
  mainHref,
  ieltsHref,
  note,
}: {
  mainHref: string;
  ieltsHref: string;
  note?: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-rule">
      <Container className="flex flex-col gap-6 py-10 font-mono text-xs text-muted sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-fg">{site.name}</p>
          {note && <p>{note}</p>}
        </div>
        <nav aria-label="Sites" className="flex gap-6">
          <a href={mainHref} className="transition-colors hover:text-fg">
            Personal site
          </a>
          <a href={ieltsHref} className="transition-colors hover:text-fg">
            {ielts.name}
          </a>
        </nav>
        <p>© {year}</p>
      </Container>
    </footer>
  );
}
