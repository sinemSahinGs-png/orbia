import type { Metadata } from "next";
import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
export const metadata: Metadata = { title: "Nasıl Çalışır?" };
export default function Page() {
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">AKIŞ</p>
      <h1 className="cine-heading">Burcunu seç. Dokundur. Keşfet.</h1>
      <ol className="cine-body" style={{ lineHeight: 1.9 }}>
        <li>Burcunu seç</li>
        <li>Anahtarlığını kişiselleştir</li>
        <li>NFC ile dokundur</li>
        <li>Günlük gökyüzünü keşfet</li>
      </ol>
      <Link href="/urunler" className="cine-btn" style={{ marginTop: 24, display: "inline-flex" }}>Burcunu Seç</Link>
    </MarketingChrome>
  );
}
