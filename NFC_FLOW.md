# NFC Flow — ASTRA KEY

## Genel akış

```
NFC etiket → URL (/k/[code]) → resolveTag → günlük deneyim (KeyExperience)
```

1. Fiziksel etiket, herkese açık bir `/k/[CODE]` URL'si yazar.
2. `resolveTag(code)` demo kodunu burç slug'ına eşler (`demo-tags.ts`).
3. `getDailyForSign` astronomi + sembolik okuma üretir.
4. `KeyExperience` intro animasyonu ve günlük kartı gösterir.

## Demo kodları

| Kod | Burç |
|-----|------|
| AX7K29P | Aslan |
| BK3M81Q | Terazi |
| CN9R44T | Kova |
| DP2L65A | Koç |
| … | (12 burç, `demo-tags.ts`) |

Varsayılan demo: `/k/AX7K29P`

## API

`GET /api/nfc/[code]` — `{ ok, tag }` veya 404

## Web NFC (opsiyonel)

`OptionalWebNfcScan` bileşeni Android Chrome'da `NDEFReader` ile tarama sunar. iPhone'da etiket doğrudan URL açar; encode/setup sayfaları kaldırıldı.

## Güvenlik notları

- Demo kodlar herkese açıktır; üretimde opaque kod + rate limit gerekir.
- Etiket URL'si kişisel veri taşımaz.

## Eşleştirme

"İkinci enerjiyi yaklaştır" → `PairSession` (10 dk) → `/uyum` sayfası. Detay: `PAIRING_FLOW.md`.
