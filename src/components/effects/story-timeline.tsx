"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "@/lib/format";

type Chapter = { id: string; title: string; eyebrow?: string; summary?: string };

/**
 * Interactive timeline of the life-story chapters. Each milestone is a tab: click (or use
 * ←/→) to open its one-line summary, with a link to the full chapter on /about.
 */
export function StoryTimeline({ chapters, readLabel = "Read this chapter" }: { chapters: Chapter[]; readLabel?: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  if (chapters.length === 0) return null;
  const c = chapters[Math.min(active, chapters.length - 1)];

  const onKey = (e: KeyboardEvent) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? chapters.length - 1 : (active + delta + chapters.length) % chapters.length;
    if (!delta && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="timeline">
      <div role="tablist" aria-label="Chapters of my story" className="timeline-track" onKeyDown={onKey}>
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cx("timeline-node", i < active && "is-past")}
          >
            <span className="timeline-dot" aria-hidden />
            <span className="timeline-label">{ch.title}</span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${active}`}
        className="timeline-panel"
        key={c.id}
      >
        {c.eyebrow && <p className="t-caption text-badge">{c.eyebrow}</p>}
        <p className="t-title mt-1">{c.title}</p>
        {c.summary && <p className="mt-2 text-muted">{c.summary}</p>}
        <Link href={`/about#${c.id}`} className="link link-more mt-3 inline-block">
          {readLabel}
        </Link>
      </div>
    </div>
  );
}
