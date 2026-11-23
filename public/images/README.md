# Photos

Save photos at these exact paths, then rebuild. Until a file exists, the site shows an
empty frame labelled with its path. Paths are set in `src/config/profile.ts` and in the
`image` / `coverImage` fields of MDX files, so you can rename them there.

| Path | Where it appears | Suggested shape |
| --- | --- | --- |
| `portrait.jpg` | Home hero, About page | landscape 16:9 |
| `about/childhood.jpg` | About · Childhood | portrait 4:5 |
| `about/education.jpg` | About · Education | portrait 4:5 |
| `about/passions.jpg` | About · Passions | portrait 4:5 |
| `about/language.jpg` | About · Language & English | portrait 4:5 |
| `about/leisure.jpg` | About · Leisure & entertainment | portrait 4:5 |
| `about/now.jpg` | About · Now & next | portrait 4:5 |
| `works/project-1.jpg`, `works/project-2.jpg`, `works/research-1.jpg` | Selected works, Projects, Research | landscape 4:3–16:10 |
| `beyond/1.jpg` … `beyond/3.jpg` | Home · Beyond work | portrait 4:5 |
| `journal/<slug>.jpg` | Journal cover (optional) | landscape 16:9 |
| `ielts/hero.jpg` | IELTS home hero | landscape 16:9 |

JPG or WebP around 2000px on the long side is plenty; the site resizes them automatically.
