# Astronomy Engine — ASTRA KEY

## Kütüphane

[`astronomy-engine`](https://github.com/cosinekitty/astronomy) v2.x — geocentric Ay evresi, Ay ve Güneş ekliptik boylamı.

## Servis

Dosya: `src/lib/astronomy/astronomy-service.ts`

```typescript
getAstronomyForDate(date: Date | string): AstronomySnapshot
```

### Çıktı alanları

| Alan | Açıklama |
|------|----------|
| `dateKey` | `Europe/Istanbul` saat diliminde `YYYY-MM-DD` |
| `moonPhaseName` | Türkçe Ay evresi adı (Yeni Ay, Büyüyen Hilal, …) |
| `illumination` | 0–1 arası aydınlık oranı |
| `moonAgeDays` | Ay yaşı (gün) |
| `moonTropicalSign` | Ay'ın tropik burç slug'ı |
| `sunEclipticLongitude` | Güneş ekliptik boylamı |
| `nextNewMoon`, `nextFullMoon` | ISO tarih |
| `stale` | Hesaplama hatasında önbellek yedeği kullanıldı mı |

## Önbellek

Tarih anahtarlı in-memory `Map`. Sunucu yeniden başlatılınca sıfırlanır. Üretimde Redis veya edge cache önerilir.

## Tüketiciler

- `src/lib/daily-reading/get-daily.ts` — günlük okuma
- `src/app/api/daily/[sign]/route.ts` — REST API
- `KeyExperience` — NFC deneyim ekranı

## Ayrım

Astronomi verisi **hesaplanmış gökyüzü** bilgisidir. Sembolik burç yorumları `daily-reading-engine.ts` içinde ayrı üretilir ve eğlence amaçlıdır.
