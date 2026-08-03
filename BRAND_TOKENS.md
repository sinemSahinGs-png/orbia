# ASTRA KEY — Brand Tokens

Premium celestial noir paleti. CSS değişkenleri `src/app/astra.css` ve `globals.css` içinde tanımlıdır.

## Renkler

| Token | Hex | Kullanım |
|-------|-----|----------|
| `--astra-bg-deep` | `#020305` | En koyu arka plan |
| `--astra-bg` | `#050609` | Sayfa arka planı |
| `--astra-surface` | `#0C0F16` | Kart, form alanı |
| `--astra-secondary` | `#131D35` | Vurgu yüzey |
| `--astra-primary` | `#D7D9DF` | Birincil metin / border |
| `--astra-text` | `#F2F0EA` | Başlık metni |
| `--astra-muted` | `#8D929D` | İkincil metin |
| `--astra-accent` | `#B7A16A` | Altın vurgu, CTA |

Burç accent renkleri: `src/lib/zodiac/signs.ts` → `accentColor`

## Tipografi

| Rol | Font | Değişken |
|-----|------|----------|
| Display | Bodoni Moda | `--font-display` |
| Body | Manrope | `--font-body` |

Google Fonts: `latin-ext` subset (Türkçe karakter desteği)

## Bileşen sınıfları

- `.astra-page` — marketing içerik sarmalayıcı
- `.astra-card` — NFC deneyim kartı
- `.astra-button` / `.cine-btn` — CTA
- `.cine-heading`, `.cine-body`, `.cine-eyebrow` — tipografi ölçekleri

## Ses tonu

- Premium, sakin, gökyüzü metaforları
- Kesin kehanet yok; "ritim", "enerji", "sembolik" dili
- Türkçe UTF-8 zorunlu

## Logo / görsel

- Marka işareti: `public/images/brand/brand-mark.svg`
- Burç ikonları: `public/images/zodiac/[slug].svg`
- Ürün placeholder: `public/images/products/keychain-placeholder.svg`
