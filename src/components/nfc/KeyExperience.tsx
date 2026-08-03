"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import type { DailyReading } from "@/lib/astrology/daily-reading-engine";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import { PAIR_STORAGE_KEY, createPairSession } from "@/lib/nfc/pair-session";

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
  const [phase, setPhase] = useState(0);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const seen =
      localStorage.getItem(`astra-intro-${code}`) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = seen
      ? [setTimeout(() => setPhase(6), 0)]
      : [500, 1000, 1600, 2200, 2800, 3400].map((t, i) => setTimeout(() => setPhase(i + 1), t));
    localStorage.setItem(`astra-intro-${code}`, "1");
    return () => timers.forEach(clearTimeout);
  }, [code]);

  const pair = () => {
    const session = createPairSession(code, sign.slug);
    localStorage.setItem(PAIR_STORAGE_KEY, JSON.stringify(session));
    document.cookie = `${PAIR_STORAGE_KEY}=${encodeURIComponent(JSON.stringify(session))};max-age=600;path=/;samesite=lax`;
    setSkip(true);
  };

  const introLabels = [
    "",
    "Enerji uyanıyor",
    "Sembol çiziliyor",
    "Takımyıldız bağlanıyor",
    "Alan dengeleniyor",
    `${sign.nameTr} anahtarı`,
  ];

  if (phase < 6 && !skip) {
    return (
      <section className="key-intro">
        <button type="button" onClick={() => setPhase(6)}>
          Atla
        </button>
        <div className="key-stage">
          <span>{["", "·", "✧", "⌑", "◉", sign.nameTr][phase]}</span>
        </div>
        <p>{introLabels[phase]}</p>
      </section>
    );
  }

  return (
    <section className="astra-card">
      <p className="astra-eyebrow">
        {sign.nameTr.toUpperCase()} · {astronomy.moonPhaseName}
      </p>
      <h1>{reading.headline}</h1>
      <p>{reading.summary}</p>
      <div className="score-grid">
        {[
          ["Enerji", reading.energyScore],
          ["Duygu", reading.emotionalScore],
          ["Odak", reading.focusScore],
          ["Sosyal", reading.socialScore],
        ].map(([label, score]) => (
          <div key={String(label)}>
            <small>{label}</small>
            <strong>{score}</strong>
          </div>
        ))}
      </div>
      <p>
        <b>Bugünün notu:</b> {reading.advice}
      </p>
      <p className="astra-muted">
        Ay aydınlığı %{Math.round(astronomy.illumination * 100)} · Ay burcu {astronomy.moonTropicalSign}
        {astronomy.stale ? " · yedek veri" : ""}
      </p>
      <button type="button" className="astra-button" onClick={pair}>
        İkinci enerjiyi yaklaştır.
      </button>
      {skip && (
        <p>İkinci anahtarın NFC bağlantısını açın; uyum deneyimi hazır.</p>
      )}
      <p>
        <Link href="/uyum">Uyum deneyimine git</Link>
      </p>
    </section>
  );
}
