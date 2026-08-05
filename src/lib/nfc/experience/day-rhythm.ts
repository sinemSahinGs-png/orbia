import type { DailyReading } from "@/lib/astrology/daily-reading-engine";

export type DayRhythmSlot = {
  id: "sabah" | "ogle" | "aksam";
  label: string;
  message: string;
};

/** Cautious day-rhythm guidance derived from existing reading scores. */
export function buildDayRhythm(reading: DailyReading): DayRhythmSlot[] {
  const focus = reading.focusScore;
  const social = reading.socialScore;
  const emotional = reading.emotionalScore;

  return [
    {
      id: "sabah",
      label: "Sabah",
      message:
        focus >= 70
          ? "Dağıtmadan önce yönünü netleştir."
          : "Güne tek bir niyetle başlamak temposunu sakinleştirir.",
    },
    {
      id: "ogle",
      label: "Öğleden sonra",
      message:
        social >= 70
          ? "İletişimde hız yerine açıklık işe yarayabilir."
          : "Konuşmadan önce kısa bir mola, alanı daha net hale getirebilir.",
    },
    {
      id: "aksam",
      label: "Akşam",
      message:
        emotional >= 70
          ? "Günün etkisini sakin bir alanda değerlendirmek iyi gelebilir."
          : "Karar vermeden önce gözlem için küçük bir alan açmak dengeli hissettirebilir.",
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
