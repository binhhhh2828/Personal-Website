import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { site } from "@/config/site";
import { Document } from "@/components/layout/document";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: `404 — ${site.name}`,
  robots: { index: false },
};

/**
 * 404 for URLs that match no route on either site (two root layouts means there is
 * no single layout to compose from). On the IELTS host, / redirects to the language root.
 */
export default function GlobalNotFound() {
  return (
    <Document lang="en">
      <main id="main" className="flex flex-1 items-center">
        <Container className="py-32">
          <p className="font-mono text-xs text-muted">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Page not found</h1>
          <p className="mt-2 text-lg text-muted" lang="vi">
            Không tìm thấy trang
          </p>
          <p className="mt-8">
            <Link href="/" className="underline decoration-accent decoration-2 underline-offset-[6px]">
              Home →
            </Link>
          </p>
        </Container>
      </main>
    </Document>
  );
}
