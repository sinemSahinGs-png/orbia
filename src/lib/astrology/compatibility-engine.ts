import { getSignBySlug } from "@/lib/zodiac/signs";

const hash = (v: string) =>
  Array.from(v).reduce((n, c) => (n * 33 + c.charCodeAt(0)) >>> 0, 5381);

export type Compatibility = {
  generalRhythm: number;
  communication: number;
  emotionalFlow: number;
  /** Attraction / çekim */
  movementEnergy: number;
  complementArea: number;
  strengthToday: string;
  sensitivePoint: string;
  jointAdvice: string;
};

const STRENGTHS = [
  "Açık konuşma",
  "Ortak tempo bulma",
  "Birbirini dinleme",
  "Küçük jestler",
  "Mizah ve hafiflik",
  "Ortak bir plan kurma",
];

const SENSITIVES = [
  "Acele kararlar",
  "Yanlış anlaşılan kısa mesajlar",
  "Fazla yüklenme",
  "Sessizce uzaklaşma",
  "Beklentiyi dilendirmemek",
  "Karşılaştırmalar",
];

const ADVICE = [
  "Bugün kısa bir yürüyüş veya ortak bir kahve bile ritmi yumuşatabilir.",
  "Birbirinize tek bir net soru sorun: “Bugün neye ihtiyacın var?”",
  "Beraber küçük bir işi bitirin; tamamlanmış his paylaşımı güçlendirir.",
  "Telefonsuz on dakika ayırın — göz teması yeter.",
  "Birlikte bir playlist açın; sözsüz ortaklık da bağ kurar.",
  "Günün sonunda iki cümleyle neyin iyi gittiğini söyleyin.",
];

export function getCompatibility(
  signA: string,
  signB: string,
  date = new Date().toISOString().slice(0, 10),
): Compatibility | null {
  const a = getSignBySlug(signA);
  const b = getSignBySlug(signB);
  if (!a || !b) return null;

  const sorted = [signA, signB].sort();
  const n = hash([date, ...sorted].join("-"));
  const score = (shift: number) => 45 + ((n >>> shift) % 50);

  return {
    generalRhythm: score(0),
    communication: score(5),
    emotionalFlow: score(10),
    movementEnergy: score(15),
    complementArea: a.element === b.element ? 72 : score(20),
    strengthToday: STRENGTHS[n % STRENGTHS.length],
    sensitivePoint: SENSITIVES[(n >>> 7) % SENSITIVES.length],
    jointAdvice: ADVICE[(n >>> 11) % ADVICE.length],
  };
}
