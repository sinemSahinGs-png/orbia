import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Gizlilik" };

export default function PrivacyPage() {
  return (
    <MarketingChrome>
      <h1 className="cine-heading">Gizlilik Politikası</h1>
      <p className="cine-body">
        {site.brand}, kişisel verilerinizi yalnızca sipariş ve destek süreçlerinde kullanmayı hedefler.
      </p>
      <ul className="cine-body" style={{ lineHeight: 1.9, marginTop: 20 }}>
        <li>NFC okuma tarayıcıda yerel olarak çalışır; etiket kodu sunucuda burç eşlemesi için kullanılır.</li>
        <li>Eşleştirme oturumu 10 dakika boyunca cihazınızda saklanır (localStorage / çerez).</li>
        <li>Sipariş formu şu an demo modundadır; backend bağlantısı tamamlanana kadar veriler kalıcı kaydedilmez.</li>
        <li>Üçüncü taraf pazarlama çerezleri varsayılan olarak kullanılmaz.</li>
      </ul>
      <p className="cine-body" style={{ marginTop: 20, fontSize: "0.85rem" }}>
        Resmi politika metni domain kesinleşince güncellenecektir.
      </p>
    </MarketingChrome>
  );
}
