"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import type { DailyReading } from "@/lib/astrology/daily-reading-engine";
import { buildDayRhythm, currentRhythmId } from "@/lib/nfc/experience/day-rhythm";
import { getSignBySlug } from "@/lib/zodiac/signs";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { LivingCore } from "@/components/nfc/experience/LivingCore";
import { CountUp } from "@/components/home/visuals/CountUp";
import { MaskedHeadingReveal, OX_EASE, SceneLabelReveal } from "@/components/nfc/experience/Reveal";

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

/** Moon + day rhythm — all three times visible; active auto-emphasized. */
export function SkyTimeScene({ astronomy, reading }: Props) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.22 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shadow = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-5, 6]);
  const illum = Math.min(1, Math.max(0, astronomy.illumination));
  const base = (0.5 - illum) * 34;
  const maskCx = useTransform(shadow, (x) => 50 + base + x * 0.3);
  const moonSign = getSignBySlug(astronomy.moonTropicalSign);
  const pct = Math.round(illum * 100);

  const slots = buildDayRhythm(reading);
  const active = currentRhythmId();
  const critical = useMemo(() => {
    const scores = [
      { id: "sabah" as const, v: reading.focusScore },
      { id: "ogle" as const, v: reading.socialScore },
      { id: "aksam" as const, v: reading.emotionalScore },
    ];
    return scores.sort((a, b) => b.v - a.v)[0].id;
  }, [reading]);
  const star = CRITICAL_XY[critical] ?? CRITICAL_XY.ogle;

  return (
    <section id="ox-sky" ref={ref} className="ox-scene ox-sky ox-scene--nebula-c" aria-labelledby="ox-sky-heading">
      <SceneLabelReveal>Ay ve gün ritmi</SceneLabelReveal>
      {reduced ? (
        <h2 id="ox-sky-heading" className="ox-heading">
          {astronomy.moonPhaseName || "Gökyüzü"}
        </h2>
      ) : (
        <MaskedHeadingReveal className="ox-heading" as="h2" delay={0.06}>
          <span id="ox-sky-heading">{astronomy.moonPhaseName || "Gökyüzü"}</span>
        </MaskedHeadingReveal>
      )}

      <div className="ox-sky__compose">
        <motion.div
          className="ox-sky__moon"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.85, delay: 0.12, ease: OX_EASE }}
        >
          <LivingCore mode="eclipse" className="ox-sky__eclipse" />
          <svg className="ox-sky__disc" viewBox="0 0 100 100" aria-hidden>
            <defs>
              <mask id="ox-sky-mask">
                <rect width="100" height="100" fill="#000" />
                <circle cx="50" cy="50" r="30" fill="#fff" />
                <motion.circle cx={maskCx} cy="50" r="30" fill="#000" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="30" fill="rgba(243,238,248,0.92)" mask="url(#ox-sky-mask)" />
            <circle cx="50" cy="50" r="31.5" fill="none" stroke="rgba(232,213,168,0.22)" strokeWidth="0.6" />
          </svg>
        </motion.div>

        <dl className="ox-sky__facts">
          <div>
            <dt>Aydınlanma</dt>
            <dd>
              {inView || reduced ? <CountUp value={pct} duration={0.85} suffix="%" /> : "0%"}
            </dd>
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

      <div className="ox-sky__timeline" aria-label="Gün içi ritim">
        <svg className="ox-sky__arc" viewBox="0 0 320 56" aria-hidden>
          <motion.path
            d="M12 40 Q 90 8, 160 26 T 308 16"
            fill="none"
            stroke="rgba(201,182,232,0.45)"
            strokeWidth="1.25"
            initial={reduced ? false : { pathLength: 0 }}
            animate={inView || reduced ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.05, ease: OX_EASE }}
          />
          <motion.circle
            cx={star.x}
            cy={star.y}
            r="4.5"
            fill="var(--sign-primary)"
            initial={reduced ? false : { opacity: 0 }}
            animate={inView || reduced ? { opacity: 0.95 } : undefined}
            transition={{ duration: 0.5, delay: 0.55, ease: OX_EASE }}
          />
          <motion.circle
            cx={star.x}
            cy={star.y}
            r="9"
            fill="none"
            stroke="var(--sign-primary)"
            strokeOpacity="0.35"
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={inView || reduced ? { opacity: 1, scale: 1 } : undefined}
            transition={{ delay: 0.7, duration: 0.5, ease: OX_EASE }}
            style={{ transformOrigin: `${star.x}px ${star.y}px` }}
          />
        </svg>

        <ul className="ox-sky__rhythm">
          {slots.map((slot, i) => (
            <motion.li
              key={slot.id}
              className={`ox-sky__slot${slot.id === active ? " is-on" : ""}${slot.id === critical ? " is-critical" : ""}`}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.45 + i * 0.1, duration: 0.5, ease: OX_EASE }}
            >
              <span className="ox-sky__slot-dot" aria-hidden />
              <span className="ox-sky__slot-lab">{slot.label}</span>
              <p className="ox-sky__slot-msg">{slot.message}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
