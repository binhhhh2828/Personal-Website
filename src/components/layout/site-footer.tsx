import Link from "next/link";
import { footerColumns } from "@/config/navigation";
import { profileShared } from "@/config/profile";
import { getMainDict } from "@/config/main-i18n";
import { site } from "@/config/site";
import type { Locale } from "@/config/i18n";
import { Container } from "@/components/ui/container";

/**
 * Shared footer (spec "Footer"): #F5F5F7, 12px text at 56% black, a link directory
 * for both sites, then a hairline and the copyright line.
 */
export function SiteFooter({ from, lang = "vi", note }: { from: "main" | "ielts"; lang?: Locale; note?: string }) {
  const year = new Date().getFullYear();
  const columns = footerColumns(from, lang);
  const t = getMainDict(lang);
  return (
    // The grey fades in from the page above, so the footer has no hard top edge.
    <footer className="bg-[linear-gradient(to_bottom,var(--canvas)_0,var(--surface)_8rem)] pt-28 text-[12px] leading-[1.33] tracking-[-0.01em] text-muted">
      <Container className="py-10">
        {note && <p className="border-b border-hairline pb-4">{note}</p>}
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 py-6 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-2 font-semibold text-body">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {col.crossSite ? (
                      <a href={l.href} className="hover:text-body hover:underline">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hover:text-body hover:underline">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {profileShared.links.length > 0 && (
            <div>
              <p className="mb-2 font-semibold text-body">{t.footer.elsewhere}</p>
              <ul className="space-y-2">
                {profileShared.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="hover:text-body hover:underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
        <p className="border-t border-hairline pt-4">
          Copyright © {year} {site.name}.
        </p>
      </Container>
    </footer>
  );
}
