import type { ZodiacSign } from "@/lib/zodiac/signs";
import { ZODIAC_SIGNS } from "@/lib/zodiac/signs";

export type ZodiacConstellationPoint = { x: number; y: number };
export type ZodiacConstellation = {
  points: ZodiacConstellationPoint[];
  links: [number, number][];
};

export type ZodiacCollectionItem = ZodiacSign & {
  identity: string;
  productRoute: string;
  constellation: ZodiacConstellation;
};

const IDENTITY: Record<string, string> = {
  koc: "İlk kıvılcımı taşıyan enerji.",
  boga: "Sessiz gücün ve sağlam ritmin sembolü.",
  ikizler: "Değişen fikirlerin canlı akışı.",
  yengec: "İç dünyanın koruyucu ışığı.",
  aslan: "Görünür olmaktan çekinmeyen ateş.",
  basak: "Detayların içerisinde kurulan denge.",
  terazi: "İki uç arasında zarif bir ritim.",
  akrep: "Derinde yaşayan dönüşüm enerjisi.",
  yay: "Ufkun ötesine yönelen hareket.",
  oglak: "Zamanla güçlenen kararlı yapı.",
  kova: "Alışılmışın dışındaki yeni frekans.",
  balik: "Sezginin sınır tanımayan akışı.",
};

const CONSTELLATIONS: Record<string, ZodiacConstellation> = {
  koc: {
    points: [
      { x: 20, y: 70 },
      { x: 35, y: 40 },
      { x: 50, y: 28 },
      { x: 68, y: 42 },
      { x: 80, y: 68 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  boga: {
    points: [
      { x: 22, y: 55 },
      { x: 40, y: 30 },
      { x: 58, y: 30 },
      { x: 76, y: 55 },
      { x: 50, y: 72 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
  },
  ikizler: {
    points: [
      { x: 30, y: 22 },
      { x: 30, y: 78 },
      { x: 70, y: 22 },
      { x: 70, y: 78 },
      { x: 50, y: 50 },
    ],
    links: [
      [0, 1],
      [2, 3],
      [0, 2],
      [1, 3],
      [0, 4],
      [2, 4],
    ],
  },
  yengec: {
    points: [
      { x: 28, y: 35 },
      { x: 48, y: 22 },
      { x: 70, y: 38 },
      { x: 62, y: 68 },
      { x: 36, y: 70 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
  },
  aslan: {
    points: [
      { x: 50, y: 18 },
      { x: 72, y: 36 },
      { x: 68, y: 62 },
      { x: 42, y: 78 },
      { x: 24, y: 52 },
      { x: 36, y: 34 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
  },
  basak: {
    points: [
      { x: 28, y: 20 },
      { x: 28, y: 78 },
      { x: 48, y: 42 },
      { x: 68, y: 30 },
      { x: 74, y: 68 },
    ],
    links: [
      [0, 1],
      [0, 2],
      [2, 3],
      [2, 4],
    ],
  },
  terazi: {
    points: [
      { x: 20, y: 62 },
      { x: 50, y: 62 },
      { x: 80, y: 62 },
      { x: 35, y: 38 },
      { x: 65, y: 38 },
      { x: 50, y: 22 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 3],
      [2, 4],
      [3, 5],
      [4, 5],
    ],
  },
  akrep: {
    points: [
      { x: 22, y: 28 },
      { x: 38, y: 28 },
      { x: 54, y: 28 },
      { x: 54, y: 58 },
      { x: 70, y: 72 },
      { x: 78, y: 82 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },
  yay: {
    points: [
      { x: 24, y: 76 },
      { x: 48, y: 48 },
      { x: 72, y: 24 },
      { x: 58, y: 22 },
      { x: 76, y: 40 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
    ],
  },
  oglak: {
    points: [
      { x: 26, y: 22 },
      { x: 26, y: 70 },
      { x: 48, y: 78 },
      { x: 68, y: 58 },
      { x: 58, y: 38 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
    ],
  },
  kova: {
    points: [
      { x: 18, y: 38 },
      { x: 34, y: 28 },
      { x: 50, y: 38 },
      { x: 66, y: 28 },
      { x: 82, y: 38 },
      { x: 18, y: 68 },
      { x: 50, y: 68 },
      { x: 82, y: 68 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [5, 6],
      [6, 7],
    ],
  },
  balik: {
    points: [
      { x: 22, y: 30 },
      { x: 38, y: 50 },
      { x: 50, y: 50 },
      { x: 62, y: 50 },
      { x: 78, y: 30 },
      { x: 22, y: 70 },
      { x: 78, y: 70 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [5, 1],
      [6, 3],
    ],
  },
};

export const ZODIAC_COLLECTION: readonly ZodiacCollectionItem[] = ZODIAC_SIGNS.map(
  (sign) => ({
    ...sign,
    identity: IDENTITY[sign.slug] ?? sign.shortDescription,
    productRoute: `/urunler/${sign.slug}`,
    constellation: CONSTELLATIONS[sign.slug] ?? CONSTELLATIONS.koc,
  }),
);

export const ELEMENT_LABELS: Record<ZodiacSign["element"], string> = {
  ates: "Ateş",
  toprak: "Toprak",
  hava: "Hava",
  su: "Su",
};

export function getZodiacCollectionItem(slug: string) {
  return ZODIAC_COLLECTION.find((s) => s.slug === slug);
}
