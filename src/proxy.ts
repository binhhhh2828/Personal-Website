import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";
import { IELTS_PATH_PREFIX } from "@/config/site";

/**
 * Host-based routing (see docs/ROUTING.md).
 *
 *  ielts.<domain>/<path>  → internally rewritten to /ielts/<path>
 *  <domain>/ielts/<path>  → served directly in path mode,
 *                           301/308 to the subdomain in subdomain mode
 *  IELTS root (/)         → redirected to a language root (/vi or /en)
 *
 * Personal site (main host): Vietnamese is the default and lives at the root.
 *  /about                 → internally rewritten to /vi/about
 *  /en/about              → served as-is (English)
 *  /vi/about              → 308 to /about (one URL per page)
 *  /  with cookie lang=en → 307 to /en (the reader picked English before)
 */

const IELTS_URL = (process.env.NEXT_PUBLIC_IELTS_URL || "").replace(/\/+$/, "");

function isIeltsHost(host: string) {
  return host.startsWith("ielts.");
}

function hasIeltsPrefix(pathname: string) {
  return pathname === IELTS_PATH_PREFIX || pathname.startsWith(`${IELTS_PATH_PREFIX}/`);
}

function stripIeltsPrefix(pathname: string) {
  return pathname.slice(IELTS_PATH_PREFIX.length) || "/";
}

/** Pick vi/en for the bare IELTS root from Accept-Language, defaulting to Vietnamese. */
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

function redirect(request: NextRequest, pathname: string, status: 307 | 308) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, status);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  // ── IELTS subdomain ────────────────────────────────────────────────────────
  if (isIeltsHost(host)) {
    // ielts.x/ielts/foo is a duplicate of ielts.x/foo — normalise it.
    if (hasIeltsPrefix(pathname)) return redirect(request, stripIeltsPrefix(pathname), 308);
    if (pathname === "/") return redirect(request, `/${preferredLocale(request)}`, 307);

    const url = request.nextUrl.clone();
    url.pathname = `${IELTS_PATH_PREFIX}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Main domain ────────────────────────────────────────────────────────────
  if (hasIeltsPrefix(pathname)) {
    const rest = stripIeltsPrefix(pathname);

    // Subdomain mode: the subdomain is canonical, never serve duplicates here.
    if (IELTS_URL) {
      const target = rest === "/" ? `/${preferredLocale(request)}` : rest;
      return NextResponse.redirect(`${IELTS_URL}${target}${search}`, 308);
    }

    // Path mode (local dev / preview): /ielts → /ielts/vi
    if (rest === "/") return redirect(request, `${IELTS_PATH_PREFIX}/${preferredLocale(request)}`, 307);
    return NextResponse.next();
  }

  // Files (robots.txt, sitemap.xml, /gallery/vault/*.bin, …) are served as they are.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  // ── Personal site languages ────────────────────────────────────────────────
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  if (pathname === "/vi" || pathname.startsWith("/vi/")) return redirect(request, pathname.slice(3) || "/", 308);
  if (pathname === "/" && request.cookies.get("lang")?.value === "en") return redirect(request, "/en", 307);

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/vi" : `/vi${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except Next internals and static asset files.
    // robots.txt / sitemap.xml are intentionally matched so they can be rewritten per host.
    "/((?!_next/|favicon\\.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|woff2?|css|js|map)$).*)",
  ],
};
