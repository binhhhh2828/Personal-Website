# Routing architecture

One Next.js app and one deployment serve two sites:

| Site | Public URL | Code |
| --- | --- | --- |
| Personal website | `https://<domain>` | `src/app/(main)/` |
| IELTS Writing Lab | `https://ielts.<domain>` | `src/app/ielts/` |

Each site has its **own root layout**: `(main)/layout.tsx` and `ielts/[lang]/layout.tsx`. That means
`<html lang>` is correct per language and the two sites can't leak each other's chrome. URLs that
match no route at all use `src/app/global-not-found.tsx`.

## Two modes

The mode is set by `NEXT_PUBLIC_IELTS_URL` **when the site is built**:

| | Path mode (env empty) | Subdomain mode (env set) |
| --- | --- | --- |
| IELTS URL | `<main>/ielts/vi/...` | `ielts.<domain>/vi/...` |
| Internal IELTS links | `/ielts/vi/...` | `/vi/...` |
| `<main>/ielts/*` | served | **308 →** the subdomain |
| Canonical | `<main>/ielts/...` | `ielts.<domain>/...` |
| Use for | local dev, Vercel previews | production |

Every link is built from `src/config/site.ts`, via `ieltsHref`, `ieltsAbsolute`, `ieltsHrefFromMain` and `mainHrefFromIelts`.
Never hard-code a host or the `/ielts` prefix in a component.

## The proxy (`src/proxy.ts`)

Next.js 16 renamed `middleware` to `proxy`. The proxy works like this:

1. **Host `ielts.*`**:
   - `/` returns 307 to `/vi` or `/en`, chosen from `Accept-Language` (default `vi`).
   - `/ielts/...` returns 308 to `/...`, so there is never a duplicate URL.
   - Anything else is **rewritten** to `/ielts/...`. The browser URL stays the same, and the pages are still pre-built static HTML.
2. **Any other host**, for `/ielts/...`:
   - In subdomain mode, it returns 308 to `NEXT_PUBLIC_IELTS_URL`.
   - In path mode, `/ielts` returns 307 to `/ielts/vi`, and everything else is served as-is.

`robots.txt` and `sitemap.xml` are rewritten too. That means `ielts.<domain>/robots.txt` serves
`src/app/ielts/robots.txt/route.ts`, and `ielts.<domain>/sitemap.xml` serves `src/app/ielts/sitemap.ts`.

## IELTS URL scheme

```
/{lang}                                  home
/{lang}/about                            about (content/pages/ielts/{lang}/about.mdx)
/{lang}/{section}                        section index + optional intro MDX
/{lang}/{section}/category/{category}    category filter
/{lang}/{section}/{slug}                 article
/{lang}/tags  ·  /{lang}/tags/{tag}      tags
```

The sections are `journey`, `writing-lab`, `language-thinking` and `knowledge`. An article's section comes from its
`category` (see `src/config/content.ts`).

## Language switching

`LanguageSwitcher` swaps `/vi` ↔ `/en`. For articles, it uses a map built on the server
(`getLanguageSwitchMap`):

- If the article has a translation (the same `translationKey` in both files), the switcher goes there.
- If not, it goes to that section's index in the other language.
- `hreflang` alternates are added only when a real translation exists.

## Testing locally

```bash
npm run dev                                  # path mode
open http://localhost:3000                   # personal site
open http://localhost:3000/ielts             # IELTS fallback route
```

To test subdomain mode, create `.env.local` with these lines and restart:

```
NEXT_PUBLIC_MAIN_URL=http://localhost:3000
NEXT_PUBLIC_IELTS_URL=http://ielts.localhost:3000
```

Then open `http://ielts.localhost:3000`. Chrome and Edge resolve `*.localhost` to 127.0.0.1 with no extra setup.
For Firefox or Safari, add `127.0.0.1 ielts.localhost` to your hosts file.

## Personal site languages

The personal site has a Vietnamese version (the default) and an English version. Each page has one URL per language:

| Language | URL | Served from |
| --- | --- | --- |
| Vietnamese | `/about` | `app/(main)/[lang]/…` with `lang=vi`. `proxy.ts` rewrites the request internally. |
| English | `/en/about` | `app/(main)/[lang]/…` with `lang=en` |

- **Redirects:** `/vi/…` redirects (308) to the root URL, so every page has exactly one Vietnamese URL. When a visitor picks English with the VI | EN switch, it saves a `lang` cookie. After that, `/` sends them to `/en` (307).
- **Building links:** use `mainPath(lang, "/about")` from `src/config/site.ts`.
- **Where the text lives:**
  - UI strings: `src/config/main-i18n.ts`
  - Profile text: `src/config/profile.ts` (`text.vi` / `text.en`)
  - Life story: `content/pages/main/{vi,en}/about.mdx`
- **Journal notes:** each note is published only in the language set by its `language` front-matter, at `/journal/slug` for Vietnamese or `/en/journal/slug` for English.
- **SEO:** every page lists `hreflang` alternates for `vi`, `en` and `x-default` (vi). The sitemap lists both versions of each page.
