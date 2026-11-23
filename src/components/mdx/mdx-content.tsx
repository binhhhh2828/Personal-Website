import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./components";

/** Renders an MDX string on the server at build time. Content is author-controlled. */
export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] },
          // Allow simple expressions like task={2}; dangerous globals stay blocked.
          blockJS: false,
          blockDangerousJS: true,
        }}
      />
    </div>
  );
}
