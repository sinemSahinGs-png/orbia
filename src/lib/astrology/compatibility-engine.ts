import { getSignBySlug } from "@/lib/zodiac/signs";

const hash = (v: string) =>
  Array.from(v).reduce((n, c) => (n * 33 + c.charCodeAt(0)) >>> 0, 5381);

export type Compatibility = {
  generalRhythm: number;
  communication: number;
  emotionalFlow: number;
  movementEnergy: number;
  complementArea: number;
  jointAdvice: string;
};

export function getCompatibility(
  signA: string,
  signB: string,
  date = new Date().toISOString().slice(0, 10),
): Compatibility | null {
  const a = getSignBySlug(signA);
  const b = getSignBySlug(signB);
  if (!a || !b) return null;

  const n = hash([date, ...[signA, signB].sort()].join("-"));
  const score = (shift: number) => 45 + ((n >>> shift) % 50);

  return {
    generalRhythm: score(0),
    communication: score(5),
    emotionalFlow: score(10),
    movementEnergy: score(15),
    complementArea: a.element === b.element ? 72 : score(20),
    jointAdvice:
      a.element === b.element
        ? "Ortak ritmi canlı tutmak için birbirinize yeni bir bakış açısı açın."
        : "Farklı tempoları, birlikte öğrenilecek bir alan olarak ele alın.",
  };
}
