import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { SkipLink } from "./skip-link";

/** <html>/<body> shell shared by both root layouts (personal site and IELTS). */
export function Document({
  lang,
  children,
  skipLabel,
}: {
  lang: string;
  children: ReactNode;
  skipLabel?: string;
}) {
  return (
    <html lang={lang} className={`${fontVariables} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-bg text-fg">
        <SkipLink label={skipLabel} />
        {children}
      </body>
    </html>
  );
}
