import type { ReactNode } from "react";

/** Visibly marks text that is a placeholder for real personal content. */
export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <p className="border border-dashed border-subtle px-3 py-2 font-mono text-xs text-muted">
      <span className="text-accent-ink">[Placeholder]</span> {children}
    </p>
  );
}
