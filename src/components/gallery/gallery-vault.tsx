"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  openList,
  openPhoto,
  unlock,
  type Kdf,
  type Sealed,
  type VaultPhoto,
} from "@/lib/gallery-crypto";
import { confetti } from "@/lib/confetti";
import type { MainLocale } from "@/config/i18n";
import { getMainDict, type MainDict } from "@/config/main-i18n";

/** Album text may be one string or one per language. */
type Localized = string | Partial<Record<MainLocale, string>>;
const pick = (v: Localized, lang: MainLocale) =>
  typeof v === "string" ? v : (v[lang] ?? v.vi ?? v.en ?? "");

export type GalleryManifest = {
  version: 1;
  kdf: Kdf | null;
  check: Sealed | null;
  albums: {
    slug: string;
    title: Localized;
    note: Localized;
    total: number;
    previews: { src: string; w: number; h: number }[];
    vault: Sealed;
  }[];
};

/** One photo on screen: a small image now, and (when unlocked) a way to get the full one. */
type Shot = {
  key: string;
  src: string;
  w: number;
  h: number;
  photo?: VaultPhoto;
};

const LockIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect
      x="4.5"
      y="10.5"
      width="15"
      height="10"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Private gallery, laid out like a photo album on a dark page: each album opens with a
 * large cover, then a masonry wall that keeps every photo's real proportions.
 * Previews are public; everything else is AES-encrypted on the server and decrypted here,
 * in memory, once the right password is entered (see scripts/gallery.mjs).
 */
export function GalleryVault({
  manifest,
  lang = "vi",
}: {
  manifest: GalleryManifest;
  lang?: MainLocale;
}) {
  const t = getMainDict(lang).gallery;
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "wrong">("idle");
  const [cooldown, setCooldown] = useState(0);
  const failures = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manifest.kdf || !manifest.check || cooldown > 0) return;
    const password = inputRef.current?.value ?? "";
    if (!password) return;
    setStatus("working");
    const k = await unlock(password, manifest.kdf, manifest.check);
    if (inputRef.current) inputRef.current.value = "";
    if (k) {
      failures.current = 0;
      setKey(k);
      setStatus("idle");
      confetti({ count: 70, origin: { x: 0.5, y: 0.3 } });
    } else {
      failures.current += 1;
      setCooldown(Math.min(30, 2 ** (failures.current - 1)));
      setStatus("wrong");
    }
  };

  const focusPassword = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    inputRef.current?.focus({ preventScroll: true });
  };

  const hasVault = Boolean(manifest.kdf && manifest.albums.length);

  return (
    <div>
      {hasVault && (
        <div className="vault-panel">
          {key ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 font-semibold">
                <span className="text-lime-glow">✓</span> {t.unlocked}
              </p>
              <button
                type="button"
                className="btn btn-chip"
                onClick={() => setKey(null)}
              >
                <LockIcon size={16} /> {t.lockAgain}
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label
                htmlFor="vault-password"
                className="flex items-center gap-2 font-semibold sm:shrink-0"
              >
                <LockIcon /> {t.locked}
              </label>
              <input
                ref={inputRef}
                id="vault-password"
                type="password"
                autoComplete="off"
                placeholder={t.password}
                aria-invalid={status === "wrong" || undefined}
                aria-describedby="vault-status"
                className="vault-input"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "working" || cooldown > 0}
              >
                {status === "working"
                  ? t.unlocking
                  : cooldown > 0
                    ? t.wait(cooldown)
                    : t.unlock}
              </button>
              <p
                id="vault-status"
                role="status"
                className="t-body-sm text-on-black-muted sm:ml-2"
              >
                {status === "wrong" ? t.wrong : null}
              </p>
            </form>
          )}
        </div>
      )}

      {manifest.albums.length === 0 ? (
        <p className="vault-panel text-center text-on-black-muted">{t.empty}</p>
      ) : (
        <div className="mt-20 space-y-28 md:mt-28 md:space-y-40">
          {manifest.albums.map((album, i) => (
            <Album
              key={album.slug}
              index={i}
              album={album}
              cryptoKey={key}
              lang={lang}
              t={t}
              onLockedClick={focusPassword}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Album({
  index,
  album,
  cryptoKey,
  lang,
  t,
  onLockedClick,
}: {
  index: number;
  album: GalleryManifest["albums"][number];
  cryptoKey: CryptoKey | null;
  lang: MainLocale;
  t: MainDict["gallery"];
  onLockedClick: () => void;
}) {
  const title = pick(album.title, lang);
  const note = pick(album.note, lang);
  const [unlocked, setUnlocked] = useState<Shot[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const lockedCount = album.total - album.previews.length;

  // Decrypt the album's photo list and thumbnails once unlocked; revoke the blobs when locking again.
  useEffect(() => {
    if (!cryptoKey) return;
    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      const list = await openList(cryptoKey, album.vault);
      const out: Shot[] = [];
      for (const photo of list) {
        const src = await openPhoto(cryptoKey, photo, "thumb");
        urls.push(src);
        out.push({ key: photo.id, src, w: photo.w, h: photo.h, photo });
        if (cancelled) return;
        setUnlocked([...out]);
      }
    })().catch(() => {});
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
      setUnlocked([]);
      setOpen(null);
    };
  }, [cryptoKey, album.vault]);

  const shots: Shot[] = cryptoKey
    ? unlocked
    : album.previews.map((p) => ({ key: p.src, src: p.src, w: p.w, h: p.h }));
  const [cover, ...rest] = shots;
  const loading = Boolean(cryptoKey) && unlocked.length < album.total;

  return (
    <section
      id={album.slug}
      aria-labelledby={`${album.slug}-title`}
      className="album"
    >
      {/* Album opening: cover photo + title, like the first page of a printed album */}
      <div className="album-head">
        <div className="album-text">
          <p className="album-number" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h2 id={`${album.slug}-title`} className="t-display">
            {title}
          </h2>
          {note && (
            <p className="mt-5 max-w-[42ch] text-[19px] leading-[1.5] text-on-black-muted">
              {note}
            </p>
          )}
          <p className="t-body-sm mt-6 text-on-black-muted">
            {t.count(album.total)}
            {!cryptoKey && lockedCount > 0 && (
              <span className="text-lime-glow">
                {" "}
                · {t.lockedCount(lockedCount)}
              </span>
            )}
          </p>
        </div>
        {cover && (
          <button
            type="button"
            className="album-cover"
            onClick={() => setOpen(0)}
            aria-label={t.openPhoto(1)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized preview or decrypted blob */}
            <img
              src={cover.src}
              alt={cryptoKey ? "" : `${title} — ${t.preview(1)}`}
              width={cover.w}
              height={cover.h}
            />
          </button>
        )}
      </div>

      {/* The wall: real proportions, no cropping */}
      <ul
        className="masonry mt-10 md:mt-14"
        data-few={
          rest.length +
            (loading ? 1 : 0) +
            (!cryptoKey && lockedCount > 0 ? 1 : 0) <=
            3 || undefined
        }
      >
        {rest.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              className="masonry-item"
              onClick={() => setOpen(i + 1)}
              aria-label={t.openPhoto(i + 2)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized preview or decrypted blob */}
              <img
                src={s.src}
                alt={cryptoKey ? "" : `${title} — ${t.preview(i + 2)}`}
                width={s.w}
                height={s.h}
                loading="lazy"
              />
            </button>
          </li>
        ))}
        {loading && (
          <li aria-hidden>
            <div className="masonry-item masonry-loading" />
          </li>
        )}
        {!cryptoKey && lockedCount > 0 && (
          <li>
            <button
              type="button"
              className="locked-stack"
              onClick={onLockedClick}
            >
              {/* Blurred copies of the public previews only — nothing locked is shown. */}
              {album.previews.slice(0, 3).map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- decorative blur of a public preview
                <img
                  key={p.src}
                  src={p.src}
                  alt=""
                  aria-hidden
                  className="locked-layer"
                  style={{ "--i": i } as CSSProperties}
                />
              ))}
              <span className="locked-label">
                <LockIcon size={26} />
                <span className="font-serif text-[40px] leading-none font-semibold">
                  +{lockedCount}
                </span>
                <span className="t-body-sm">{t.enterPassword}</span>
              </span>
            </button>
          </li>
        )}
      </ul>

      {open !== null && shots[open] && (
        <Lightbox
          cryptoKey={cryptoKey}
          items={shots}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          title={title}
          t={t}
        />
      )}
    </section>
  );
}

function Lightbox({
  cryptoKey,
  items,
  index,
  onIndex,
  onClose,
  title,
  t,
}: {
  cryptoKey: CryptoKey | null;
  items: Shot[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  title: string;
  t: MainDict["gallery"];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);
  const [full, setFull] = useState<{ key: string; url: string } | null>(null);
  const item = items[index];

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  // Unlocked photos load their full-size version; public previews have none.
  useEffect(() => {
    if (!cryptoKey || !item.photo) return;
    let url: string | null = null;
    let cancelled = false;
    openPhoto(cryptoKey, item.photo, "full")
      .then((u) => {
        url = u;
        if (!cancelled) setFull({ key: item.key, url: u });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [cryptoKey, item]);

  const go = useCallback(
    (d: number) => onIndex((index + d + items.length) % items.length),
    [index, items.length, onIndex],
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={`${title} — ${t.photoOf(index + 1, items.length)}`}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <p className="lightbox-title">{title}</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- decrypted blob URL or preview */}
      <img
        src={full?.key === item.key ? full.url : item.src}
        alt=""
        width={item.w}
        height={item.h}
        className="lightbox-img"
        draggable={false}
      />
      <div className="lightbox-bar">
        <button type="button" onClick={() => go(-1)} aria-label={t.previous}>
          ‹
        </button>
        <span>
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={() => go(1)} aria-label={t.nextPhoto}>
          ›
        </button>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={t.close}
        >
          ✕
        </button>
      </div>
    </dialog>
  );
}
