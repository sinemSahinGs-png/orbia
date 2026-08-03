import {
  Body,
  Ecliptic,
  GeoVector,
  MoonPhase,
  SearchMoonPhase,
  SunPosition,
} from "astronomy-engine";
import { ZODIAC_SIGNS } from "@/lib/zodiac/signs";

export type AstronomySnapshot = {
  dateKey: string;
  timezone: "Europe/Istanbul";
  moonPhaseName: string;
  illumination: number;
  moonAgeDays: number;
  moonEclipticLongitude: number;
  moonTropicalSign: string;
  nextNewMoon: string;
  nextFullMoon: string;
  sunEclipticLongitude: number;
  stale: boolean;
};

const cache = new Map<string, AstronomySnapshot>();

const key = (v: Date | string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(v));

const moonPhaseName = (phase: number): string => {
  if (phase < 22.5 || phase >= 337.5) return "Yeni Ay";
  if (phase < 67.5) return "Büyüyen Hilal";
  if (phase < 112.5) return "İlkdörün";
  if (phase < 157.5) return "Büyüyen Şişkin Ay";
  if (phase < 202.5) return "Dolunay";
  if (phase < 247.5) return "Küçülen Şişkin Ay";
  if (phase < 292.5) return "Sondörün";
  return "Küçülen Hilal";
};

export function getAstronomyForDate(input: Date | string): AstronomySnapshot {
  const dateKey = key(input);
  const cached = cache.get(dateKey);
  if (cached) return cached;

  try {
    const date = new Date(input);
    const phase = MoonPhase(date);
    const moonLon = Ecliptic(GeoVector(Body.Moon, date, true)).elon;
    const nextNew = SearchMoonPhase(0, date, 35);
    const nextFull = SearchMoonPhase(180, date, 35);

    const value: AstronomySnapshot = {
      dateKey,
      timezone: "Europe/Istanbul",
      moonPhaseName: moonPhaseName(phase),
      illumination: (1 - Math.cos((phase * Math.PI) / 180)) / 2,
      moonAgeDays: (phase / 360) * 29.53059,
      moonEclipticLongitude: moonLon,
      moonTropicalSign: ZODIAC_SIGNS[Math.floor(moonLon / 30)]?.slug ?? "koc",
      nextNewMoon: nextNew?.date.toISOString() ?? "",
      nextFullMoon: nextFull?.date.toISOString() ?? "",
      sunEclipticLongitude: SunPosition(date).elon,
      stale: false,
    };

    cache.set(dateKey, value);
    return value;
  } catch {
    const fallback = Array.from(cache.values()).at(-1);
    if (fallback) return { ...fallback, dateKey, stale: true };
    return {
      dateKey,
      timezone: "Europe/Istanbul",
      moonPhaseName: "Yeni Ay",
      illumination: 0,
      moonAgeDays: 0,
      moonEclipticLongitude: 0,
      moonTropicalSign: "koc",
      nextNewMoon: "",
      nextFullMoon: "",
      sunEclipticLongitude: 0,
      stale: true,
    };
  }
}
