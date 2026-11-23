/**
 * Personal website data.
 *
 * EVERYTHING HERE IS A PLACEHOLDER. Nothing has been invented about you:
 * each value is marked "[Placeholder]" or "[...]" until you replace it.
 * Pages render whatever is here, so editing this file is all you need.
 */

export type Project = {
  title: string;
  year: string;
  summary: string;
  role?: string;
  href?: string;
  tags: string[];
};

export type ResearchItem = {
  title: string;
  year: string;
  venue?: string;
  summary: string;
  href?: string;
};

export const profile = {
  name: "[Your Name]",
  headline: "[Placeholder] A one-sentence statement of what you build, study and care about.",
  intro: [
    "[Placeholder] Two or three sentences introducing yourself — your field of study, what you are building, and the questions you keep returning to.",
    "[Placeholder] This site collects projects, research notes and learning in public.",
  ],
  /** Areas shown on the home page. Edit labels/descriptions freely. */
  interests: [
    { label: "Technology", note: "[Placeholder] What you build and with which tools." },
    { label: "Research", note: "[Placeholder] Questions you are investigating." },
    { label: "Product", note: "[Placeholder] Products and side projects." },
    { label: "Language & learning", note: "[Placeholder] How you learn, including IELTS Writing Lab." },
    { label: "Exploration", note: "[Placeholder] Other interests." },
  ],
  about: [
    "[Placeholder] Your longer introduction: background, current studies or work, and what you are working toward.",
    "[Placeholder] What this website is for and how you hope readers use it.",
  ],
  links: [
    // { label: "GitHub", href: "https://github.com/..." },
    // { label: "Email", href: "mailto:..." },
  ] as { label: string; href: string }[],
  projects: [
    {
      title: "[Placeholder] Project title",
      year: "[Year]",
      summary: "[Placeholder] One or two sentences on the problem, your approach and the outcome.",
      role: "[Role]",
      tags: ["[tag]"],
    },
  ] as Project[],
  research: [
    {
      title: "[Placeholder] Research topic or paper title",
      year: "[Year]",
      venue: "[Venue / Course / Lab]",
      summary: "[Placeholder] The question, method and what you found.",
    },
  ] as ResearchItem[],
};
