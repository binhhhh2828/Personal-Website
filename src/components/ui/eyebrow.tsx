import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Eyebrow above a headline. "badge" uses the decorative accent (leaf green), sparingly. */
export function Eyebrow({
  children,
  className,
  tone = "muted",
}: {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "badge" | "ink";
}) {
  return (
    <p
      className={cx(
        "t-eyebrow",
        tone === "muted" && "text-muted",
        tone === "badge" && "text-badge",
        tone === "ink" && "text-ink",
        className,
      )}
    >
      {children}
    </p>
  );
}
