import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { getSignBySlug, allSigns } from "@/lib/zodiac/signs";

type Props = { params: Promise<{ sign: string }> };

export function generateStaticParams() {
  return allSigns().map((s) => ({ sign: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sign } = await params;
  const s = getSignBySlug(sign);
  if (!s) return { title: "Ürün" };
  return {
    title: `${s.nameTr} Burcu NFC Anahtarlık ve Günlük Yorum`,
    description: `${s.nameTr} burcuna özel ORBIA Burç NFC Anahtarlığı.`,
  };
}

export default async function ProductSignPage({ params }: Props) {
  const { sign } = await params;
  const s = getSignBySlug(sign);
  if (!s) notFound();
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">{s.element} · {s.modality}</p>
      <h1 className="cine-heading">{s.nameTr}</h1>
      <p className="cine-body">{s.dateRange}</p>
      <p className="cine-body">{s.shortDescription}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/products/keychain-placeholder.svg" alt="ORBIA anahtarlık" style={{ maxWidth: 280, marginTop: 24 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        <Link href={`/siparis?sign=${s.slug}`} className="cine-btn">Sipariş Talebi</Link>
        <Link href={`/burc/${s.slug}`} className="cine-btn" style={{ background: "transparent" }}>Burç profili</Link>
      </div>
      <p className="cine-body" style={{ marginTop: 16 }}>Malzeme seçenekleri: [Placeholder — Obsidyen Siyah / Lunar Silver / Midnight Blue]</p>
    </MarketingChrome>
  );
}
