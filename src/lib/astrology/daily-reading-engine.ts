import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import type { ZodiacSign } from "@/lib/zodiac/signs";

export type DailyReading = {
  energyScore: number;
  emotionalScore: number;
  focusScore: number;
  socialScore: number;
  headline: string;
  summary: string;
  advice: string;
  avoidText: string;
  symbolicColor: string;
  symbolicNumber: number;
  ritual: string;
};

const hash = (v: string) =>
  Array.from(v).reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 2166136261);

const tips = {
  ates: "Öfkeni seçerek kullan.",
  toprak: "Ritmini sade bir planla koru.",
  hava: "Fikrini açık bir cümleye indir.",
  su: "İç sesine alan aç.",
};

export function createDailyReading(sign: ZodiacSign, astronomy: AstronomySnapshot): DailyReading {
  const n = hash(astronomy.dateKey + sign.slug);
  const score = (shift: number) => 42 + ((n >>> shift) % 53);

  return {
    energyScore: score(0),
    emotionalScore: score(5),
    focusScore: score(10),
    socialScore: score(15),
    headline: `${sign.nameTr} için ${astronomy.moonPhaseName} ritmi`,
    summary: `Bugünün gökyüzü verisi, ${sign.shortDescription.toLowerCase()} Temponu kendi ölçünde kurmak için bir davet olarak okunabilir.`,
    advice: tips[sign.element],
    avoidText: "Her şeyi aynı anda sonuçlandırma baskısını büyütme.",
    symbolicColor: sign.accentColor,
    symbolicNumber: (n % 9) + 1,
    ritual: "Üç dakika ayır: nefesini düzenle ve günün tek niyetini yaz.",
  };
}
