import { DAILY_SIGN_COPY } from "@/content/daily-sign-copy";
import type { DailyReading } from "@/lib/astrology/daily-reading-engine";

export type DayRhythmSlot = {
  id: "sabah" | "ogle" | "aksam";
  label: string;
  message: string;
};

/** Sign-specific day-rhythm; high/low variant follows existing score thresholds. */
export function buildDayRhythm(reading: DailyReading, signSlug?: string): DayRhythmSlot[] {
  const copy = signSlug ? DAILY_SIGN_COPY[signSlug] : undefined;
  const pick = (pair: [string, string] | undefined, high: boolean, fallback: string) =>
    pair ? pair[high ? 0 : 1] : fallback;

  return [
    {
      id: "sabah",
      label: "Sabah",
      message: pick(
        copy?.rhythm.sabah,
        reading.focusScore >= 70,
        reading.focusScore >= 70
          ? "Dağıtmadan önce yönünü netleştir."
          : "Güne tek bir niyetle başlamak temposunu sakinleştirir.",
      ),
    },
    {
      id: "ogle",
      label: "Öğleden sonra",
      message: pick(
        copy?.rhythm.ogle,
        reading.socialScore >= 70,
        reading.socialScore >= 70
          ? "İletişimde hız yerine açıklık işe yarayabilir."
          : "Konuşmadan önce kısa bir mola, alanı daha net hale getirebilir.",
      ),
    },
    {
      id: "aksam",
      label: "Akşam",
      message: pick(
        copy?.rhythm.aksam,
        reading.emotionalScore >= 70,
        reading.emotionalScore >= 70
          ? "Günün etkisini sakin bir alanda değerlendirmek iyi gelebilir."
          : "Karar vermeden önce gözlem için küçük bir alan açmak dengeli hissettirebilir.",
      ),
    },
  ];
}

export function currentRhythmId(date = new Date()): DayRhythmSlot["id"] {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      hour: "numeric",
      hour12: false,
    }).format(date),
  );
  if (hour < 12) return "sabah";
  if (hour < 18) return "ogle";
  return "aksam";
}
