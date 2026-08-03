/**
 * Product specification placeholders.
 * Replace with confirmed manufacturing data before launch.
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
];
