"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/lib/format";

const BRUSH = 46; // px radius-ish (line width)
const DONE_AT = 0.45; // fraction cleared before the rest dissolves on its own

/**
 * Scratch-to-reveal: a green foil layer over a photo. Visitors scratch it away with the
 * mouse (just move over it) or a finger (drag). Once ~45% is cleared the rest dissolves.
 * The photo underneath is always in the DOM with its alt text, so screen readers and
 * search engines see it; the foil is decorative. A "Reveal" button does it in one go
 * (keyboard users). Revealed photos stay revealed for the rest of the visit.
 *
 * State lives on the DOM (data-state: idle → covered → scratching → revealing → revealed)
 * rather than React state, so server and client render the same markup. While "idle"
 * (before hydration) a CSS foil covers the photo, so it never flashes uncovered.
 */
export function ScratchReveal({
  id,
  children,
  className,
  hint = "Scratch to reveal",
}: {
  /** Unique per photo — remembers the reveal for this visit. */
  id: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const key = `scratch:${id}`;

    const finish = (animate: boolean) => {
      if (root.dataset.state === "revealed") return;
      root.dataset.state = animate ? "revealing" : "revealed";
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
      if (animate) window.setTimeout(() => (root.dataset.state = "revealed"), 700);
    };

    try {
      if (sessionStorage.getItem(key) === "1") {
        root.dataset.state = "revealed";
        return;
      }
    } catch {}

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      root.dataset.state = "revealed";
      return;
    }

    let size = { w: 0, h: 0 };
    let last: { x: number; y: number } | null = null;
    let pressing = false;
    let strokes = 0;

    const paint = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (Math.abs(r.width - size.w) < 2 && Math.abs(r.height - size.h) < 2) return;
      size = { w: r.width, h: r.height };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      const { w, h } = size;

      // Foil: deep forest → mint, with a soft diagonal sheen and a fine grain.
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0f8a3c");
      g.addColorStop(0.4, "#39b54a");
      g.addColorStop(0.65, "#a8d94f");
      g.addColorStop(1, "#22a045");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const sheen = ctx.createLinearGradient(0, h, w, 0);
      sheen.addColorStop(0.3, "rgba(255,255,255,0)");
      sheen.addColorStop(0.5, "rgba(255,255,255,0.22)");
      sheen.addColorStop(0.7, "rgba(255,255,255,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);
      const dots = Math.min(4000, Math.round((w * h) / 260));
      for (let i = 0; i < dots; i++) {
        ctx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.16).toFixed(3)})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
      }
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = BRUSH;
    };

    const clearedFraction = () => {
      const { width, height } = canvas;
      if (!width || !height) return 0;
      const data = ctx.getImageData(0, 0, width, height).data;
      const step = 4 * 24; // sample every 24th pixel
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += step) {
        total++;
        if (data[i] < 40) clear++;
      }
      return total ? clear / total : 0;
    };

    const point = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const scratch = (p: { x: number; y: number }) => {
      if (root.dataset.state !== "covered" && root.dataset.state !== "scratching") return;
      root.dataset.state = "scratching";
      ctx.beginPath();
      if (last) {
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else {
        ctx.arc(p.x, p.y, BRUSH / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      last = p;
      if (++strokes % 12 === 0 && clearedFraction() > DONE_AT) finish(true);
    };

    const onDown = (e: PointerEvent) => {
      e.stopPropagation(); // don't start a drag on a parent (e.g. the polaroid board)
      pressing = true;
      last = null;
      canvas.setPointerCapture?.(e.pointerId);
      scratch(point(e));
    };
    const onMove = (e: PointerEvent) => {
      // Mouse scratches on hover; touch and pen scratch while pressed.
      if (e.pointerType === "mouse" || pressing) scratch(point(e));
    };
    const onUp = () => {
      pressing = false;
      last = null;
      if (clearedFraction() > DONE_AT) finish(true);
    };
    const onLeave = () => {
      if (!pressing) last = null;
    };

    root.dataset.state = "covered";
    paint();
    const ro = new ResizeObserver(() => {
      if (root.dataset.state === "covered") paint();
    });
    ro.observe(canvas);

    const btn = root.querySelector<HTMLButtonElement>("[data-scratch-reveal]");
    const onReveal = () => finish(true);

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    btn?.addEventListener("click", onReveal);
    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      btn?.removeEventListener("click", onReveal);
    };
  }, [id]);

  return (
    <div ref={rootRef} className={cx("scratch", className)} data-state="idle">
      {children}
      {/* Without JavaScript there is nothing to scratch with: show the photo. */}
      <noscript>
        <style>{".scratch::after,.scratch-hint,.scratch-button{display:none!important}"}</style>
      </noscript>
      <canvas ref={canvasRef} className="scratch-foil" aria-hidden />
      <p className="scratch-hint" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.6-2.2L3.6 15a1.5 1.5 0 0 1 2.3-1.9L9 16"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {hint}
      </p>
      <button type="button" className="scratch-button" data-scratch-reveal>
        Reveal photo
      </button>
    </div>
  );
}
