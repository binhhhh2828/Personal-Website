import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Small mono label used above headings and for metadata. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("font-mono text-xs tracking-[0.08em] text-muted uppercase", className)}>{children}</p>;
}
