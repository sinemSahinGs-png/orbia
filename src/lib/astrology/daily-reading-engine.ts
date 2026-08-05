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
  ates: "Sözünü seçerek kullan; hızını ölçülü tut.",
  toprak: "Günü sade bir plana bağla.",
  hava: "Fikrini tek net cümleye indir.",
  su: "İç sesine kısa bir alan aç.",
};

const headlines = [
  (name: string, moon: string) => `${name}: ${moon} altında netlik`,
  (name: string) => `${name} için sakin bir yön`,
  (name: string) => `Bugün ${name} temposu`,
  (name: string, moon: string) => `${moon} · ${name}`,
];

export function createDailyReading(sign: ZodiacSign, astronomy: AstronomySnapshot): DailyReading {
  const n = hash(astronomy.dateKey + sign.slug);
  const score = (shift: number) => 42 + ((n >>> shift) % 53);
  const headlineFn = headlines[n % headlines.length];

  return {
    energyScore: score(0),
    emotionalScore: score(5),
    focusScore: score(10),
    socialScore: score(15),
    headline: headlineFn(sign.nameTr, astronomy.moonPhaseName),
    summary: `${sign.shortDescription} Bugün temposunu kendi ölçünde kurmak için uygun bir gün.`,
    advice: tips[sign.element],
    avoidText: "Her şeyi aynı anda bitirme baskısını büyütme.",
    symbolicColor: sign.accentColor,
    symbolicNumber: (n % 9) + 1,
    ritual: "Bir dakika ayır: nefesini düzenle ve bugünün tek niyetini aklında tut.",
  };
}
