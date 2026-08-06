"use client";

import { useState } from "react";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { formatIstanbulDate } from "@/lib/zodiac";
import { FadeBodyReveal, MaskedHeadingReveal, SceneLabelReveal } from "@/components/nfc/experience/Reveal";

type Props = {
  sign: ZodiacSign;
  headline: string;
  energy: number;
  moonPhase: string;
  dateKey: string;
};

const saveKey = (dateKey: string, slug: string) => `orbia-saved-${dateKey}-${slug}`;

/** Premium equal save / share controls — logic unchanged. */
export function DailyShareCard({ sign, headline, energy, moonPhase, dateKey }: Props) {
  const [saved, setSaved] = useState(false);

  const shareText = ["ORBIA", `${sign.nameTr} · ${formatIstanbulDate()}`, headline, `Yoğunluk ${energy} · ${moonPhase}`].join(
    "\n",
  );

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "ORBIA", text: shareText });
        return;
      }
    } catch {
      /* cancel */
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      /* ignore */
    }
  };

  const save = () => {
    try {
      localStorage.setItem(
        saveKey(dateKey, sign.slug),
        JSON.stringify({ date: dateKey, sign: sign.slug, energy, headline }),
      );
      setSaved(true);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id="ox-share" className="ox-scene ox-actions-bar" aria-labelledby="ox-share-heading">
      <SceneLabelReveal>Yanında tut</SceneLabelReveal>
      <MaskedHeadingReveal className="ox-heading" as="h2" delay={0.06}>
        <span id="ox-share-heading">Bugünü yanında tut.</span>
      </MaskedHeadingReveal>
      <FadeBodyReveal delay={0.14} className="ox-body">
        Günlük yorumunu kaydet veya tek dokunuşla paylaş.
      </FadeBodyReveal>
      <div className="ox-actions-bar__row">
        <button
          type="button"
          className={`ox-btn ox-btn--secondary ox-share-btn${saved ? " is-saved" : ""}`}
          onClick={save}
          disabled={saved}
          aria-live="polite"
        >
          <span className="ox-share-btn__icon" aria-hidden>
            {saved ? "✓" : "↓"}
          </span>
          {saved ? "Kaydedildi" : "Kaydet"}
        </button>
        <button type="button" className="ox-btn ox-btn--ghost ox-share-btn" onClick={() => void share()}>
          <span className="ox-share-btn__icon" aria-hidden>
            ↗
          </span>
          Paylaş
        </button>
      </div>
    </section>
  );
}
