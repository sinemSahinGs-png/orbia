# TEMPLATE MAP — ASTRA KEY

Kaynak: Memoora (WHITE_LABEL). Layout, section sırası, GSAP/Lenis animasyon kabuğu ve responsive davranış korunur.

## Korunan Memoora yapıları

| Bileşen | Konum | ASTRA KEY kullanımı |
|---------|-------|---------------------|
| Premium home shell | `memoora-home-premium`, `home-premium.css` | Ana sayfa ve marketing sayfaları |
| Navbar / Footer | `HomeNavbar`, `PremiumHomeFooter` | ASTRA KEY nav linkleri |
| Smooth scroll | `SmoothScroll` | Tüm sayfalar |
| Section bileşenleri | `src/components/home/sections/*` | İsteğe bağlı; ana sayfa `AstraKeyHomePage` kullanır |

## ASTRA KEY'e özgü rotalar

| Rota | Açıklama |
|------|----------|
| `/` | Marka ana sayfası |
| `/urunler`, `/urunler/[sign]` | 12 burç ürün vitrini |
| `/burc/[sign]` | Günlük burç sayfası |
| `/k/[code]` | NFC deneyim girişi |
| `/uyum` | İki anahtarlık uyum deneyimi |
| `/siparis` | Sipariş talep formu |
| `/nasil-calisir` | Akış açıklaması |
| `/sss`, `/iletisim`, `/gizlilik`, `/cerez` | Yasal / destek |
| `/astroloji-bildirimi` | Sorumluluk reddi |
| `/cerez-politikasi` | `/cerez` yönlendirmesi |

## Kaldırılan Memory Card rotaları

`/encode`, `/setup`, `/c/[code]` silindi. Demo deneyim `/k/AX7K29P` üzerinden sunulur.

## İçerik kaynakları

- Marka metinleri: `src/content/site.ts`
- Burç verisi: `src/lib/zodiac/signs.ts`
- Demo NFC kodları: `src/lib/nfc/demo-tags.ts`
