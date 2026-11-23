"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor spotlight: a soft green glow that follows the pointer across its parent.
 * Drop it as the first child of any `relative` element; it is purely decorative.
 */
export function Spotlight({ color = "rgba(57, 181, 74, 0.22)", size = 520 }: { color?: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || !window.matchMedia("(hover: hover)").matches) return;
    const move = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    return () => {
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="spotlight"
      style={{ background: `radial-gradient(${size}px circle at var(--mx) var(--my), ${color}, transparent 60%)` }}
    />
  );
}
