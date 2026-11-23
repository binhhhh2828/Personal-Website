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
        <Container className="py-24 text-center md:py-32">
          <p className="t-eyebrow text-badge">404</p>
          <h1 className="t-display mt-2">Page not found</h1>
          <p className="t-lede mt-4 text-muted" lang="vi">
            Không tìm thấy trang
          </p>
          <Link href="/" className="btn btn-primary mt-8">
            Home
          </Link>
        </Container>
      </main>
    </Document>
  );
}
