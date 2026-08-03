# Migration Report — Memory Card → ASTRA KEY

## Özet

Memoora white-label şablonu korunarak Memory Card ürün dili ASTRA KEY NFC astroloji markasına dönüştürüldü.

## Tamamlanan değişiklikler

| Alan | Önce | Sonra |
|------|------|-------|
| Marka | Memory Card | ASTRA KEY |
| NFC giriş | `/c/[code]`, encode/setup | `/k/[code]` |
| İçerik | Hafıza kartı çiftleri | 12 burç anahtarlık |
| Astronomi | Yok | astronomy-engine |
| Uyum | Yok | `/uyum` + pair API |
| Sipariş | Yok | `/siparis` formu |
| Sitemap | memorycard.app | example-domain.com + ASTRA rotalar |

## Silinen rotalar

- `/encode` — Web NFC yazma paneli
- `/setup` — iPhone kurulum
- `/c/[code]` — Memory Card görüntüleyici
- `EncodePanel` bileşeni

## Korunan Memoora özellikleri

- GSAP scroll animasyonları
- Lenis smooth scroll
- Premium home CSS sınıfları
- Responsive navbar yapısı
- Section bileşen kütüphanesi (opsiyonel kullanım)

## Encoding düzeltmeleri

Bozuk UTF-8 (`?` karakterleri) düzeltildi:
- `site.ts`, `signs.ts`, `astronomy-service.ts`
- Navbar, footer, layout metadata
- API hata mesajları

## Bilinen placeholder'lar

- `POST /api/orders` → 503
- İletişim bilgileri `[Telefon eklenecek]` vb.
- Ürün malzeme seçenekleri placeholder metin

## Doğrulama

```bash
npm run typecheck  # ✓
npm run lint       # ✓
npm run build      # ✓
```
