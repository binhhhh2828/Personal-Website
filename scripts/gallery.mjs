#!/usr/bin/env node
/**
 * Private gallery builder — encrypts your photos so only people with the password can see them.
 *
 *   npm run gallery
 *
 * Input  (never committed, see .gitignore):
 *   private/gallery/<album>/*.jpg|jpeg|png|webp      your original photos
 *   private/gallery/<album>/album.json  (optional)   { "title": "...", "note": "...", "preview": 3, "order": 1 }
 *                                                     or "previews": ["file.jpg", …] to choose the public photos
 *
 * Output (safe to commit and publish):
 *   public/gallery/previews/<album>/*.webp   the first `preview` photos of each album, small (640px), open to everyone
 *   public/gallery/vault/*.bin               EVERY photo (thumbnail 720px + full 2400px), AES-256-GCM encrypted
 *   src/generated/gallery.json               public manifest: album titles, previews, KDF salt, encrypted photo lists
 *
 * Security model
 *   - Key = PBKDF2-SHA256(password, random salt, 600 000 iterations) → AES-256-GCM. The password is never stored.
 *   - Full photos exist on the server only as ciphertext; the browser decrypts them after the password is entered.
 *     There is no "hidden" URL or CSS trick to bypass — without the password the bytes are noise.
 *   - EXIF metadata (GPS, camera, dates) is stripped from every output image.
 *   - The only attack is guessing the password offline, so use a long one (4+ random words or 14+ characters).
 *
 * Password: set GALLERY_PASSWORD, or the script asks for it (input hidden, asked twice).
 */
import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "private", "gallery");
const OUT_PUBLIC = path.join(ROOT, "public", "gallery");
const OUT_MANIFEST = path.join(ROOT, "src", "generated", "gallery.json");
const ITERATIONS = 600_000;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const CHECK_TEXT = "lai-binh-gallery:ok";

function askHidden(question) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;
    if (!stdin.isTTY) return reject(new Error("No terminal to ask for the password. Set GALLERY_PASSWORD instead."));
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (ch) => {
      if (ch === "\r" || ch === "\n" || ch === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onData);
        stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") {
        process.exit(130);
      } else if (ch === "\u007f" || ch === "\b") {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    };
    stdin.on("data", onData);
  });
}

async function getPassword() {
  if (process.env.GALLERY_PASSWORD) return process.env.GALLERY_PASSWORD;
  const a = await askHidden("Gallery password: ");
  const b = await askHidden("Repeat password: ");
  if (a !== b) throw new Error("Passwords do not match.");
  return a;
}

/** AES-256-GCM. Output layout matches WebCrypto: ciphertext followed by the 16-byte tag. */
function encrypt(key, data) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(data), cipher.final(), cipher.getAuthTag()]);
  return { iv, body };
}
const b64 = (buf) => Buffer.from(buf).toString("base64");

async function main() {
  if (!existsSync(SRC)) {
    mkdirSync(SRC, { recursive: true });
    console.log(`Created ${path.relative(ROOT, SRC)} — put one folder per album in it, then run again.`);
    return;
  }
  const albumDirs = readdirSync(SRC).filter((d) => statSync(path.join(SRC, d)).isDirectory());
  if (albumDirs.length === 0) {
    console.log(`No albums in ${path.relative(ROOT, SRC)}. Add folders of photos, then run again.`);
    return;
  }

  const password = await getPassword();
  if (password.length < 10) throw new Error("Password too short — use at least 10 characters (14+ recommended).");
  if (password.length < 14) console.warn("! Password is short. Longer is much harder to guess offline (14+ recommended).");

  const salt = randomBytes(16);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
  const check = encrypt(key, Buffer.from(CHECK_TEXT));

  rmSync(OUT_PUBLIC, { recursive: true, force: true });
  mkdirSync(path.join(OUT_PUBLIC, "vault"), { recursive: true });

  const albums = [];
  for (const dir of albumDirs) {
    const albumPath = path.join(SRC, dir);
    const slug = dir.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    const metaFile = path.join(albumPath, "album.json");
    const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, "utf8")) : {};
    let files = readdirSync(albumPath)
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (files.length === 0) continue;

    // "previews": ["a.jpg", …] picks the public photos explicitly (shown first); otherwise the first `preview` files.
    const picked = Array.isArray(meta.previews) ? meta.previews.filter((f) => files.includes(f)) : null;
    if (picked) files = [...picked, ...files.filter((f) => !picked.includes(f))];
    const previewCount = picked ? picked.length : Math.max(0, Math.min(files.length, meta.preview ?? 3));
    const previewDir = path.join(OUT_PUBLIC, "previews", slug);
    mkdirSync(previewDir, { recursive: true });

    const previews = [];
    const photos = [];
    for (const [i, file] of files.entries()) {
      // .rotate() applies EXIF orientation; sharp drops all metadata (GPS etc.) on output by default.
      const input = sharp(path.join(albumPath, file)).rotate();

      const full = await input.clone().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
      const thumb = await input.clone().resize({ width: 720, height: 720, fit: "inside", withoutEnlargement: true }).webp({ quality: 74 }).toBuffer();

      const id = randomBytes(10).toString("hex");
      const fullEnc = encrypt(key, full.data);
      const thumbEnc = encrypt(key, thumb);
      writeFileSync(path.join(OUT_PUBLIC, "vault", `${id}-f.bin`), fullEnc.body);
      writeFileSync(path.join(OUT_PUBLIC, "vault", `${id}-t.bin`), thumbEnc.body);
      photos.push({ id, w: full.info.width, h: full.info.height, fiv: b64(fullEnc.iv), tiv: b64(thumbEnc.iv) });

      if (i < previewCount) {
        const p = await input.clone().resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true }).webp({ quality: 60 }).toBuffer({ resolveWithObject: true });
        const name = `${randomBytes(6).toString("hex")}.webp`;
        writeFileSync(path.join(previewDir, name), p.data);
        previews.push({ src: `/gallery/previews/${slug}/${name}`, w: p.info.width, h: p.info.height });
      }
    }

    // The photo list (ids, sizes, IVs) is itself encrypted: without the password nobody can even fetch the files by name.
    const list = encrypt(key, Buffer.from(JSON.stringify(photos)));
    albums.push({
      slug,
      title: meta.title ?? dir, // string, or { "vi": "…", "en": "…" }
      note: meta.note ?? "",
      order: meta.order ?? 999,
      total: files.length,
      previews,
      vault: { iv: b64(list.iv), data: b64(list.body) },
    });
    console.log(`✓ ${slug}: ${files.length} photos (${previews.length} public previews)`);
  }

  albums.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  for (const a of albums) delete a.order;
  const manifest = {
    version: 1,
    kdf: { name: "PBKDF2", hash: "SHA-256", iterations: ITERATIONS, salt: b64(salt) },
    check: { iv: b64(check.iv), data: b64(check.body) },
    albums,
  };
  mkdirSync(path.dirname(OUT_MANIFEST), { recursive: true });
  writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote ${path.relative(ROOT, OUT_MANIFEST)} and public/gallery/. Commit those, then deploy.`);
  console.log("Originals in private/ stay on your computer (git-ignored).");
}

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
