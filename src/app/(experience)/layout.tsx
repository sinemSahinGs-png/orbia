import { Cormorant_Garamond, Figtree } from "next/font/google";
import type { ReactNode } from "react";

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-editorial",
  display: "swap",
});

const figtree = Figtree({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-ui",
  display: "swap",
});

/** Fonts for NFC atlas experience (`/[sign]`, `/k/[code]`). */
export default function ExperienceLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`ox-fonts ${cormorant.variable} ${figtree.variable}`}>{children}</div>
  );
}
