import { Geist_Mono, Inter } from "next/font/google";

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

/** Code only (inside articles). */
const mono = Geist_Mono({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-mono-face",
  display: "swap",
});

export const fontVariables = [inter.variable, mono.variable].join(" ");
