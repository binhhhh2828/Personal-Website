import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";

/**
 * Apple design system (docs/apple.DESIGN.md) specifies SF Pro Display / SF Pro Text.
 * SF Pro cannot be self-hosted on the web (licence), so the font stack in globals.css is:
 *   SF Pro (system font on Apple devices)  →  Inter with optical sizing (everyone else)
 * Inter's `opsz` axis gives display-cut letterforms at large sizes, close to SF Pro Display.
 * Both cover Vietnamese.
 */
const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
  variable: "--font-inter-face",
  display: "swap",
});

/** Editorial serif for large headings ("forest night" theme). Covers Vietnamese. */
const serif = Playfair_Display({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-face",
  display: "swap",
});

/** Code only (inside articles). */
const mono = Geist_Mono({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-mono-face",
  display: "swap",
});

export const fontVariables = [inter.variable, serif.variable, mono.variable].join(" ");
