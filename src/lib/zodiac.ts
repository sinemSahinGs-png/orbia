import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/zodiac/signs";

export function formatSignName(sign: ZodiacSign | string): string {
  if (typeof sign === "string") {
    return ZODIAC_SIGNS.find((s) => s.slug === sign)?.nameTr ?? sign;
  }
  return sign.nameTr;
}

export function formatIstanbulDate(date: Date | string = new Date()): string {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatIstanbulShort(iso: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function illuminationPercent(value: number): number {
  return Math.round(Math.min(1, Math.max(0, value)) * 100);
}
