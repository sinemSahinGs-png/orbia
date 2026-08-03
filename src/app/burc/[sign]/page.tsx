import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { getSignBySlug, allSigns } from "@/lib/zodiac/signs";
import { getDailyForSign } from "@/lib/daily-reading/get-daily";
import Link from "next/link";

type Props = { params: Promise<{ sign: string }> };
export function generateStaticParams() {
  return allSigns().map((s) => ({ sign: s.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sign } = await params;
  const s = getSignBySlug(sign);
  return { title: s ? `${s.nameTr} Burcu` : "Burç" };
}
export default async function BurcPage({ params }: Props) {
  const { sign } = await params;
  const daily = getDailyForSign(sign);
  if (!daily) notFound();
  const { reading, astro, sign: s } = daily;
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">{s.nameTr}</p>
      <h1 className="cine-heading">{reading.headline}</h1>
      <p className="cine-body">{reading.summary}</p>
      <p className="cine-body">Enerji {reading.energyScore}/100 · Ay: {astro.moonPhase}</p>
      <Link href={`/urunler/${s.slug}`} className="cine-btn" style={{ marginTop: 24, display: "inline-flex" }}>Ürünü İncele</Link>
      <p className="cine-body" style={{ marginTop: 20, fontSize: "0.85rem" }}>
        Astrolojik yorumlar eğlence ve kişisel farkındalık amacıyla sunulur.
      </p>
    </MarketingChrome>
  );
}
