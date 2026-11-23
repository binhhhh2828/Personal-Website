import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Wide content column (~1472px) so sections breathe edge to edge; "prose" stays a narrow reading column. */
export function Container({
  children,
  className,
  size = "content",
}: {
  children: ReactNode;
  className?: string;
  size?: "content" | "nav" | "prose";
}) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-5 md:px-10",
        size === "content" && "max-w-[calc(var(--container-content)+80px)]",
        size === "nav" && "max-w-[calc(var(--container-nav)+80px)]",
        size === "prose" && "max-w-[calc(var(--container-prose)+80px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
