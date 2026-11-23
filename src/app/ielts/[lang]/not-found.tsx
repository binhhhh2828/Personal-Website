import Link from "next/link";
import { defaultLocale } from "@/config/i18n";
import { ieltsHref } from "@/config/site";
import { Container } from "@/components/ui/container";

// not-found.tsx receives no params, so the message is bilingual.
export default function IeltsNotFound() {
  return (
    <Container className="py-24 text-center md:py-32">
      <p className="t-eyebrow text-badge">404</p>
      <h1 className="t-display mt-2">Không tìm thấy trang</h1>
      <p className="t-lede mt-4 text-muted" lang="en">
        Page not found
      </p>
      <Link href={ieltsHref(`/${defaultLocale}`)} className="btn btn-primary mt-8">
        IELTS Writing Lab
      </Link>
    </Container>
  );
}
