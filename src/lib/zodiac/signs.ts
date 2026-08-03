export type Element = "ates" | "toprak" | "hava" | "su";
export type Modality = "kardinal" | "sabit" | "degisken";

export type ZodiacSign = {
  slug: string;
  nameTr: string;
  dateRange: string;
  element: Element;
  modality: Modality;
  accentColor: string;
  shortDescription: string;
  glyphPathHint: string;
};

const data: [string, string, string, Element, Modality, string, string, string][] = [
  ["koc", "Koç", "21 Mart – 19 Nisan", "ates", "kardinal", "#C86B5A", "İlk kıvılcımı taşıyan enerji.", "M4 20L20 4M12 4h8v8"],
  ["boga", "Boğa", "20 Nisan – 20 Mayıs", "toprak", "sabit", "#8E9A70", "Sessiz gücün ve sağlam ritmin sembolü.", "M5 7c2-5 10-5 14 0M5 7v10c3 4 11 4 14 0V7"],
  ["ikizler", "İkizler", "21 Mayıs – 20 Haziran", "hava", "degisken", "#B7A16A", "Değişen fikirlerin canlı akışı.", "M6 4h12M6 20h12M9 4c3 5 3 11 0 16M15 4c-3 5-3 11 0 16"],
  ["yengec", "Yengeç", "21 Haziran – 22 Temmuz", "su", "kardinal", "#86A9C5", "İç dünyanın koruyucu ışığı.", "M6 8c0-4 7-4 7 0s-7 4-7 8 7 0 7 4 7 8"],
  ["aslan", "Aslan", "23 Temmuz – 22 Ağustos", "ates", "sabit", "#D3A34B", "Görünür olmaktan çekinmeyen ateş.", "M12 3c6 0 9 5 7 10-1 5-7 8-11 5-4-3-1-15 5-15"],
  ["basak", "Başak", "23 Ağustos – 22 Eylül", "toprak", "degisken", "#9EA982", "Detayların içerisinde kurulan denge.", "M7 4v16M7 8c8-6 11 4 5 8-4 4-2 1 1 8"],
  ["terazi", "Terazi", "23 Eylül – 22 Ekim", "hava", "kardinal", "#C7B6C9", "İki uç arasında zarif bir ritim.", "M4 17h16M6 13h12c0-6-12-6-12 0"],
  ["akrep", "Akrep", "23 Ekim – 21 Kasım", "su", "sabit", "#8E6074", "Derinde yaşayan dönüşüm enerjisi.", "M6 5v13M10 5v13M14 5v13l4-4m-4 4 4 4"],
  ["yay", "Yay", "22 Kasım – 21 Aralık", "ates", "degisken", "#9B7FC0", "Ufkun ötesine yönelen hareket.", "M5 19 19 5M8 5h11v11M12 12h7"],
  ["oglak", "Oğlak", "22 Aralık – 19 Ocak", "toprak", "kardinal", "#748E93", "Zamanla güçlenen kararlı yapı.", "M5 5v14c5 3 8-5 5-10-2-3-7 2-3 7"],
  ["kova", "Kova", "20 Ocak – 18 Şubat", "hava", "sabit", "#6D9AA8", "Alışılmışın dışındaki yeni frekans.", "M4 9l4-4 4 4 4-4 4 4M4 17l4-4 4 4 4-4 4 4"],
  ["balik", "Balık", "19 Şubat – 20 Mart", "su", "degisken", "#7194B5", "Sezginin sınır tanımayan akışı.", "M4 12h16M19 6c-6 1-6 11 0 12M5 6c6 1 6 11 0 12"],
];

export const ZODIAC_SIGNS: readonly ZodiacSign[] = data.map(
  ([slug, nameTr, dateRange, element, modality, accentColor, shortDescription, glyphPathHint]) => ({
    slug,
    nameTr,
    dateRange,
    element,
    modality,
    accentColor,
    shortDescription,
    glyphPathHint,
  }),
);

export const allSigns = () => ZODIAC_SIGNS;
export const getSignBySlug = (slug: string) => ZODIAC_SIGNS.find((s) => s.slug === slug);
