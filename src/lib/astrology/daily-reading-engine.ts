import { DAILY_SIGN_COPY, fillDailyCopy } from "@/content/daily-sign-copy";
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

function pick<T>(list: readonly T[], n: number) {
  return list[n % list.length]!;
}

export function createDailyReading(sign: ZodiacSign, astronomy: AstronomySnapshot): DailyReading {
  const n = hash(astronomy.dateKey + sign.slug);
  const score = (shift: number) => 42 + ((n >>> shift) % 53);
  const copy = DAILY_SIGN_COPY[sign.slug];
  const moon = astronomy.moonPhaseName;
  const name = sign.nameTr;

  return {
    energyScore: score(0),
    emotionalScore: score(5),
    focusScore: score(10),
    socialScore: score(15),
    headline: copy
      ? fillDailyCopy(pick(copy.headlines, n), name, moon)
      : `${name} için sakin bir yön`,
    summary: copy ? pick(copy.summaries, n >>> 3) : `${sign.shortDescription} Bugün temposunu kendi ölçünde kurmak için uygun bir gün.`,
    advice: copy ? pick(copy.advice, n >>> 7) : "Günü kendi ölçünde tut.",
    avoidText: copy ? pick(copy.avoid, n >>> 11) : "Her şeyi aynı anda bitirme baskısını büyütme.",
    symbolicColor: sign.accentColor,
    symbolicNumber: (n % 9) + 1,
    ritual: copy ? pick(copy.rituals, n >>> 17) : "Bir dakika ayır: nefesini düzenle ve bugünün tek niyetini aklında tut.",
  };
}
