import Link from "next/link";
import { defaultLocale } from "@/config/i18n";
import { ieltsHref } from "@/config/site";
import { Container } from "@/components/ui/container";

// not-found.tsx receives no params, so the message is bilingual.
export default function IeltsNotFound() {
  return (
    <Container className="py-32">
      <p className="font-mono text-xs text-muted">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        Không tìm thấy trang <span className="text-muted">/ Page not found</span>
      </h1>
      <p className="mt-6">
        <Link href={ieltsHref(`/${defaultLocale}`)} className="underline decoration-accent decoration-2 underline-offset-[6px]">
          IELTS Writing Lab →
        </Link>
      </p>
    </Container>
  );
}
