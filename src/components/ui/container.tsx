import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** 980px content column (spec §5); "nav" is the 1024px bar width. 16px gutters, 12px from 1068px. */
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
        "mx-auto w-full px-4 min-[1068px]:px-3",
        size === "content" && "max-w-[calc(var(--container-content)+24px)]",
        size === "nav" && "max-w-(--container-nav) min-[1068px]:px-[22px]",
        size === "prose" && "max-w-[calc(var(--container-prose)+32px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
