"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { CountUp } from "@/components/home/visuals/CountUp";
import { astronomyLayerContent } from "@/content/home";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import {
  formatIstanbulDate,
  formatIstanbulShort,
  formatSignName,
  illuminationPercent,
} from "@/lib/zodiac";
import { EASE_OUT } from "@/lib/animation";

type Props = {
  astronomy: AstronomySnapshot | null;
};

export function AstronomyLayerSection({ astronomy }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "center center"],
  });

  const illum = astronomy ? astronomy.illumination : 0;
  const phaseReveal = useTransform(scrollYProgress, [0, 1], [0, illum]);
  const shadowX = useTransform(phaseReveal, (v) => 40 - v * 80);
  const labelOpacity = useTransform(scrollYProgress, [0.2, 0.55], [0, 1]);
  const parallax = useTransform(scrollYProgress, [0, 1], [16, -10]);

  const stale = !astronomy || astronomy.stale;
  const percent = astronomy ? illuminationPercent(astronomy.illumination) : 0;

  return (
    <section
      ref={sectionRef}
      id="astronomy-layer"
      className="ak-section ak-astro"
      aria-labelledby="astronomy-layer-heading"
    >
      <div className="ak-container ak-astro__layout">
        <SectionHeading
          id="astronomy-layer-heading"
          heading={astronomyLayerContent.heading}
          description={astronomyLayerContent.description}
        />

        {stale ? (
          <p className="ak-astro__fallback" role="status">
            {astronomyLayerContent.fallbackMessage}
          </p>
        ) : null}

        <div className="ak-astro__stage">
          <motion.div
            className="ak-astro__orbit-ring"
            style={reduced ? undefined : { y: parallax }}
            aria-hidden
          />

          <motion.div
            className="ak-astro__moon"
            aria-hidden={false}
            aria-label={
              astronomy
                ? `Ay fazı: ${astronomy.moonPhaseName}, yüzde ${percent} aydınlanma`
                : "Ay görseli"
            }
            initial={reduced ? false : { opacity: 0.4, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <svg viewBox="0 0 200 200" className="ak-astro__moon-svg">
              <defs>
                <radialGradient id="ak-moon-base" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#F2F0EA" />
                  <stop offset="55%" stopColor="#C8CAD0" />
                  <stop offset="100%" stopColor="#6E7380" />
                </radialGradient>
                <mask id="ak-moon-illum">
                  <rect width="200" height="200" fill="black" />
                  <circle cx="100" cy="100" r="78" fill="white" />
                  {reduced ? (
                    <circle
                      cx={100 + (40 - illum * 80)}
                      cy="100"
                      r="78"
                      fill="black"
                    />
                  ) : (
                    <motion.circle
                      cy="100"
                      r="78"
                      fill="black"
                      style={{ cx: shadowX }}
                    />
                  )}
                </mask>
              </defs>
              <circle cx="100" cy="100" r="78" fill="rgba(20,24,36,0.95)" />
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="url(#ak-moon-base)"
                mask="url(#ak-moon-illum)"
              />
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="rgba(183,161,106,0.28)"
                strokeWidth="1"
              />
            </svg>
            <span className="ak-astro__point ak-astro__point--a" />
            <span className="ak-astro__point ak-astro__point--b" />
            <span className="ak-astro__point ak-astro__point--c" />
          </motion.div>

          <motion.ul
            className="ak-astro__labels"
            style={reduced ? undefined : { opacity: labelOpacity }}
          >
            <li>
              <span>Ay fazı</span>
              <strong>{astronomy?.moonPhaseName ?? "—"}</strong>
            </li>
            <li>
              <span>Aydınlanma</span>
              <strong>
                {astronomy ? (
                  <>
                    %<CountUp value={percent} />
                  </>
                ) : (
                  "—"
                )}
              </strong>
            </li>
            <li>
              <span>Ay yaşı</span>
              <strong>
                {astronomy ? `${astronomy.moonAgeDays.toFixed(1)} gün` : "—"}
              </strong>
            </li>
            <li>
              <span>Ay burcu</span>
              <strong>
                {astronomy ? formatSignName(astronomy.moonTropicalSign) : "—"}
              </strong>
            </li>
            <li>
              <span>Sonraki dolunay</span>
              <strong>
                {astronomy?.nextFullMoon
                  ? formatIstanbulShort(astronomy.nextFullMoon)
                  : "—"}
              </strong>
            </li>
            <li>
              <span>Sonraki yeni ay</span>
              <strong>
                {astronomy?.nextNewMoon
                  ? formatIstanbulShort(astronomy.nextNewMoon)
                  : "—"}
              </strong>
            </li>
            <li>
              <span>Tarih</span>
              <strong>
                {astronomy ? formatIstanbulDate(astronomy.dateKey) : "—"}
              </strong>
            </li>
            <li>
              <span>Saat dilimi</span>
              <strong>Europe/Istanbul</strong>
            </li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
