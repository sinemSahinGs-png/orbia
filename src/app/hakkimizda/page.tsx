import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";

export const metadata: Metadata = { title: "Hakkımızda" };

export default function AboutPage() {
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">Hakkımızda</p>
      <h1 className="cine-heading">Gökyüzünü yanında taşı.</h1>
      <p className="cine-body">
        ORBIA, burcuna özel NFC anahtarlıklarla fiziksel objeyi günlük gökyüzü
        deneyimine bağlar. Premium, karanlık ve koleksiyonluk bir aksesuar olarak
        tasarlanır; ucuz falcılık veya soğuk teknoloji ürünü gibi görünmez.
      </p>
      <p className="cine-body">
        Her dokunuşta burcunun o güne özel ritmi, Ay&apos;ın durumu ve farkındalık
        amaçlı yorumlar açılır. İki anahtarlıkla ortak enerji deneyimi mümkündür.
      </p>
    </MarketingChrome>
  );
}
