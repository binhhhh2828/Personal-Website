/**
 * Browser-side decryption for the private gallery (counterpart of scripts/gallery.mjs).
 * PBKDF2-SHA256 → AES-256-GCM via WebCrypto. The derived key is non-extractable and lives
 * only in memory: it is never written to storage, so closing the tab locks the gallery again.
 */

export type Kdf = { name: "PBKDF2"; hash: "SHA-256"; iterations: number; salt: string };
export type Sealed = { iv: string; data: string };
export type VaultPhoto = { id: string; w: number; h: number; fiv: string; tiv: string };

const CHECK_TEXT = "lai-binh-gallery:ok";

function fromB64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function decrypt(key: CryptoKey, iv: string, data: BufferSource): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(iv) }, key, data);
}

/** Derives the key and proves it is right. Returns null for a wrong password. */
export async function unlock(password: string, kdf: Kdf, check: Sealed): Promise<CryptoKey | null> {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: kdf.hash, iterations: kdf.iterations, salt: fromB64(kdf.salt) },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  try {
    const text = new TextDecoder().decode(await decrypt(key, check.iv, fromB64(check.data)));
    return text === CHECK_TEXT ? key : null;
  } catch {
    return null; // GCM authentication failed → wrong password
  }
}

export async function openList(key: CryptoKey, sealed: Sealed): Promise<VaultPhoto[]> {
  const json = new TextDecoder().decode(await decrypt(key, sealed.iv, fromB64(sealed.data)));
  return JSON.parse(json) as VaultPhoto[];
}

/** Fetches an encrypted photo and returns an object URL for the decrypted WebP. */
export async function openPhoto(key: CryptoKey, photo: VaultPhoto, size: "thumb" | "full"): Promise<string> {
  const res = await fetch(`/gallery/vault/${photo.id}-${size === "full" ? "f" : "t"}.bin`);
  if (!res.ok) throw new Error(`Photo ${photo.id} is missing`);
  const plain = await decrypt(key, size === "full" ? photo.fiv : photo.tiv, await res.arrayBuffer());
  return URL.createObjectURL(new Blob([plain], { type: "image/webp" }));
}
