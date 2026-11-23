/**
 * Domain + brand configuration. Single source of truth for every absolute URL.
 *
 * Two modes, chosen by NEXT_PUBLIC_IELTS_URL at build time:
 *  - path mode      (env empty):  IELTS lives at  {MAIN_URL}/ielts/...
 *  - subdomain mode (env set):    IELTS lives at  {IELTS_URL}/...
 * See docs/ROUTING.md.
 */

function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}

const mainUrl = trimSlash(process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:3000");
const ieltsEnvUrl = trimSlash(process.env.NEXT_PUBLIC_IELTS_URL || "");

export const IELTS_PATH_PREFIX = "/ielts";

export const site = {
  /** Brand name shared by both sites. */
  name: "Lại Bình",
  /** Short wordmark used in navigation. */
  wordmark: "Lại Bình",
  description:
    "Lại Bình — an IT student at KMA who writes things down: code, diaries, strange dreams and an English-learning journey.",
  mainUrl,
  locale: "en",
} as const;

export const ielts = {
  name: "IELTS Writing Lab",
  tagline: "Learn to think, not just to write.",
  /** True when IELTS is served from its own subdomain. */
  isSubdomain: ieltsEnvUrl !== "",
  /** Public origin + base path of the IELTS site, e.g. https://ielts.x.id.vn or http://localhost:3000/ielts */
  url: ieltsEnvUrl || `${mainUrl}${IELTS_PATH_PREFIX}`,
  /** Prefix for internal IELTS links: "" on the subdomain, "/ielts" in path mode. */
  basePath: ieltsEnvUrl ? "" : IELTS_PATH_PREFIX,
} as const;

/** Internal href inside the IELTS site, e.g. ieltsHref("/vi/writing-lab"). */
export function ieltsHref(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ielts.basePath}${p === "/" && ielts.basePath ? "" : p}` || "/";
}

/** Absolute IELTS URL (canonical, sitemap, OG, cross-site links). */
export function ieltsAbsolute(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ielts.url}${p === "/" ? "" : p}` || ielts.url;
}

/**
 * Path on the personal site in a given language. Vietnamese (the default) lives at the
 * root — "/about" — and English under "/en" — "/en/about". Keeps any "#hash".
 */
export function mainPath(lang: "vi" | "en", path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (lang === "vi") return p;
  const [pathname, hash] = p.split("#");
  const localized = pathname === "/" ? "/en" : `/en${pathname}`;
  return hash !== undefined ? `${localized}#${hash}` : localized;
}

/** Absolute main-site URL. */
export function mainAbsolute(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${site.mainUrl}${p === "/" ? "" : p}` || site.mainUrl;
}

/**
 * Link from the IELTS site back to the main site.
 * Absolute in subdomain mode (different host), relative in path mode.
 */
export function mainHrefFromIelts(path = "/") {
  return ielts.isSubdomain ? mainAbsolute(path) : path;
}

/** Link from the main site to the IELTS site. */
export function ieltsHrefFromMain(path = "/") {
  return ielts.isSubdomain ? ieltsAbsolute(path) : ieltsHref(path);
}
