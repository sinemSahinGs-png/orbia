# Pairing Flow — ASTRA KEY

## Amaç

İki ASTRA KEY anahtarlığının burç uyumunu sembolik skorlarla göstermek.

## Oturum

Dosya: `src/lib/nfc/pair-session.ts`

```typescript
PairSession = {
  firstCode: string;
  firstSign: string;
  startedAt: number;
  expiresAt: number; // startedAt + 600_000 ms (10 dk)
}
```

Depolama:
- `localStorage` anahtarı: `astra-key-pair`
- Yedek çerez: aynı anahtar, `max-age=600`

## Akış

1. Kullanıcı `/k/[code]` deneyiminde "İkinci enerjiyi yaklaştır" tıklar.
2. `createPairSession(firstCode, firstSign)` kaydedilir.
3. `/uyum` sayfası oturumu okur.
4. İkinci kod NFC veya manuel seçimle gelir.
5. `POST /api/pair/complete` → `{ signA, signB, result }`
6. Uyum skorları ekranda gösterilir.

## API uçları

| Endpoint | Gövde | Yanıt |
|----------|-------|-------|
| `POST /api/pair/start` | `{ code }` | `{ session, token, ttlMs }` |
| `POST /api/pair/complete` | `{ firstCode, secondCode }` | Uyum sonucu |

## Demo token

`createPairToken` base64url JSON üretir — **yalnızca demo**. Üretimde imzalı sunucu token'ı kullanın.

## Fallback

Web NFC yoksa `/uyum` sayfasında burç dropdown ile demo kod eşlemesi (`getDemoCodeForSign`) kullanılabilir.
