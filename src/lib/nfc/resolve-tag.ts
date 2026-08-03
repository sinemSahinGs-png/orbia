import { DEMO_TAGS } from "./demo-tags";
import { getSignBySlug } from "@/lib/zodiac/signs";

export function resolveTag(code: string) {
  const normalized = code.trim().toUpperCase();
  const slug = DEMO_TAGS[normalized as keyof typeof DEMO_TAGS];

  return slug
    ? { ok: true as const, tag: { code: normalized, sign: getSignBySlug(slug)! } }
    : { ok: false as const, error: "Bu anahtar kodu bulunamadı." };
}
