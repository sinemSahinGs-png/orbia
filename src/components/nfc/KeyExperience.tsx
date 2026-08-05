"use client";

import { NfcExperienceShell } from "@/components/nfc/experience/NfcExperienceShell";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import type { DailyReading } from "@/lib/astrology/daily-reading-engine";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";

/** NFC key experience entry — immersive celestial shell. */
export function KeyExperience({
  code,
  sign,
  reading,
  astronomy,
}: {
  code: string;
  sign: ZodiacSign;
  reading: DailyReading;
  astronomy: AstronomySnapshot;
}) {
  return (
    <NfcExperienceShell code={code} sign={sign} reading={reading} astronomy={astronomy} />
  );
}
