import { ieltsAbsolute } from "@/config/site";

/**
 * robots.txt for the IELTS site. Lives at /ielts/robots.txt and is exposed as
 * ielts.<domain>/robots.txt by the proxy rewrite.
 */
export const dynamic = "force-static";

export function GET() {
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${ieltsAbsolute("/sitemap.xml")}`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
