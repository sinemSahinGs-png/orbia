import { Instrument_Serif, Manrope } from "next/font/google";
import type { ReactNode } from "react";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-editorial",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-ui",
  display: "swap",
});

/** Fonts for NFC atlas experience (`/[sign]`, `/k/[code]`). */
export default function ExperienceLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`ox-fonts ${instrument.variable} ${manrope.variable}`}>{children}</div>
  );
}
