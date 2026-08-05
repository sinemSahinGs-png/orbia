"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { LivingCore } from "@/components/nfc/experience/LivingCore";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { formatIstanbulDate } from "@/lib/zodiac";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  sign: ZodiacSign;
  moonPhase: string;
  headline: string;
  energy: number;
  emotional: number;
  focus: number;
  social: number;
};

const HINTS: Record<string, string> = {
  Duygu: "İç dünyanın bugünkü temposu",
  Odak: "Dikkatini tek noktaya toplama hali",
  Sosyal: "İlişki ve paylaşım açıklığı",
};

function metricLabel(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return String(Math.round(value));
}

export function DailyPulseScene({
  sign,
  moonPhase,
  headline,
  energy,
  emotional,
  focus,
  social,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState<"emotional" | "focus" | "social" | null>(null);

  const rows = [
    { key: "emotional" as const, label: "Duygu", value: emotional },
    { key: "focus" as const, label: "Odak", value: focus },
    { key: "social" as const, label: "Sosyal", value: social },
  ];

  return (
    <>
      <section ref={ref} className="ox-hero" aria-labelledby="ox-pulse-heading">
        <div className="ox-hero__glow" aria-hidden />

        <div className="ox-hero__content">
          <motion.p
            className="ox-hero__brand"
            initial={reduced ? false : { letterSpacing: "0.18em" }}
            animate={inView ? { letterSpacing: "0.14em" } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            ORBIA
          </motion.p>
          <motion.p
            className="ox-hero__date"
            initial={reduced ? false : { y: 6 }}
            animate={inView ? { y: 0 } : undefined}
            transition={{ duration: 0.85, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {formatIstanbulDate()}
            <span className="ox-status__sep" aria-hidden>
              ·
            </span>
            {moonPhase}
          </motion.p>

          <motion.h1
            className="ox-sign-name"
            initial={reduced ? false : { y: 10 }}
            animate={inView ? { y: 0 } : undefined}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {sign.nameTr}
          </motion.h1>

          <p id="ox-pulse-heading" className="ox-hero__msg">
            {headline}
          </p>

          <LivingCore mode="hero" energy={energy} label={`Bugünün yoğunluğu ${energy}`} className="ox-hero__core" />

          <a href="#ox-signal" className="ox-btn ox-btn--secondary ox-hero__cta">
            Bugünün sinyalini aç
          </a>
        </div>
      </section>

      <section id="ox-signal" className="ox-scene ox-signal ox-scene--nebula-a" aria-label="Günün üç değeri">
        <p className="ox-kicker">Günün üç değeri</p>
        <h2 className="ox-heading">Yoğunluğun katmanları</h2>

        <LivingCore
          mode="metrics"
          metrics={{ emotional, focus, social }}
          activeMetric={active}
          className="ox-signal__core"
        />

        <ul className="ox-signal__list">
          {rows.map((row) => (
            <li key={row.key}>
              <button
                type="button"
                className={`ox-signal__row${active === row.key ? " is-on" : ""}`}
                onClick={() => setActive((v) => (v === row.key ? null : row.key))}
                aria-expanded={active === row.key}
              >
                <span className="ox-signal__label">{row.label}</span>
                <strong className="ox-signal__value">{metricLabel(row.value)}</strong>
              </button>
              {active === row.key ? <p className="ox-signal__hint">{HINTS[row.label]}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
