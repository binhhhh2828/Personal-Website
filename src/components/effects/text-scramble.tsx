"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFxyz";

/**
 * Text scramble: characters shuffle through random glyphs, then settle into the real
 * text — once when it scrolls into view, again on hover. The real text is always in the
 * accessible name; only the visual copy animates. Off under prefers-reduced-motion.
 */
export function TextScramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;

    const run = () => {
      cancelAnimationFrame(raf);
      const plan = [...text].map((ch) => ({
        ch,
        start: Math.floor(Math.random() * 14),
        end: 14 + Math.floor(Math.random() * 22),
      }));
      const t0 = performance.now();
      const tick = () => {
        const frame = Math.floor((performance.now() - t0) / 30); // time-based: same speed at any fps
        let done = 0;
        el.textContent = plan
          .map(({ ch, start, end }) => {
            if (ch === " " || frame >= end) {
              done++;
              return ch;
            }
            return frame >= start ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : ch;
          })
          .join("");
        if (done < plan.length) raf = requestAnimationFrame(tick);
      };
      tick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    el.addEventListener("pointerenter", run);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", run);
      el.textContent = text;
    };
  }, [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {text}
      </span>
    </span>
  );
}
