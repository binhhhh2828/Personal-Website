"use client";

import { useEffect, useState } from "react";
import { confetti } from "@/lib/confetti";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/**
 * Easter eggs for the curious:
 *  · Konami code (↑↑↓↓←→←→BA) → confetti and a secret message
 *  · Click the wordmark in the nav 5 times quickly → another message
 *  · A hello in the browser console for anyone who opens DevTools
 * Messages come from profile.secrets.
 */
export function EasterEggs({ konami, logo, console: hello }: { konami: string; logo: string; console: string }) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log(`%c${hello}`, "color:#22a045;font:600 14px system-ui");

    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        confetti();
        setMessage(konami);
      }
    };

    let clicks: number[] = [];
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-brand]")) return;
      const now = Date.now();
      clicks = [...clicks.filter((t) => now - t < 2000), now];
      if (clicks.length >= 5) {
        clicks = [];
        confetti({ count: 90, origin: { x: 0.15, y: 0.05 } });
        setMessage(logo);
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [konami, logo, hello]);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 6000);
    return () => window.clearTimeout(t);
  }, [message]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      {message && (
        <p className="toast pointer-events-auto">
          <span aria-hidden>🌿</span> {message}
          <button type="button" className="ml-3 text-on-black-muted hover:text-on-black" onClick={() => setMessage(null)} aria-label="Close">
            ✕
          </button>
        </p>
      )}
    </div>
  );
}
