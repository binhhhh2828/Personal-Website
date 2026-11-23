# Private gallery

`/gallery` shows a few **public previews** from each album. Everything else is **encrypted**: visitors need the password to see the full albums.

## Add photos

1. Put your originals in one folder per album:

   ```
   private/gallery/
     childhood/   01.jpg 02.jpg …
     school/      …
     gaming/      …
   ```

   `private/` is git-ignored, so your originals never leave your computer.

   The folder name becomes the album's address, for example `/gallery#childhood`. Chapters on `/about` link to the album named in their `album="…"` attribute.

2. Optionally, add `album.json` to an album folder:

   ```json
   { "title": "Childhood", "note": "Uông Bí, a long time ago.", "preview": 3, "order": 1 }
   ```

   | Field | Meaning | Default |
   | --- | --- | --- |
   | `preview` | How many photos are public. The first N files by name are used, so name the ones you want public `01`, `02`, … | 3 |
   | `order` | Album order on the page. | — |

3. Run the build script and type the password. It asks twice and hides what you type.

   ```
   npm run gallery
   ```

4. Commit `public/gallery/` and `src/generated/gallery.json`, then deploy.

Re-run the script whenever you add or remove photos. Each run creates new files and a new salt.

## How it is protected

- **Encryption.** Every photo is AES-256-GCM encrypted. The key comes from your password using PBKDF2-SHA256 with 600,000 iterations.
- **No password stored anywhere.** It is not on the server or in the repository. The browser decrypts photos in memory, and closing the tab locks them again.
- **Hidden file list.** The list of photos, including file names and sizes, is also encrypted. Without the password, nobody can even tell which file belongs to which photo.
- **No metadata.** EXIF data (GPS location, camera, dates) is removed from every published image.
- **Previews are small.** Public previews are 640px images, and only the first `preview` photos of each album get one.

## Limits

- **Use a strong password.** The only way in is guessing it offline. Use 4 or more random words, or 14 or more characters.
- **Anyone with the password can save the photos.** You cannot stop that with any website. Only share the password with people you trust.
- **Old photos stay readable with the old password.** Changing the password means re-running the script and deploying. Files committed earlier stay in git history and can still be opened with the old password. To retire a photo for good, remove it and rewrite the history, or keep that repository private.
