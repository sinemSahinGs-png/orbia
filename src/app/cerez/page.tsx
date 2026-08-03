import type { Metadata } from "next";
import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";

export const metadata: Metadata = { title: "Çerez Politikası" };

export default function CookiePage() {
  return (
    <MarketingChrome>
      <h1 className="cine-heading">Çerezler</h1>
      <p className="cine-body">
        ORBIA, temel site işlevleri için sınırlı çerez ve yerel depolama kullanır.
      </p>
      <ul className="cine-body" style={{ lineHeight: 1.9, marginTop: 20 }}>
        <li>
          <strong>Eşleştirme oturumu:</strong> İki anahtarlık uyum deneyimi için 10 dakikalık oturum çerezi.
        </li>
        <li>
          <strong>Tanıtım animasyonu:</strong> NFC deneyiminde intro atlamayı hatırlamak için localStorage.
        </li>
        <li>
          <strong>Pazarlama çerezleri:</strong> Bu sürümde varsayılan olarak kullanılmaz.
        </li>
      </ul>
      <p className="cine-body" style={{ marginTop: 20 }}>
        Eski adres: <Link href="/cerez-politikasi">/cerez-politikasi</Link> otomatik yönlendirilir.
      </p>
    </MarketingChrome>
  );
}
