import type { Metadata } from "next";
import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { allSigns } from "@/lib/zodiac/signs";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "12 burca özel ORBIA Burç NFC Anahtarlığı",
};

export default function ProductsPage() {
  const signs = allSigns();
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">Ürünler</p>
      <h1 className="cine-heading">12 burç. 12 anahtarlık.</h1>
      <p className="cine-body">Gökyüzünü yanında taşı.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16, marginTop: 32 }}>
        {signs.map((s) => (
          <Link key={s.slug} href={`/urunler/${s.slug}`} style={{ border: "1px solid rgba(215,217,223,0.14)", padding: 16, background: "#0C0F16", textDecoration: "none", color: "inherit" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/zodiac/${s.slug}.svg`} alt={s.nameTr} width={64} height={64} />
            <h2 style={{ margin: "12px 0 4px", fontSize: "1.2rem" }}>{s.nameTr}</h2>
            <p style={{ color: "#8D929D", fontSize: "0.8rem" }}>{s.dateRange}</p>
          </Link>
        ))}
      </div>
    </MarketingChrome>
  );
}
