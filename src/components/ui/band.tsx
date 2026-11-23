import type { AriaAttributes, ReactNode } from "react";
import { cx } from "@/lib/format";

/** Full-width black tile (Apple "Pro" moments): white type, no rounding. */
export function BlackBand({
  children,
  className,
  as: Tag = "section",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "header" | "div";
} & AriaAttributes) {
  return (
    <Tag className={cx("on-black", className)} {...rest}>
      {children}
    </Tag>
  );
}
