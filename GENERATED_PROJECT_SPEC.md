# GENERATED PROJECT SPEC — ASTRA KEY

## Marka

- **Ad:** ASTRA KEY (geçici çalışma markası)
- **Slogan:** Gökyüzünü yanında taşı.
- **Tagline:** Dokundur. Hisset. Keşfet.
- **Tasarım:** Premium celestial noir
- **Dil:** Türkçe (UTF-8)

## Sektör

NFC ürünleri, astroloji temalı kişiselleştirilmiş aksesuarlar ve dijital deneyimler.

## Dönüşüm hedefleri

1. **Ana CTA:** Burcunu Seç → `/urunler`
2. **İkincil CTA:** Deneyimi Keşfet → `/nasil-calisir` veya `/k/AX7K29P`

## Sayfa envanteri

| Sayfa | Rota | Durum |
|-------|------|-------|
| Ana Sayfa | `/` | ✓ |
| Ürünler | `/urunler` | ✓ |
| Burç ürün | `/urunler/[sign]` | ✓ (12 static) |
| Burç profili | `/burc/[sign]` | ✓ (12 static) |
| NFC deneyim | `/k/[code]` | ✓ |
| Uyum | `/uyum` | ✓ |
| Sipariş | `/siparis` | ✓ (form placeholder) |
| Nasıl Çalışır | `/nasil-calisir` | ✓ |
| SSS | `/sss` | ✓ |
| İletişim | `/iletisim` | ✓ |
| Gizlilik | `/gizlilik` | ✓ |
| Çerez | `/cerez` | ✓ |
| Astroloji bildirimi | `/astroloji-bildirimi` | ✓ |
| 404 | `not-found.tsx` | ✓ |

## Teknik stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- astronomy-engine 2.x
- GSAP + Lenis (Memoora shell)
- Tailwind CSS 4

## API uçları

- `GET /api/daily/[sign]`
- `GET /api/nfc/[code]`
- `POST /api/compatibility`
- `POST /api/pair/start`
- `POST /api/pair/complete`
- `POST /api/orders` (503 placeholder)

## Bilinçli kısıtlar

- Kesin kehanet dili kullanılmaz
- RGB / ucuz astroloji estetiği yok
- Memory Card `/encode`, `/setup`, `/c/` kaldırıldı
