/**
 * Product specs + homepage media inventory.
 * Paths are only included when files exist under /public.
 * Missing assets stay null — consumers must use controlled fallbacks.
 */

export type ProductSpecPlaceholders = {
  dimensions: string;
  primaryMaterial: string;
  coating: string;
  nfcChipModel: string;
  waterResistance: string;
  price: string;
  deliveryTime: string;
};

export const productSpecPlaceholders: ProductSpecPlaceholders = {
  dimensions: "[Boyut eklenecek]",
  primaryMaterial: "[Ana malzeme eklenecek]",
  coating: "[Kaplama eklenecek]",
  nfcChipModel: "[NFC çip modeli eklenecek]",
  waterResistance: "[Su dayanımı eklenecek]",
  price: "[Fiyat eklenecek]",
  deliveryTime: "[Teslimat süresi eklenecek]",
};

export const productAnnotationLabels = [
  { id: "nfc", label: "NFC çip", side: "left" as const },
  { id: "glyph", label: "Burç sembolü", side: "right" as const },
  { id: "surface", label: "Premium yüzey", side: "left" as const },
  { id: "ring", label: "Metal halka", side: "right" as const },
] as const;

/** Inventoried 2026-08-05 from public/ — do not invent missing paths. */
export type ProductMediaAssets = {
  /** Primary keychain photo (square webp, transparent-friendly). */
  keychainMain: string;
  keychainMainWidth: number;
  keychainMainHeight: number;
  /** Optional alternate main path if a dedicated -main file appears later. */
  keychainMainAlt: string | null;
  keychainBackNfc: string | null;
  keychainInHand: string | null;
  heroDesktopVideo: string | null;
  heroMobileVideo: string | null;
  /** H.264 mp4 fallback when .mov is unsupported. */
  heroFallbackMp4: string | null;
  heroPoster: string | null;
  nfcDemoVideo: string | null;
  nfcDemoPoster: string | null;
};

export const productMedia: ProductMediaAssets = {
  keychainMain: "/images/products/orbia-keychain.webp",
  keychainMainWidth: 1254,
  keychainMainHeight: 1254,
  keychainMainAlt: null, // orbia-keychain-main.webp not present
  keychainBackNfc: null, // orbia-keychain-back-nfc.webp not present
  keychainInHand: null, // orbia-keychain-in-hand.webp not present
  heroDesktopVideo: "/videos/orbia-cosmic-desktop.mov",
  heroMobileVideo: "/videos/orbia-cosmic-mobile.mov",
  heroFallbackMp4: "/videos/orbia-cosmic-ambient.mp4",
  heroPoster: "/videos/orbia-cosmic-poster.webp",
  nfcDemoVideo: null, // orbia-nfc-demo.mp4 not present
  nfcDemoPoster: "/videos/orbia-nfc-poster.svg",
};

/**
 * Material option → image. `public/images/materials/` is currently empty.
 * Keep ids aligned with personalizationContent /siparis variant values.
 */
export type MaterialOptionMedia = {
  id: string;
  label: string;
  imageSrc: string | null;
};

export const materialOptionMedia: readonly MaterialOptionMedia[] = [
  { id: "obsidian", label: "Obsidyen Siyah", imageSrc: null },
  { id: "lunar", label: "Lunar Silver", imageSrc: null },
  { id: "midnight", label: "Midnight Blue", imageSrc: null },
] as const;

/**
 * Sign slug → product photo for collection cards.
 * Zodiac folder only has tiny glyph SVGs (not product photos).
 * Only Akrep has a real keychain photo on disk today.
 */
export type ZodiacProductImageMap = Readonly<Record<string, string | null>>;

export const zodiacProductImages: ZodiacProductImageMap = {
  koc: null,
  boga: null,
  ikizler: null,
  yengec: null,
  aslan: null,
  basak: null,
  terazi: null,
  /** Real Scorpio keychain photo — do not reuse for other signs. */
  akrep: "/images/products/orbia-keychain.webp",
  yay: null,
  oglak: null,
  kova: null,
  balik: null,
};

export function getZodiacProductImage(slug: string): string | null {
  return zodiacProductImages[slug] ?? null;
}
