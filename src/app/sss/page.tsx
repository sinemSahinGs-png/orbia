import type { Metadata } from "next";
import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";

export const metadata: Metadata = { title: "SSS" };

const faqs = [
  {
    q: "ORBIA nedir?",
    a: "Burcuna özel üretilen NFC anahtarlıklar ve her dokunuşta açılan günlük gökyüzü deneyimidir.",
  },
  {
    q: "NFC nasıl çalışır?",
    a: "Anahtarlığı telefonunun NFC alanına dokundur; tarayıcı /aslan, /yengec gibi burç adresinde günlük burç ve Ay verilerini açar.",
  },
  {
    q: "iPhone destekleniyor mu?",
    a: "Evet. NFC etiketi URL açar; Web NFC taraması opsiyoneldir ve Android Chrome'da kullanılabilir.",
  },
  {
    q: "Uyum deneyimi ne demek?",
    a: "İki farklı ORBIA okutulduğunda burçlar arası sembolik uyum skorları ve ortak ritim notu gösterilir.",
  },
  {
    q: "Astronomi verileri gerçek mi?",
    a: "Ay evresi ve gökyüzü hesapları astronomy-engine ile hesaplanır; yorumlar sembolik ve eğlence amaçlıdır.",
  },
  {
    q: "Sipariş nasıl verilir?",
    a: "Burcunu seç, /siparis formunu doldur; ekip kişiselleştirme detaylarını onaylar.",
  },
];

export default function FaqPage() {
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">SSS</p>
      <h1 className="cine-heading">Sık sorulan sorular</h1>
      <div style={{ display: "grid", gap: 20, marginTop: 32 }}>
        {faqs.map((item) => (
          <article key={item.q}>
            <h2 className="cine-body" style={{ fontSize: "1.1rem", color: "#F2F0EA" }}>
              {item.q}
            </h2>
            <p className="cine-body">{item.a}</p>
          </article>
        ))}
      </div>
      <Link href="/iletisim" className="cine-btn" style={{ marginTop: 32, display: "inline-flex" }}>
        İletişime geç
      </Link>
    </MarketingChrome>
  );
}
