"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CountUp } from "@/components/home/visuals/CountUp";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { ZodiacGlyph } from "@/components/home/visuals/ZodiacGlyph";
import { dailySkyContent } from "@/content/home";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import { formatIstanbulDate, formatIstanbulShort, illuminationPercent } from "@/lib/zodiac";
import { getSignBySlug } from "@/lib/zodiac/signs";
import { EASE_OUT } from "@/lib/animation";

type Props = {
  astronomy: AstronomySnapshot | null;
};

function MoonPhaseIcon({ illumination }: { illumination: number }) {
  const offset = 28 - illumination * 56;
  return (
    <svg className="ak-sky__moon-svg" viewBox="0 0 56 56" aria-hidden focusable="false">
      <defs>
        <mask id="ak-sky-moon-mask">
          <rect width="56" height="56" fill="black" />
          <circle cx="28" cy="28" r="20" fill="white" />
          <circle cx={28 + offset} cy="28" r="20" fill="black" />
        </mask>
      </defs>
      <circle cx="28" cy="28" r="20" fill="rgba(215,217,223,0.16)" />
      <circle cx="28" cy="28" r="20" fill="rgba(242,240,234,0.9)" mask="url(#ak-sky-moon-mask)" />
    </svg>
  );
}

export function DailySkyExperienceSection({ astronomy }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbitY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [18, -18]);
  const panelY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -10]);

  const sample = dailySkyContent.sample;
  const sign = getSignBySlug(sample.signSlug);
  const illum = astronomy ? illuminationPercent(astronomy.illumination) : 0;
  const moonSign = astronomy
    ? getSignBySlug(astronomy.moonTropicalSign)?.nameTr ?? "—"
    : "—";

  const metrics = [
    { label: "Duygusal Akış", value: sample.emotional },
    { label: "Odak", value: sample.focus },
    { label: "Sosyal Enerji", value: sample.social },
  ];

  return (
    <section
      ref={sectionRef}
      id="daily-sky"
      className="ak-section ak-sky"
      aria-labelledby="daily-sky-heading"
    >
      <div className="ak-container">
        <SectionHeading
          id="daily-sky-heading"
          heading={dailySkyContent.heading}
          description={dailySkyContent.description}
        />

        <div className="ak-sky__stage">
          <motion.div className="ak-sky__orbit" style={{ y: orbitY }} aria-hidden />
          <motion.div className="ak-sky__bloom" style={{ y: panelY }} aria-hidden />

          <motion.div
            className="ak-sky__panel"
            style={{ y: panelY }}
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <div className="ak-sky__grain" aria-hidden />
            <div className="ak-sky__top">
              <p className="ak-sky__sign">{sample.signName}</p>
              <p className="ak-sky__date">
                {astronomy ? formatIstanbulDate(astronomy.dateKey) : formatIstanbulDate()}
              </p>
            </div>
            <p className="ak-sky__headline">{sample.headline}</p>

            <div className="ak-sky__energy">
              <div
                className="ak-sky__aura"
                style={{ ["--energy" as string]: sample.energy / 100 }}
                aria-hidden
              />
              {sign ? (
                <div className="ak-sky__glyph" aria-hidden>
                  <ZodiacGlyph
                    sign={sign}
                    size={64}
                    draw={!reduced}
                  />
                </div>
              ) : null}
              <div className="ak-sky__energy-copy">
                <span>ENERJİ</span>
                <strong>
                  <CountUp value={sample.energy} />
                  <em> / 100</em>
                </strong>
              </div>
            </div>

            <ul className="ak-sky__metrics">
              {metrics.map((m, i) => (
                <motion.li
                  key={m.label}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: reduced ? 0 : 0.2 + i * 0.12, duration: 0.5 }}
                >
                  <div className="ak-sky__metric-head">
                    <span>{m.label}</span>
                    <strong>
                      <CountUp value={m.value} />
                    </strong>
                  </div>
                  <div className="ak-sky__bar" role="presentation">
                    <motion.span
                      initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                      whileInView={{ scaleX: m.value / 100 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: reduced ? 0 : 0.95,
                        delay: 0.25 + i * 0.12,
                        ease: EASE_OUT,
                      }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="ak-sky__advice"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduced ? 0 : 0.55, duration: 0.6 }}
            >
              <p className="ak-eyebrow">Günün Tavsiyesi</p>
              <p>{sample.advice}</p>
            </motion.div>

            <motion.div
              className="ak-sky__moon-row"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduced ? 0 : 0.7, duration: 0.55 }}
            >
              <MoonPhaseIcon illumination={astronomy?.illumination ?? 0.45} />
              <div>
                <p>
                  <strong>{astronomy?.moonPhaseName ?? "—"}</strong>
                  {" · "}
                  %{illum || "—"} aydınlanma
                </p>
                <p className="ak-muted">
                  Ay burcu: {moonSign}
                  {astronomy?.nextFullMoon
                    ? ` · Dolunay: ${formatIstanbulShort(astronomy.nextFullMoon)}`
                    : ""}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
