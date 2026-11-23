import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { cx } from "@/lib/format";

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
  ratio?: string;
  className?: string;
  rounded?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Short caption inside the placeholder, e.g. "Childhood". */
  label?: string;
  /** Placeholder background: "surface" on white, "raised" inside grey tiles, "dark" on black. */
  tone?: "surface" | "raised" | "dark";
}) {
  const isRemote = /^https?:\/\//.test(src);
  const exists = isRemote || fs.existsSync(path.join(process.cwd(), "public", src));
  const frame = cx("relative w-full overflow-hidden", tone === "dark" ? "bg-[#1d1d1f]" : tone === "raised" ? "bg-surface-raised" : "bg-surface", rounded && "rounded-[28px]", className);

  if (!exists) {
    return (
      <div className={frame} style={{ aspectRatio: ratio }} role="img" aria-label={`${alt} (photo coming soon)`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
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
    <div className={frame} style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
