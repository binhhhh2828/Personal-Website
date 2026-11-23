import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { slugifyHeading } from "@/lib/content";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function H2(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 id={slugifyHeading(textOf(props.children))} {...props} />;
}
function H3(props: ComponentPropsWithoutRef<"h3">) {
  return <h3 id={slugifyHeading(textOf(props.children))} {...props} />;
}

function A({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

/* ── Custom blocks available inside MDX ───────────────────────────────────── */

/** <Callout title="Why it matters">…</Callout> — a quiet side note. */
function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="not-prose border-l-2 border-accent bg-surface/60 py-4 pr-4 pl-5 font-body text-[0.9375rem] leading-relaxed">
      {title && <p className="mb-1.5 font-sans text-sm font-semibold">{title}</p>}
      <div className="[&>*+*]:mt-2">{children}</div>
    </aside>
  );
}

/** <EssayPrompt task={2}>Question text…</EssayPrompt> — an IELTS question, set apart. */
function EssayPrompt({ task, children }: { task?: 1 | 2; children: ReactNode }) {
  return (
    <figure className="border-y border-rule py-5">
      <figcaption className="mb-2 font-mono text-xs tracking-wider text-muted uppercase">
        {task ? `Writing Task ${task} · Question` : "Question"}
      </figcaption>
      <blockquote className="!border-0 !p-0 font-body !text-fg !not-italic">{children}</blockquote>
    </figure>
  );
}

/**
 * <Compare before="…" after="…" note="…" /> — weaker vs stronger version of a sentence.
 * Labels default to English; pass beforeLabel/afterLabel for Vietnamese.
 */
function Compare({
  before,
  after,
  note,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: string;
  after: string;
  note?: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-sm bg-rule sm:grid-cols-2">
      <div className="bg-bg p-4">
        <p className="mb-1 font-mono text-xs tracking-wider text-muted uppercase">{beforeLabel}</p>
        <p className="text-muted">{before}</p>
      </div>
      <div className="bg-bg p-4">
        <p className="mb-1 font-mono text-xs tracking-wider text-accent-ink uppercase">{afterLabel}</p>
        <p>{after}</p>
      </div>
      {note && <p className="bg-bg p-4 text-[0.9375rem] text-muted sm:col-span-2">{note}</p>}
    </div>
  );
}

/** <Placeholder>…</Placeholder> — marks content still to be written by the author. */
function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-subtle p-4 font-mono text-sm text-muted">
      <span className="mr-2 text-accent-ink">[Placeholder]</span>
      {children}
    </div>
  );
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  a: A,
  Callout,
  EssayPrompt,
  Compare,
  Placeholder,
};
