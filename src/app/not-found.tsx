import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";

export default function NotFound() {
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">404</p>
      <h1 className="cine-heading">Bu gökyüzü kapalı.</h1>
      <p className="cine-body">Aradığın sayfa veya anahtar kodu bulunamadı.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <Link href="/" className="cine-btn">
          Ana Sayfa
        </Link>
        <Link href="/urunler" className="cine-btn" style={{ background: "transparent" }}>
          Ürünler
        </Link>
      </div>
    </MarketingChrome>
  );
}
