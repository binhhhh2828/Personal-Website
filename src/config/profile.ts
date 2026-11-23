/**
 * Personal website data — the short, structured facts about you.
 * Your longer life story (childhood, education, passions…) lives in
 * content/pages/main/about.mdx, written in prose.
 *
 * Filled from what you shared. Anything still marked "[Placeholder]" or "[...]"
 * (e.g. works) is waiting for your real details.
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
  name: "Lại Bình",
  /** One short line under your name. */
  role: "IT student · Diary keeper · Vibe coder",
  location: "Uông Bí, Vietnam",
  /** The big statement in the hero. */
  headline: "A little naive, a little nostalgic — learning to build things that last.",
  intro: "I study at the Academy of Cryptography Techniques (KMA). I keep diaries, tell long stories, and share far too many memes about AI and vibe coding.",
  portrait: "/images/portrait.jpg",

  /** Home page "About" teaser. The full story is content/pages/main/about.mdx. */
  aboutTeaser: [
    "I’m an IT student at KMA, currently making peace with Linux. My grades sit around a B+ — and I’m honestly curious how the 4.0 people do it.",
    "Off the keyboard I write diaries, tell long (often self-roasting) stories, lose badminton games, and remember my dreams in too much detail.",
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
    { title: "Technology", note: "Studying IT at KMA, learning Linux, and building small projects — with backups now." },
    { title: "AI & vibe coding", note: "Building with AI, sharing the memes, and figuring out what is hype and what actually works." },
    { title: "Writing", note: "Diaries, long stories, strange dreams. Writing is how I remember things." },
    { title: "Language & learning", note: "Learning English in public — documented in IELTS Writing Lab." },
  ] as Exploration[],

  /** Life outside work and study: hobbies, entertainment, experiences. */
  beyondWork: [
    { title: "Badminton", note: "Not very good at it. Very good at snapping strings and restringing my racket.", image: "/images/beyond/1.jpg" },
    { title: "Avocado & mango", note: "Mashed with condensed milk. Almost every day. No regrets.", image: "/images/beyond/2.jpg" },
    { title: "Strange dreams", note: "I remember them, and I will tell you about them — whether you asked or not.", image: "/images/beyond/3.jpg" },
  ] as BeyondWorkItem[],

  /** Easter-egg messages (Konami code, clicking the nav wordmark 5×, the DevTools console). */
  secrets: {
    konami: "You found the secret. Reward: go mash some avocado and mango with condensed milk. 🥑🥭",
    logo: "Five clicks. You’re more persistent than my badminton strings.",
    console: "Hi there, fellow tinkerer 👋 — try ↑↑↓↓←→←→BA on this page.",
  },

  contact: {
    note: "Questions, collaborations, meme recommendations or a strange dream to share — say hello.",
    /** e.g. "hello@yourname.id.vn". Left empty until you add it. */
    email: "",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/lai.binh.2910" },
      { label: "Instagram", href: "https://www.instagram.com/why_soethereal" },
      { label: "Threads", href: "https://www.threads.net/@why_soethereal" },
    ] as { label: string; href: string }[],
  },
};
