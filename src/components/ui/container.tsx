import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Page-width container with the shared 12-column grid gutters. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-(--container-page) px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}
