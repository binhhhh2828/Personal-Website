import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./components";

/**
 * Renders an MDX string on the server at build time. Content is author-controlled.
 * "prose" wraps everything in the reading column; "story" lets <Chapter> blocks use the full width.
 */
export function MdxContent({ source, variant = "prose" }: { source: string; variant?: "prose" | "story" }) {
  return (
    <div className={variant === "prose" ? "prose" : undefined}>
      <MDXRemote
        source={source}
        components={mdxComponents}
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
