import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";
import "./home-landing.css";
import "./marketing-landing.css";
import "./home-premium.css";
import "./astra.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "ORBIA | Burcuna Özel NFC Anahtarlık",
    template: `%s | ${site.brand}`,
  },
  description:
    "Burcuna özel ORBIA anahtarlığını dokundur; günlük enerjini, Ay’ın ritmini ve iki burcun ortak yorumunu keşfet.",
  openGraph: {
    title: "ORBIA | Burcuna Özel NFC Anahtarlık",
    description:
      "Burcuna özel ORBIA anahtarlığını dokundur; günlük enerjini, Ay’ın ritmini ve iki burcun ortak yorumunu keşfet.",
    url: site.domain,
    siteName: site.brand,
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${bodoni.variable} ${manrope.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
