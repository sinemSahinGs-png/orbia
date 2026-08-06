"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
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

const MOON_SRC = "/images/astronomy/moon.webp";

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

  const illum = astronomy ? astronomy.illumination : 0.45;
  const phaseReveal = useTransform(
    scrollYProgress,
    [0, 1],
    [0.18, Math.max(0.22, illum)],
  );
  const shadowPos = useTransform(phaseReveal, (v) => `${46 - v * 88}%`);
  const shadowBg = useTransform(
    shadowPos,
    (x) =>
      `radial-gradient(circle at ${x} 48%, transparent 38%, rgba(2,3,8,0.5) 56%, rgba(2,3,8,0.94) 72%)`,
  );
  const labelOpacity = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const parallax = useTransform(scrollYProgress, [0, 1], [14, -12]);
  const moonRotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-3, 3]);

  const stale = !astronomy || astronomy.stale;
  const percent = astronomy ? illuminationPercent(astronomy.illumination) : 0;
  const staticShadow = `radial-gradient(circle at ${46 - illum * 88}% 48%, transparent 38%, rgba(2,3,8,0.5) 56%, rgba(2,3,8,0.94) 72%)`;

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
            aria-label={
              astronomy
                ? `Ay fazı: ${astronomy.moonPhaseName}, yüzde ${percent} aydınlanma`
                : "Ay görseli"
            }
            initial={reduced ? false : { opacity: 0.35, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1, ease: EASE_OUT }}
            style={reduced ? undefined : { rotate: moonRotate, y: parallax }}
          >
            <div className="ak-astro__moon-disk">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MOON_SRC}
                alt=""
                width={800}
                height={800}
                className="ak-astro__moon-photo"
                decoding="async"
              />
              <MoonShadow
                reduced={!!reduced}
                staticShadow={staticShadow}
                shadowBg={shadowBg}
              />
              <span className="ak-astro__moon-rim" aria-hidden />
            </div>
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
                {astronomy ? formatIstanbulDate(astronomy.dateKey) : formatIstanbulDate()}
              </strong>
            </li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function MoonShadow({
  reduced,
  staticShadow,
  shadowBg,
}: {
  reduced: boolean;
  staticShadow: string;
  shadowBg: MotionValue<string>;
}) {
  if (reduced) {
    return (
      <div
        className="ak-astro__moon-shadow"
        style={{ background: staticShadow }}
        aria-hidden
      />
    );
  }
  return (
    <motion.div
      className="ak-astro__moon-shadow"
      style={{ background: shadowBg }}
      aria-hidden
    />
  );
}
