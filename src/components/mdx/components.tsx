import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { slugifyHeading } from "@/lib/content";
import { Photo as PhotoFrame } from "@/components/ui/photo";

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

/** <Callout title="Why it matters">…</Callout> — a quiet note on the surface colour. */
function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="rounded-[11px] bg-surface px-6 py-5 text-[17px] leading-[1.47]">
      {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
      <div className="[&>*+*]:mt-2">{children}</div>
    </aside>
  );
}

/** <EssayPrompt task={2}>Question text…</EssayPrompt> — an IELTS question, set like a pull quote. */
function EssayPrompt({ task, children }: { task?: 1 | 2; children: ReactNode }) {
  return (
    <figure className="rounded-[28px] bg-surface p-6 md:p-10">
      <figcaption className="t-caption mb-3 text-badge">
        {task ? `Writing Task ${task} · Question` : "Question"}
      </figcaption>
      <blockquote
        lang="en"
        className="!border-0 !p-0 font-display text-[21px] leading-[1.38] font-semibold !text-ink md:text-[24px] md:leading-[1.25]"
      >
        {children}
      </blockquote>
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
    <div className="grid gap-3 text-[17px] leading-[1.47] md:grid-cols-2">
      <div className="rounded-[11px] bg-surface p-6">
        <p className="t-caption mb-2 text-muted">{beforeLabel}</p>
        <p className="text-muted">{before}</p>
      </div>
      <div className="rounded-[11px] bg-surface p-6">
        <p className="t-caption mb-2 text-link">{afterLabel}</p>
        <p className="text-ink">{after}</p>
      </div>
      {note && <p className="t-body-sm text-muted md:col-span-2">{note}</p>}
    </div>
  );
}

/** <Placeholder>…</Placeholder> — marks content still to be written by the author. */
function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[11px] border border-dashed border-hairline px-5 py-4 text-[17px] leading-[1.47] text-muted">
      <span className="mr-2 font-semibold text-badge">[Placeholder]</span>
      {children}
    </div>
  );
}

/** <Photo src="/images/x.jpg" alt="…" caption="…" ratio="16/9" /> — image or empty frame. */
function Photo({ src, alt, caption, ratio = "16/9" }: { src: string; alt: string; caption?: string; ratio?: string }) {
  return (
    <figure className="!my-10">
      <PhotoFrame src={src} alt={alt} ratio={ratio} sizes="(min-width: 768px) 640px, 100vw" />
      {caption && <figcaption className="t-body-sm mt-3 text-muted">{caption}</figcaption>}
    </figure>
  );
}

/**
 * <Chapter id="childhood" eyebrow="1998–2010" title="Childhood" image="/images/about/childhood.jpg">
 *   Markdown…
 * </Chapter>
 * A chapter of the life story: large photo frame and text, alternating sides.
 */
function Chapter({
  id,
  eyebrow,
  title,
  image,
  imageAlt,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  image?: string;
  imageAlt?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className="group/chapter grid items-center gap-8 border-t border-hairline py-16 first:border-t-0 md:grid-cols-2 md:gap-14 md:py-24"
    >
      {image && (
        <div className="md:group-even/chapter:order-last">
          <PhotoFrame src={image} alt={imageAlt ?? title} ratio="4/5" label={title} sizes="(min-width: 768px) 480px, 100vw" />
        </div>
      )}
      <div className={image ? "" : "md:col-span-2"}>
        {eyebrow && <p className="t-eyebrow mb-2 text-badge">{eyebrow}</p>}
        <h2 id={id ? `${id}-title` : undefined} className="t-headline">
          {title}
        </h2>
        <div className="prose mt-6 [&>*:first-child]:mt-0">{children}</div>
      </div>
    </section>
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
  Photo,
  Chapter,
};
