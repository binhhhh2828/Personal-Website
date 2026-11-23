import Link from "next/link";
import type { ReactNode } from "react";

/** A ruled section header: label left, optional link right. */
export function SectionHeading({
  children,
  href,
  linkLabel,
  id,
}: {
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  id?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-fg pt-3">
      <h2 id={id} className="font-mono text-xs tracking-[0.08em] uppercase">
        {children}
      </h2>
      {href && linkLabel && (
        <Link href={href} className="font-mono text-xs text-muted transition-colors hover:text-fg">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
