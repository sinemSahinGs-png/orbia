# ASTRA KEY — Proje README

Premium celestial-noir NFC anahtarlık vitrini ve günlük gökyüzü deneyimi. Memoora white-label layout korunarak ASTRA KEY markasına dönüştürülmüştür.

## Hızlı başlangıç

```bash
cd websites/astra-key
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

Tarayıcı: `http://localhost:3000`

## Demo NFC

- Aslan: `/k/AX7K29P`
- Terazi: `/k/BK3M81Q`
- Tüm kodlar: `src/lib/nfc/demo-tags.ts`

## Ortam değişkenleri

`.env.example` dosyasına bakın. Şu an yalnızca `NEXT_PUBLIC_SITE_URL` kullanılır.

## Dizin yapısı

```
src/
  app/           # Next.js rotaları
  components/    # UI (home, nfc, layout)
  content/       # site.ts marka metinleri
  lib/
    astronomy/   # astronomy-engine sarmalayıcı
    astrology/   # günlük okuma + uyum motoru
    nfc/         # demo tag, pair session
    zodiac/      # 12 burç verisi
```

## Dokümantasyon

- `TEMPLATE_MAP.md` — Memoora → ASTRA KEY eşlemesi
- `ASTRONOMY_ENGINE.md` — gökyüzü hesapları
- `NFC_FLOW.md` — etiket akışı
- `PAIRING_FLOW.md` — iki anahtar uyumu
- `DATABASE_SCHEMA.md` — planlanan DB
- `BRAND_TOKENS.md` — renk ve tipografi
- `MIGRATION_REPORT.md` — dönüşüm notları

## Placeholder'lar

- Sipariş formu backend (503)
- İletişim telefon/e-posta/sosyal medya
- Ürün malzeme görselleri
