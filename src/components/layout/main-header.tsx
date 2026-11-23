import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { NavLinks } from "./nav-links";

export function MainHeader() {
  return (
    <header className="relative z-30 border-b border-rule">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-tight">
          {site.wordmark}
        </Link>
        <NavLinks items={mainNav()} menuLabel="Menu" closeLabel="Close" />
      </Container>
    </header>
  );
}
