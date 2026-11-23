import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

/** Page intro on the white canvas: eyebrow, large headline, lede. Shared by both sites. */
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
  center = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <header>
      <Container className={`reveal pt-14 pb-10 md:pt-20 md:pb-14 ${center ? "text-center" : ""}`}>
        {eyebrow && <p className="t-eyebrow mb-3 text-badge">{eyebrow}</p>}
        <h1 className={`t-display max-w-[18ch] ${center ? "mx-auto" : ""}`}>{title}</h1>
        {description && (
          <p className={`t-lede mt-5 max-w-[34ch] text-muted ${center ? "mx-auto" : ""}`}>{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}
