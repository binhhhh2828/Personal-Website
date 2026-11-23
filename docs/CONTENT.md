# Content architecture

All IELTS content is MDX in the repository. No CMS or database is needed.

```
content/
  ielts/
    vi/<any folders>/*.mdx      Vietnamese pieces
    en/<any folders>/*.mdx      English pieces
    _templates/                 copy-paste starters (never published)
  pages/
    ielts/{vi,en}/about.mdx     IELTS About page
    ielts/{vi,en}/journey.mdx   intro shown above the Journey list (optional)
```

Sub-folders exist only to keep things organised. Files whose names start with `_` are ignored.
A piece's URL comes from its front-matter: `/{language}/{section of category}/{slug}`.

The personal site's placeholder data is in `src/config/profile.ts`.

## Front-matter

Every field is checked against a schema (`src/lib/content/schema.ts`) when the site builds.
**An invalid file fails the build** and the error names the file and the field.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | ✓ | |
| `slug` | ✓ | lowercase-kebab; must be unique per language + section; `category` is reserved |
| `description` | ✓ | used for listings, meta description and OG |
| `type` | ✓ | `article` · `lesson` · `breakdown` · `log` · `language-note` · `resource` |
| `category` | ✓ | id from `src/config/content.ts`, which sets the section |
| `language` | ✓ | `vi` or `en`; must match the folder |
| `publishedAt` | ✓ | `YYYY-MM-DD` |
| `tags` | | lowercase-kebab list |
| `updatedAt` | | `YYYY-MM-DD` |
| `coverImage` | | path under `/public` or a full URL |
| `translationKey` | | same value in each language version, which links them |
| `featured` | | pins the piece to "Featured lessons" on the IELTS home page |
| `draft` | | `true` means it shows in dev only (or when `SHOW_DRAFTS=true`) |
| `task` | lesson, breakdown | `1` or `2` |
| `prompt` | breakdown | the essay question, shown above the body |
| `url` | resource | external link |

Translations are optional. A piece can exist in only one language.

## Components available in MDX

```mdx
<Callout title="Why it matters">Body…</Callout>

<EssayPrompt task={2}>Question text…</EssayPrompt>

<Compare before="Weaker sentence" after="Stronger sentence" note="Why" beforeLabel="Trước" afterLabel="Sau" />

<Placeholder>Content still to be written</Placeholder>
```

These also work: GitHub-flavoured Markdown tables, `##`/`###` headings (which build the "On this page" table of contents), and links.
Links starting with `/` stay inside the site. Other links open in a new tab.

## Adding a category or section

Edit `src/config/content.ts`. Navigation, filters, static pages and the sitemap all update from there.

## What the site computes for you

- Reading time: about 220 words per minute.
- Related pieces: scored by shared tags, then the same category, then the same section.
- Previous/next: in date order within the same section and language.
