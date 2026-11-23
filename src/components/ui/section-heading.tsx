import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Section header: optional eyebrow, headline, and a "View all ›" link. */
export function SectionHeading({
  children,
  href,
  linkLabel,
  id,
  eyebrow,
  className,
  external = false,
}: {
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  id?: string;
  eyebrow?: ReactNode;
  className?: string;
  /** Cross-site link: plain <a>. */
  external?: boolean;
}) {
  const link =
    href && linkLabel ? (
      external ? (
        <a href={href} className="link link-more">
          {linkLabel}
        </a>
      ) : (
        <Link href={href} className="link link-more">
          {linkLabel}
        </Link>
      )
    ) : null;
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-x-8 gap-y-3", className)}>
      <div>
        {eyebrow && <p className="t-eyebrow mb-2 text-muted">{eyebrow}</p>}
        <h2 id={id} className="t-headline">
          {children}
        </h2>
      </div>
      {link}
    </div>
  );
}
