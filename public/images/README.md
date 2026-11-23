# Photos

Save photos at these exact paths, then rebuild. Until a file exists, the site shows an
empty frame labelled with its path. Paths are set in `src/config/profile.ts` and in the
`image` / `coverImage` fields of MDX files, so you can rename them there.

| Path | Where it appears | Suggested shape |
| --- | --- | --- |
| `portrait.jpg` | Home hero (scratch card) | landscape 4:3 |
| `home/about.jpg` | Home · About (scratch card) | landscape 4:3 |
| `about/childhood.jpg` | About · Childhood (scratch card) | landscape 4:3 |
| `about/education.jpg` | About · Education (scratch card) | landscape 4:3 |
| `about/passions.jpg` | About · Passions (scratch card) | landscape 4:3 |
| `about/language.jpg` | About · Language & English (scratch card) | landscape 4:3 |
| `about/leisure.jpg` | About · Leisure & entertainment (scratch card) | landscape 4:3 |
| `about/now.jpg` | About · Now & next (scratch card) | landscape 4:3 |
| `works/project-1.jpg`, `works/project-2.jpg`, `works/research-1.jpg` | Selected works, Projects, Research | landscape 4:3–16:10 |
| `beyond/1.jpg` … `beyond/3.jpg` | Home · Beyond work (draggable Polaroids, scratch card) | square 1:1 |
| `journal/<slug>.jpg` | Journal cover (optional) | landscape 16:9 |
| `ielts/hero.jpg` | IELTS home hero | landscape 16:9 |

JPG or WebP around 2000px on the long side is plenty; the site resizes them automatically.


Photos marked *scratch card* are covered by a green foil that visitors scratch away (mouse hover or finger drag). Turn it off per split with `scratch={false}` in `src/components/ui/split.tsx` callers.
