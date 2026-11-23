# Digital Identity

This repository holds a personal website and **IELTS Writing Lab** (*Learn to think, not just to write.*). Both are one Next.js 16
app with a shared design system, served on two hosts:

- `yourdomain` is the personal website (`src/app/(main)`).
- `ielts.yourdomain` is IELTS Writing Lab, in Vietnamese and English (`src/app/ielts`).

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000  and  http://localhost:3000/ielts
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | dev server (drafts visible) |
| `npm run build` | production build (static pages) |
| `npm run lint` | ESLint |
| `npm run typecheck` | route type generation + `tsc` |

## Structure

```
content/              MDX: IELTS pieces, journal notes, About story, templates
docs/                 ROUTING.md · CONTENT.md · DEPLOYMENT.md
src/proxy.ts          host-based routing (ielts.* → /ielts)
src/config/           site + domains, i18n, navigation, content taxonomy, profile placeholders
src/lib/content/      typed MDX loader (zod schema, related, prev/next, tags, translations)
src/lib/seo.ts        canonical / OG / hreflang builders
src/components/       ui/ · layout/ · article/ · mdx/
src/app/(main)/       personal site (root layout)
src/app/ielts/[lang]/ IELTS site (root layout, vi | en)
```

## Design system

The source of truth is [`docs/apple.DESIGN.md`](docs/apple.DESIGN.md) (the earlier `mercury.DESIGN.md` is kept for reference only).
It's implemented in `src/app/globals.css` as tokens plus a small set of classes:

- **Type roles:** `t-hero`, `t-display`, `t-headline`, `t-lede`, `t-title`, `t-eyebrow`, `t-body-sm`, `t-caption`
- **Buttons:** `btn-primary`, `btn-outline`, `btn-chip`
- **Links:** `link`, `link-more`
- **Surfaces:** `tile`, `tile-link`, `on-black`

| Token | Value | Use |
| --- | --- | --- |
| `canvas` / `surface` | `#FFFFFF` / `#F5F5F7` | page / colour-blocked bands, tiles, footer |
| `ink` / `body` | `#000000` / `#1D1D1F` | headings / body copy |
| `muted` / `faint` | `#6E6E73` / `#86868B` | secondary text / placeholders and meta |
| `hairline` | `#D2D2D7` | dividers |
| `primary` | `#0071E3` | primary pill buttons, focus ring |
| `link` / `accent` | `#0066CC` / `#2997FF` | links on white / links on black |
| `badge` | `#B64400` | decorative eyebrows (sparingly) |
| `nav` | `rgba(29,29,31,.8)` | translucent global navigation |

- **No shadows anywhere.** Depth comes from colour blocking (white → `#F5F5F7` → black tiles).
- **Shapes:** buttons are pills, feature tiles and photos have 28px corners, and structural blocks have square corners.
- **Width:** content is 980px wide.

**Fonts:** SF Pro can't be self-hosted, so the stack is SF Pro (the system font on Apple devices), then **Inter with optical sizing**
for everyone else. Both support Vietnamese. Geist Mono is used for code only.

**Navigation:**
- A dark global bar (the personal brand) appears on both sites.
- IELTS adds a light, sticky product bar underneath it, in the style of Apple's product pages.

**Photos:** `<Photo>` shows an image if the file exists under `/public`, and otherwise shows a labelled empty frame.
See `public/images/README.md` for every slot.

## Not in the MVP

The backend, database, authentication and AI feedback are planned for Phases 2–3. The content layer is a plain
typed module (`src/lib/content`), so it can later be backed by an API without changing pages.

See `docs/` for routing, content authoring and deployment.
