"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import { getSignBySlug } from "@/lib/zodiac/signs";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  astronomy: AstronomySnapshot;
};

function formatIsoDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      day: "numeric",
      month: "long",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function MoonAstronomyScene({ astronomy }: Props) {
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const shadowShift = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-8, 10]);
  const moonSign = getSignBySlug(astronomy.moonTropicalSign);
  const illum = Math.min(1, Math.max(0, astronomy.illumination));
  const baseOffset = (0.5 - illum) * 36;
  const maskCx = useTransform(shadowShift, (x) => 50 + baseOffset + x * 0.35);

  if (astronomy.stale && !astronomy.moonPhaseName) {
    return (
      <section className="ox-scene ox-moon" aria-labelledby="ox-moon-heading">
        <p className="ox-eyebrow">Ay ve gökyüzü</p>
        <h2 id="ox-moon-heading" className="scene-title">
          Ay
        </h2>
        <p className="scene-body">Gökyüzü verisi güncelleniyor.</p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="ox-scene ox-moon" aria-labelledby="ox-moon-heading">
      <p className="ox-eyebrow">Ay ve gökyüzü</p>
      <h2 id="ox-moon-heading" className="scene-title">
        {astronomy.moonPhaseName}
      </h2>

      <div className="ox-moon__layout">
        <div className="ox-moon__disc-wrap">
          <svg className="ox-moon__disc" viewBox="0 0 100 100" aria-hidden focusable="false">
            <defs>
              <radialGradient id="ox-moon-glow" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="rgba(243,240,232,0.95)" />
                <stop offset="55%" stopColor="rgba(200,204,214,0.55)" />
                <stop offset="100%" stopColor="rgba(14,22,40,0.9)" />
              </radialGradient>
              <mask id="ox-moon-phase">
                <rect width="100" height="100" fill="#000" />
                <circle cx="50" cy="50" r="32" fill="#fff" />
                <motion.circle cx={maskCx} cy="50" r="32" fill="#000" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(200,204,214,0.12)" strokeWidth="0.35" />
            <circle cx="50" cy="50" r="32" fill="url(#ox-moon-glow)" mask="url(#ox-moon-phase)" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(243,240,232,0.2)" strokeWidth="0.4" />
          </svg>
        </div>

        <dl className="ox-moon__facts">
          <div>
            <dt>Aydınlanma</dt>
            <dd>{Math.round(illum * 100)}%</dd>
          </div>
          <div>
            <dt>Ay yaşı</dt>
            <dd>{astronomy.moonAgeDays.toFixed(1)} gün</dd>
          </div>
          <div>
            <dt>Ay burcu</dt>
            <dd>{moonSign?.nameTr ?? astronomy.moonTropicalSign}</dd>
          </div>
          <div>
            <dt>Sonraki dolunay</dt>
            <dd>{formatIsoDate(astronomy.nextFullMoon)}</dd>
          </div>
        </dl>
      </div>

      <p className="ox-moon__meta">
        Europe/Istanbul · {astronomy.dateKey}
        {astronomy.stale ? " · önbellek" : ""}
      </p>
    </section>
  );
}
