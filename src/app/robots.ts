import type { MetadataRoute } from "next";
import { ielts, ieltsAbsolute, mainAbsolute } from "@/config/site";

/** robots.txt for the main domain. The IELTS subdomain serves app/ielts/robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // In path mode IELTS lives on this host, so its sitemap is listed here too.
    sitemap: ielts.isSubdomain
      ? mainAbsolute("/sitemap.xml")
      : [mainAbsolute("/sitemap.xml"), ieltsAbsolute("/sitemap.xml")],
  };
}
