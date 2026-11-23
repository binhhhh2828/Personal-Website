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
content/              MDX: IELTS pieces, IELTS pages, templates
docs/                 ROUTING.md · CONTENT.md · DEPLOYMENT.md
src/proxy.ts          host-based routing (ielts.* → /ielts)
src/config/           site + domains, i18n, navigation, content taxonomy, profile placeholders
src/lib/content/      typed MDX loader (zod schema, related, prev/next, tags, translations)
src/lib/seo.ts        canonical / OG / hreflang builders
src/components/       ui/ · layout/ · article/ · mdx/
src/app/(main)/       personal site (root layout)
src/app/ielts/[lang]/ IELTS site (root layout, vi | en)
```

## Design tokens

These are defined in `src/app/globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#F7F7F5` | page background |
| `fg` | `#191919` | primary text |
| `subtle` | `#A5A5A0` | brand secondary: rules, numerals, decoration |
| `muted` | `#6B6B66` | secondary **text** (the darker step keeps it readable, WCAG AA) |
| `accent` | `#7896B5` | accent marks, underlines, focus ring |
| `accent-ink` | `#4A6A8C` | accent-coloured **text** and links (WCAG AA) |

The fonts are Manrope (UI and headings), Inter (long-form reading), Geist Mono (metadata) and Instrument Serif
(editorial display, English only, because the font has no Vietnamese glyphs; Vietnamese headings fall back to Manrope).

## Not in the MVP

The backend, database, authentication and AI feedback are planned for Phases 2–3. The content layer is a plain
typed module (`src/lib/content`), so it can later be backed by an API without changing pages.

See `docs/` for routing, content authoring and deployment.
