import Link from "next/link";
import { globalNav } from "@/config/navigation";
import { mainHrefFromIelts, site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { cx } from "@/lib/format";
import { NavLinks } from "./nav-links";

/**
 * Global navigation (spec "Primary Navigation Bar"): 44px, rgba(29,29,31,0.8), translucent.
 * The same bar on both sites — the personal brand is always one click away.
 * Sticky on the personal site; on IELTS it scrolls away and the local bar sticks instead.
 */
export function GlobalNav({ from, sticky }: { from: "main" | "ielts"; sticky: boolean }) {
  const brand = <span className="t-body-sm font-semibold text-white">{site.wordmark}</span>;
  return (
    <header className={cx("z-20 bg-nav backdrop-blur-xl backdrop-saturate-[1.8]", sticky ? "sticky top-0" : "relative")}>
      <Container size="nav" className="relative flex h-11 items-center justify-between">
        {from === "main" ? (
          <Link href="/" data-brand>
            {brand}
          </Link>
        ) : (
          <a href={mainHrefFromIelts("/")}>{brand}</a>
        )}
        <NavLinks items={globalNav(from)} menuLabel="Menu" closeLabel="Close" variant="global" />
      </Container>
    </header>
  );
}
