import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponentsFor } from "./components";
import type { MainLocale } from "@/config/i18n";

/**
 * Renders an MDX string on the server at build time. Content is author-controlled.
 * "prose" wraps everything in the reading column; "story" lets <Chapter> blocks use the full width.
 */
export function MdxContent({
  source,
  variant = "prose",
  lang = "vi",
}: {
  source: string;
  variant?: "prose" | "story";
  lang?: MainLocale;
}) {
  return (
    <div className={variant === "prose" ? "prose" : undefined}>
      <MDXRemote
        source={source}
        components={mdxComponentsFor(lang)}
        options={{
          mdxOptions: { remarkPlugins: [remarkGfm] },
          // Allow simple expressions like task={2}; dangerous globals stay blocked.
          blockJS: false,
          blockDangerousJS: true,
        }}
      />
    </div>
  );
}
