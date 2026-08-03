import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
export const metadata: Metadata = { title: "Astroloji Bildirimi" };
export default function Page() {
  return (
    <MarketingChrome>
      <h1 className="cine-heading">Astroloji ve astronomi bildirimi</h1>
      <p className="cine-body">Astrolojik içerikler eğlence ve kişisel farkındalık amaçlıdır.</p>
      <p className="cine-body">Astronomik bilgiler hesaplanan gökyüzü verileridir.</p>
      <p className="cine-body">İçerik sağlık, hukuk veya finans tavsiyesi değildir.</p>
    </MarketingChrome>
  );
}
