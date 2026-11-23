"use client";

import { useState } from "react";

/**
 * 3D flip card: the front shows a title, the back the note. Click, tap or Enter flips it.
 * Both faces stay in the accessibility tree, so nothing is hidden from screen readers.
 */
export function FlipCard({ index, title, note, hint }: { index: number; title: string; note: string; hint: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className="flip"
      aria-pressed={flipped}
      data-flipped={flipped || undefined}
      onClick={() => setFlipped((f) => !f)}
    >
      <span className="flip-inner">
        <span className="flip-face flip-front">
          <span className="t-caption text-badge">{String(index + 1).padStart(2, "0")}</span>
          <span className="t-title mt-auto block">{title}</span>
          <span className="t-body-sm mt-3 block text-muted">{hint}</span>
        </span>
        <span className="flip-face flip-back">
          <span className="t-caption text-accent">{title}</span>
          <span className="mt-auto block font-display text-[19px] leading-[1.42] text-on-black md:text-[21px]">{note}</span>
        </span>
      </span>
    </button>
  );
}
