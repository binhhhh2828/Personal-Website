"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { openList, openPhoto, unlock, type Kdf, type Sealed, type VaultPhoto } from "@/lib/gallery-crypto";
import { confetti } from "@/lib/confetti";
import type { MainLocale } from "@/config/i18n";
import { getMainDict, type MainDict } from "@/config/main-i18n";

/** Album text may be one string or one per language. */
type Localized = string | Partial<Record<MainLocale, string>>;
const pick = (v: Localized, lang: MainLocale) => (typeof v === "string" ? v : (v[lang] ?? v.vi ?? v.en ?? ""));

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

const LockIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * Private gallery. Previews are public; everything else is AES-encrypted on the server and
 * decrypted here, in memory, once the right password is entered (see scripts/gallery.mjs).
 */
export function GalleryVault({ manifest, lang = "vi" }: { manifest: GalleryManifest; lang?: MainLocale }) {
  const t = getMainDict(lang).gallery;
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "wrong">("idle");
  const [cooldown, setCooldown] = useState(0);
  const failures = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
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

  const hasVault = Boolean(manifest.kdf && manifest.albums.length);

  return (
    <div>
      {hasVault && (
        <div className="vault-bar">
          {key ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <span className="text-primary">✓</span> {t.unlocked}
              </p>
              <button type="button" className="btn btn-chip" onClick={() => setKey(null)}>
                <LockIcon size={16} /> {t.lockAgain}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="vault-password" className="flex items-center gap-2 font-semibold text-ink sm:shrink-0">
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
              <button type="submit" className="btn btn-primary" disabled={status === "working" || cooldown > 0}>
                {status === "working" ? t.unlocking : cooldown > 0 ? t.wait(cooldown) : t.unlock}
              </button>
              <p id="vault-status" role="status" className="t-body-sm text-muted sm:ml-2">
                {status === "wrong" ? t.wrong : null}
              </p>
            </form>
          )}
        </div>
      )}

      {manifest.albums.length === 0 ? (
        <p className="tile px-7 py-14 text-center text-muted">{t.empty}</p>
      ) : (
        <div className="mt-12 space-y-20">
          {manifest.albums.map((album) => (
            <Album key={album.slug} album={album} cryptoKey={key} lang={lang} t={t} onLockedClick={() => inputRef.current?.focus()} />
          ))}
        </div>
      )}
    </div>
  );
}

function Album({
  album,
  cryptoKey,
  lang,
  t,
  onLockedClick,
}: {
  album: GalleryManifest["albums"][number];
  cryptoKey: CryptoKey | null;
  lang: MainLocale;
  t: MainDict["gallery"];
  onLockedClick: () => void;
}) {
  const title = pick(album.title, lang);
  const note = pick(album.note, lang);
  const [photos, setPhotos] = useState<{ photo: VaultPhoto; thumb: string }[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const locked = album.total - album.previews.length;

  // Decrypt the album's photo list and thumbnails once unlocked; revoke the blobs when locking again.
  useEffect(() => {
    if (!cryptoKey) return;
    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      const list = await openList(cryptoKey, album.vault);
      const out: { photo: VaultPhoto; thumb: string }[] = [];
      for (const photo of list) {
        const thumb = await openPhoto(cryptoKey, photo, "thumb");
        urls.push(thumb);
        out.push({ photo, thumb });
        if (cancelled) return;
        setPhotos([...out]);
      }
    })().catch(() => {});
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
      setPhotos([]);
      setOpen(null);
    };
  }, [cryptoKey, album.vault]);

  return (
    <section id={album.slug} aria-labelledby={`${album.slug}-title`} className="reveal-scroll">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div>
          <h2 id={`${album.slug}-title`} className="t-headline">
            {title}
          </h2>
          {note && <p className="mt-2 max-w-[60ch] text-muted">{note}</p>}
        </div>
        <p className="t-body-sm text-muted">
          {t.count(album.total)}
          {!cryptoKey && locked > 0 && ` · ${t.lockedCount(locked)}`}
        </p>
      </div>

      <ul className="gallery-grid mt-8">
        {cryptoKey
          ? photos.map(({ photo, thumb }, i) => (
              <li key={photo.id}>
                <button type="button" className="gallery-item" onClick={() => setOpen(i)} aria-label={t.openPhoto(i + 1)}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- decrypted blob URL, not optimisable */}
                  <img src={thumb} alt="" width={photo.w} height={photo.h} />
                </button>
              </li>
            ))
          : album.previews.map((p, i) => (
              <li key={p.src}>
                <div className="gallery-item">
                  {/* eslint-disable-next-line @next/next/no-img-element -- already resized at build time */}
                  <img src={p.src} alt={`${title} — ${t.preview(i + 1)}`} width={p.w} height={p.h} loading="lazy" />
                </div>
              </li>
            ))}
        {!cryptoKey && locked > 0 && (
          <li>
            <button type="button" className="gallery-item gallery-locked" onClick={onLockedClick}>
              <LockIcon size={26} />
              <span className="t-title">+{locked}</span>
              <span className="t-body-sm">{t.enterPassword}</span>
            </button>
          </li>
        )}
        {cryptoKey && photos.length < album.total && (
          <li aria-hidden className="gallery-item gallery-loading" />
        )}
      </ul>

      {cryptoKey && open !== null && photos[open] && (
        <Lightbox
          cryptoKey={cryptoKey}
          items={photos}
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
  t: MainDict["gallery"];
  cryptoKey: CryptoKey;
  items: { photo: VaultPhoto; thumb: string }[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  title: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [full, setFull] = useState<{ id: string; url: string } | null>(null);
  const item = items[index];

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    openPhoto(cryptoKey, item.photo, "full")
      .then((u) => {
        url = u;
        if (!cancelled) setFull({ id: item.photo.id, url: u });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [cryptoKey, item.photo]);

  const go = useCallback((d: number) => onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);

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
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decrypted blob URL */}
      <img
        src={full?.id === item.photo.id ? full.url : item.thumb}
        alt=""
        width={item.photo.w}
        height={item.photo.h}
        className="lightbox-img"
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
        <button type="button" onClick={() => ref.current?.close()} aria-label={t.close}>
          ✕
        </button>
      </div>
    </dialog>
  );
}
