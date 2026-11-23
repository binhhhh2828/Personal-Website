import { Manrope, Inter, Geist_Mono, Instrument_Serif } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const fontVariables = [
  manrope.variable,
  inter.variable,
  geistMono.variable,
  instrumentSerif.variable,
].join(" ");
