/**
 * Personal website data — the short, structured facts about you.
 * Your longer life story (childhood, education, passions…) lives in
 * content/pages/main/about.mdx, written in prose.
 *
 * EVERYTHING HERE IS A PLACEHOLDER. Nothing has been invented about you:
 * each value is marked "[Placeholder]" or "[...]" until you replace it.
 *
 * Photos: every `image` is the path where the photo WILL live under /public.
 * Until the file exists, the site shows an empty frame labelled with that path.
 * To add one, save your photo at that path (e.g. public/images/portrait.jpg) and rebuild.
 */

export type Work = {
  kind: "project" | "research";
  title: string;
  year: string;
  summary: string;
  role?: string;
  /** Venue, course or lab — mostly for research. */
  venue?: string;
  href?: string;
  tags: string[];
  image: string;
  /** Show on the home page. */
  featured?: boolean;
};

export type Exploration = { title: string; note: string };
export type BeyondWorkItem = { title: string; note: string; image: string };

export const profile = {
  name: "[Your Name]",
  /** One short line under your name, e.g. "Student · Builder · Learner". */
  role: "[Placeholder] Student · Builder · Learner",
  location: "[City, Country]",
  /** The big statement in the hero. */
  headline: "[Placeholder] A sentence about what you build and why.",
  intro: "[Placeholder] Two sentences introducing yourself — what you study, what you are building, and the questions you keep returning to.",
  portrait: "/images/portrait.jpg",

  /** Home page "About" teaser. The full story is content/pages/main/about.mdx. */
  aboutTeaser: [
    "[Placeholder] Where you grew up and what shaped you early on.",
    "[Placeholder] What you are studying or working on now, and what drives you.",
  ],

  works: [
    {
      kind: "project",
      title: "[Placeholder] Project title",
      year: "[Year]",
      summary: "[Placeholder] The problem, your approach, and the outcome — in one or two sentences.",
      role: "[Role]",
      tags: ["[tag]"],
      image: "/images/works/project-1.jpg",
      featured: true,
    },
    {
      kind: "project",
      title: "[Placeholder] Second project",
      year: "[Year]",
      summary: "[Placeholder] One or two sentences.",
      role: "[Role]",
      tags: ["[tag]"],
      image: "/images/works/project-2.jpg",
      featured: true,
    },
    {
      kind: "research",
      title: "[Placeholder] Research topic or paper",
      year: "[Year]",
      summary: "[Placeholder] The question, the method, and what you found.",
      venue: "[Course / Lab / Venue]",
      tags: ["[tag]"],
      image: "/images/works/research-1.jpg",
      featured: true,
    },
  ] as Work[],

  /** Areas of interest you keep exploring. */
  explorations: [
    { title: "Technology", note: "[Placeholder] What you build and with which tools." },
    { title: "Research", note: "[Placeholder] Questions you are investigating." },
    { title: "Product", note: "[Placeholder] Products and side projects." },
    { title: "Language & learning", note: "[Placeholder] How you learn — including IELTS Writing Lab." },
  ] as Exploration[],

  /** Life outside work and study: hobbies, entertainment, experiences. */
  beyondWork: [
    { title: "[Placeholder] Hobby", note: "[Placeholder] Why you love it.", image: "/images/beyond/1.jpg" },
    { title: "[Placeholder] Entertainment", note: "[Placeholder] Books, films, music, games…", image: "/images/beyond/2.jpg" },
    { title: "[Placeholder] Experience", note: "[Placeholder] A trip, an event, a memory.", image: "/images/beyond/3.jpg" },
  ] as BeyondWorkItem[],

  /** Easter-egg messages (Konami code, clicking the nav wordmark 5×, the DevTools console). */
  secrets: {
    konami: "[Placeholder] You found the secret! Write a fun hidden message here.",
    logo: "[Placeholder] Five clicks — persistent. Another hidden note for the curious.",
    console: "Hi there, fellow tinkerer 👋 — try ↑↑↓↓←→←→BA on this page.",
  },

  contact: {
    note: "[Placeholder] What you are open to — collaborations, questions, or just saying hello.",
    /** e.g. "hello@yourname.id.vn". Left empty until you add it. */
    email: "",
    links: [
      // { label: "GitHub", href: "https://github.com/..." },
      // { label: "LinkedIn", href: "https://www.linkedin.com/in/..." },
    ] as { label: string; href: string }[],
  },
};
