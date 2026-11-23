import type { ReactNode } from "react";
import { cx } from "@/lib/format";
import { Container } from "./container";
import { Photo, imageExists } from "./photo";
import { ScratchReveal } from "@/components/effects/scratch-reveal";
import type { MainLocale } from "@/config/i18n";

/**
 * Split feature: a large photo bleeding to the viewport edge on one side, dissolving
 * into the page behind the text (CSS masks in globals.css → .split*). No frame, no
 * hard edge. On mobile the photo sits on top and fades down under the text.
 *
 *  side="right" (default) photo right · side="left" photo left · alternate=true flips every
 *  other sibling automatically (used by About chapters). Photos are scratch cards: visitors
 *  scratch the green foil away to see them (scratch={false} to turn off).
 */
export function Split({
  image,
  alt,
  label,
  side = "right",
  alternate = false,
  hero = false,
  priority = false,
  id,
  labelledBy,
  className,
  scratch = true,
  lang = "vi",
  children,
}: {
  image: string;
  alt: string;
  label?: string;
  side?: "left" | "right";
  alternate?: boolean;
  hero?: boolean;
  priority?: boolean;
  id?: string;
  labelledBy?: string;
  className?: string;
  scratch?: boolean;
  lang?: MainLocale;
  children: ReactNode;
}) {
  const photo = (
    <Photo
      src={image}
      alt={alt}
      label={label}
      ratio="auto"
      rounded={false}
      priority={priority}
      sizes="(min-width: 834px) 62vw, 100vw"
      className="aspect-[4/3] min-[834px]:aspect-auto min-[834px]:h-full"
    />
  );
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-side={alternate ? undefined : side}
      className={cx(
        "split",
        hero && "split-hero",
        alternate && "split-alt",
        className,
      )}
    >
      <div className="split-media">
        <div className="split-media-inner">
          {scratch && imageExists(image) ? (
            <ScratchReveal id={image} lang={lang} className="h-full">
              {photo}
            </ScratchReveal>
          ) : (
            photo
          )}
        </div>
      </div>
      <Container className="split-content relative">
        <div className="split-body reveal-scroll py-10 min-[834px]:py-24">
          {children}
        </div>
      </Container>
    </section>
  );
}
