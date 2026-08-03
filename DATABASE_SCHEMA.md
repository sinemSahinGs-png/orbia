# Database Schema — ASTRA KEY (planlanan)

Şu an proje **veritabansız** çalışır (in-memory astronomi önbelleği, demo tag eşlemesi). Üretim için önerilen şema:

## `nfc_tags`

| Sütun | Tip | Not |
|-------|-----|-----|
| `code` | `varchar(16) PK` | Opaque NFC kodu |
| `sign_slug` | `varchar(16) FK` | Burç referansı |
| `active` | `boolean` | Devre dışı etiketler |
| `created_at` | `timestamptz` | |

## `orders`

| Sütun | Tip | Not |
|-------|-----|-----|
| `id` | `uuid PK` | |
| `name` | `text` | |
| `email` | `text` | |
| `phone` | `text` | Opsiyonel |
| `sign_slug` | `varchar(16)` | |
| `variant` | `text` | Malzeme seçimi |
| `personalization` | `text` | Kısa metin |
| `quantity` | `int` | |
| `note` | `text` | |
| `status` | `enum` | `pending`, `confirmed`, `shipped` |
| `created_at` | `timestamptz` | |

## `pair_events` (opsiyonel analitik)

| Sütun | Tip |
|-------|-----|
| `id` | `uuid PK` |
| `first_code` | `varchar(16)` |
| `second_code` | `varchar(16)` |
| `created_at` | `timestamptz` |

## Placeholder durumu

- `POST /api/orders` → **503** "Form backend bağlantısı bekliyor"
- Demo tag'ler `demo-tags.ts` sabit haritasında

## Migrasyon

1. Prisma veya Drizzle şema ekle
2. `resolveTag` → DB sorgusu
3. Sipariş formu → `orders` insert + e-posta webhook
