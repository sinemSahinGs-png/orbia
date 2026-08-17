"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { DailyReading } from "@/lib/astrology/daily-reading-engine";
import { buildDayRhythm, currentRhythmId } from "@/lib/nfc/experience/day-rhythm";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  reading: DailyReading;
  signSlug?: string;
};

export function DayRhythmScene({ reading, signSlug }: Props) {
  const slots = buildDayRhythm(reading, signSlug);
  const critical = useMemo(() => {
    const scores = [
      { id: "sabah" as const, v: reading.focusScore },
      { id: "ogle" as const, v: reading.socialScore },
      { id: "aksam" as const, v: reading.emotionalScore },
    ];
    return scores.sort((a, b) => b.v - a.v)[0].id;
  }, [reading]);
  const [active, setActive] = useState(currentRhythmId);
  const reduced = useReducedMotionSafe();
  const current = slots.find((s) => s.id === active) ?? slots[0];
  const criticalLabel = slots.find((s) => s.id === critical)?.label ?? "Öğleden sonra";

  return (
    <section className="ox-scene ox-rhythm" aria-labelledby="ox-rhythm-heading">
      <p className="ox-eyebrow">Kritik zaman</p>
      <h2 id="ox-rhythm-heading" className="scene-title">
        Gün içi aralık
      </h2>
      <p className="scene-body ox-rhythm__lead">
        Bugün en belirgin aralık: <span>{criticalLabel}</span>.
      </p>

      <div className="ox-rhythm__track">
        <svg className="ox-rhythm__curve" viewBox="0 0 360 48" aria-hidden focusable="false">
          <motion.path
            d="M8 34 Q 90 6, 180 24 T 352 14"
            fill="none"
            stroke="rgba(200,155,74,0.4)"
            strokeWidth="1.2"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="ox-rhythm__nodes" role="tablist" aria-label="Günün bölümleri">
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              role="tab"
              aria-selected={slot.id === active}
              className={`ox-rhythm__node${slot.id === active ? " is-active" : ""}${slot.id === critical ? " is-critical" : ""}`}
              onClick={() => setActive(slot.id)}
            >
              <span aria-hidden />
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={current.id}
          className="ox-rhythm__copy"
          role="tabpanel"
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28 }}
        >
          {current.message}
        </motion.p>
      </AnimatePresence>
    </section>
  );
}
