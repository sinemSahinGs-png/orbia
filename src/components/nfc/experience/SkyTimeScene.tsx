"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import type { DailyReading } from "@/lib/astrology/daily-reading-engine";
import { buildDayRhythm, currentRhythmId } from "@/lib/nfc/experience/day-rhythm";
import { getSignBySlug } from "@/lib/zodiac/signs";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { LivingCore } from "@/components/nfc/experience/LivingCore";

type Props = {
  astronomy: AstronomySnapshot;
  reading: DailyReading;
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

const CRITICAL_XY: Record<string, { x: number; y: number }> = {
  sabah: { x: 48, y: 18 },
  ogle: { x: 160, y: 26 },
  aksam: { x: 280, y: 18 },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Merged moon + day-critical timeline scene. */
export function SkyTimeScene({ astronomy, reading }: Props) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shadow = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-5, 6]);
  const illum = Math.min(1, Math.max(0, astronomy.illumination));
  const base = (0.5 - illum) * 34;
  const maskCx = useTransform(shadow, (x) => 50 + base + x * 0.3);
  const moonSign = getSignBySlug(astronomy.moonTropicalSign);

  const slots = buildDayRhythm(reading);
  const critical = useMemo(() => {
    const scores = [
      { id: "sabah" as const, v: reading.focusScore },
      { id: "ogle" as const, v: reading.socialScore },
      { id: "aksam" as const, v: reading.emotionalScore },
    ];
    return scores.sort((a, b) => b.v - a.v)[0].id;
  }, [reading]);
  const [active, setActive] = useState(currentRhythmId);
  const current = slots.find((s) => s.id === active) ?? slots[0];
  const star = CRITICAL_XY[critical] ?? CRITICAL_XY.ogle;

  return (
    <section ref={ref} className="ox-scene ox-sky ox-scene--nebula-c" aria-labelledby="ox-sky-heading">
      <motion.p
        className="ox-kicker"
        initial={reduced ? false : { letterSpacing: "0.12em" }}
        whileInView={{ letterSpacing: "0.06em" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        Ay ve zaman
      </motion.p>
      <h2 id="ox-sky-heading" className="ox-heading">
        {astronomy.moonPhaseName || "Gökyüzü"}
      </h2>

      <div className="ox-sky__top">
        <div className="ox-sky__moon">
          <LivingCore mode="eclipse" className="ox-sky__eclipse" />
          <svg className="ox-sky__disc" viewBox="0 0 100 100" aria-hidden>
            <defs>
              <mask id="ox-sky-mask">
                <rect width="100" height="100" fill="#000" />
                <circle cx="50" cy="50" r="30" fill="#fff" />
                <motion.circle cx={maskCx} cy="50" r="30" fill="#000" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="30" fill="rgba(238,233,244,0.9)" mask="url(#ox-sky-mask)" />
          </svg>
        </div>
        <dl className="ox-sky__facts">
          <div>
            <dt>Aydınlanma</dt>
            <dd>{Math.round(illum * 100)}%</dd>
          </div>
          <div>
            <dt>Ay burcu</dt>
            <dd>{moonSign?.nameTr ?? astronomy.moonTropicalSign}</dd>
          </div>
          <div className="ox-sky__facts-wide">
            <dt>Sonraki dolunay</dt>
            <dd>{formatIsoDate(astronomy.nextFullMoon)}</dd>
          </div>
        </dl>
      </div>

      <div className="ox-sky__timeline" aria-label="Gün içi zaman">
        <svg className="ox-sky__arc" viewBox="0 0 320 56" aria-hidden>
          <motion.path
            d="M12 40 Q 90 8, 160 26 T 308 16"
            fill="none"
            stroke="rgba(201,182,232,0.4)"
            strokeWidth="1.25"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.05, ease: EASE }}
          />
          <motion.circle
            cx={star.x}
            cy={star.y}
            r="4.5"
            fill="var(--sign-primary)"
            initial={reduced ? false : { opacity: 0.95, cx: 12, cy: 40 }}
            whileInView={{ opacity: 0.95, cx: star.x, cy: star.y }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, delay: 0.35, ease: EASE }}
          />
          <motion.circle
            cx={star.x}
            cy={star.y}
            r="8"
            fill="none"
            stroke="var(--sign-primary)"
            strokeOpacity="0.35"
            initial={reduced ? false : { opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
        </svg>
        <div className="ox-sky__nodes" role="tablist">
          {slots.map((slot, i) => (
            <motion.button
              key={slot.id}
              type="button"
              role="tab"
              aria-selected={slot.id === active}
              className={`ox-sky__node${slot.id === active ? " is-on" : ""}${slot.id === critical ? " is-critical" : ""}`}
              onClick={() => setActive(slot.id)}
              initial={reduced ? false : { y: 6 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 + i * 0.07, duration: 0.55, ease: EASE }}
            >
              <span aria-hidden />
              {slot.label}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={current.id}
            className="ox-sky__note"
            role="tabpanel"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {current.message}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
