"use client";

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

/** Scatter for up to 6 cards: [top offset rem, rotation deg]. */
const SCATTER: [number, number][] = [
  [2.5, -6],
  [0.5, 3.5],
  [3.5, -2],
  [1, 5],
  [4, -4],
  [1.5, 2],
];

/**
 * Draggable photo gallery: Polaroids scattered on a table. From 768px they can be dragged
 * anywhere on the board (grab the white frame — the photo itself is a scratch card until
 * revealed). On phones they simply stack. "Tidy up" puts them back.
 */
export function PolaroidBoard({ cards, tidyLabel = "Tidy up" }: { cards: ReactNode[]; tidyLabel?: string }) {
  const [offsets, setOffsets] = useState(() => cards.map(() => ({ x: 0, y: 0 })));
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [active, setActive] = useState<number | null>(null);
  const drag = useRef<{ i: number; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const moved = offsets.some((o) => o.x || o.y);

  const onDown = (i: number) => (e: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(min-width: 768px)").matches || e.button !== 0) return;
    // Let links and buttons inside the card work normally.
    if ((e.target as HTMLElement).closest("a, button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, sx: e.clientX, sy: e.clientY, ox: offsets[i].x, oy: offsets[i].y };
    setActive(i);
    setOrder((o) => [...o.filter((x) => x !== i), i]);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const x = d.ox + e.clientX - d.sx;
    const y = d.oy + e.clientY - d.sy;
    setOffsets((all) => all.map((o, j) => (j === d.i ? { x, y } : o)));
  };
  const onUp = () => {
    drag.current = null;
    setActive(null);
  };

  return (
    <div className="polaroid-board">
      {cards.map((card, i) => {
        const [top, rot] = SCATTER[i % SCATTER.length];
        const { x, y } = offsets[i];
        return (
          <div
            key={i}
            className="polaroid"
            data-dragging={active === i || undefined}
            style={
              {
                "--left": `${((i + 0.5) / cards.length) * 100}%`,
                "--top": `${top}rem`,
                "--rot": `${rot}deg`,
                "--dx": `${x}px`,
                "--dy": `${y}px`,
                zIndex: order.indexOf(i) + 1,
              } as CSSProperties
            }
            onPointerDown={onDown(i)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {card}
          </div>
        );
      })}
      {moved && (
        <button
          type="button"
          className="btn btn-chip absolute right-0 bottom-0 z-[50] !bg-canvas hover:!bg-surface-raised"
          onClick={() => setOffsets(cards.map(() => ({ x: 0, y: 0 })))}
        >
          {tidyLabel}
        </button>
      )}
    </div>
  );
}
