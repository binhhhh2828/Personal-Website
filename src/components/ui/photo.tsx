import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { cx } from "@/lib/format";
import { showDrafts } from "@/lib/drafts";

/** Whether a public image is there yet (remote URLs count as present). */
export function imageExists(src: string) {
  return /^https?:\/\//.test(src) || fs.existsSync(path.join(process.cwd(), "public", src));
}

/**
 * Photo frame. Pass the public path where the image *will* live, e.g.
 * "/images/about/childhood.jpg". If that file exists in /public it is shown
 * (optimised by next/image); otherwise a quiet placeholder frame shows the path
 * to upload to. So adding a photo is: drop the file in /public, rebuild.
 */
export function Photo({
  src,
  alt,
  ratio = "4/3",
  className,
  rounded = true,
  priority = false,
  sizes = "(min-width: 1068px) 980px, 100vw",
  label,
  tone = "surface",
}: {
  src: string;
  alt: string;
  /** CSS aspect-ratio, or "auto" to size from className (e.g. fill a split column). */
  ratio?: string;
  className?: string;
  rounded?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Short caption inside the placeholder, e.g. "Childhood". */
  label?: string;
  /** Frame background (soft green gradients, globals.css .ph-*): "surface" on white, "raised" inside tiles, "dark" on dark bands. */
  tone?: "surface" | "raised" | "dark";
}) {
  const exists = imageExists(src);
  const frame = cx("relative w-full overflow-hidden", tone === "dark" ? "ph-dark" : tone === "raised" ? "ph-raised" : "ph-surface", rounded && "rounded-[28px]", className);

  if (!exists) {
    return (
      <div
        className={frame}
        style={ratio === "auto" ? undefined : { aspectRatio: ratio }}
        role={showDrafts ? "img" : undefined}
        aria-label={showDrafts ? `${alt} (photo coming soon)` : undefined}
        aria-hidden={showDrafts ? undefined : true}
      >
        {/* Visitors see only the soft frame; the upload hint is for you, in development. */}
        <div className={cx("absolute inset-0 flex-col items-center justify-center gap-2 p-6 text-center", showDrafts ? "flex" : "hidden")}>
          <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-faint">
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.75" stroke="currentColor" strokeWidth="1.5" />
            <path d="m4 17 5-4.5 3.5 3 3-2.5L20 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          {label && <p className={cx("t-body-sm font-semibold", tone === "dark" ? "text-on-black-muted" : "text-muted")}>{label}</p>}
          <p className="t-caption max-w-[28ch] font-normal break-all text-faint">public{src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={frame} style={ratio === "auto" ? undefined : { aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="photo-img object-cover" />
    </div>
  );
}
