import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Large editorial page heading shared by listing pages on both sites. */
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="reveal grid gap-6 pt-16 pb-12 md:grid-cols-12 md:pt-24 md:pb-16">
      <div className="md:col-span-8">
        {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
        <h1 className="font-display text-[2.75rem] leading-[1.02] text-balance sm:text-6xl md:text-7xl">{title}</h1>
        {description && (
          <p className="mt-6 max-w-[52ch] font-body text-lg leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {children && <div className="md:col-span-4 md:self-end">{children}</div>}
    </header>
  );
}
