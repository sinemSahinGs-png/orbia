"use client";

import { motion } from "framer-motion";
import { LivingCore } from "@/components/nfc/experience/LivingCore";
import { OX_EASE } from "@/components/nfc/experience/Reveal";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { formatIstanbulDate } from "@/lib/zodiac";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  sign: ZodiacSign;
  moonPhase: string;
  headline: string;
  energy: number;
};

/** Cinematic daily opening — no chips, no tabs. */
export function DailyPulseScene({ sign, moonPhase, headline, energy }: Props) {
  const reduced = useReducedMotionSafe();

  return (
    <section id="ox-today" className="ox-hero" aria-labelledby="ox-pulse-heading">
      <div className="ox-hero__glow" aria-hidden />
      <div className="ox-hero__dust" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="ox-hero__content">
        <motion.p
          className="ox-hero__brand"
          initial={reduced ? false : { opacity: 0, y: -12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: reduced ? 0 : 0.08, ease: OX_EASE }}
        >
          ORBIA
        </motion.p>

        <motion.p
          className="ox-hero__date"
          initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: reduced ? 0 : 0.22, ease: OX_EASE }}
        >
          {formatIstanbulDate()}
          <span className="ox-status__sep" aria-hidden>
            ·
          </span>
          {moonPhase}
        </motion.p>

        {reduced ? (
          <h1 className="ox-sign-name">{sign.nameTr}</h1>
        ) : (
          <motion.h1
            className="ox-sign-name"
            initial={{ opacity: 0, y: 24, filter: "blur(12px)", clipPath: "inset(0 0 80% 0)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.95, delay: 0.38, ease: OX_EASE }}
          >
            {sign.nameTr}
          </motion.h1>
        )}

        <motion.p
          id="ox-pulse-heading"
          className="ox-hero__msg"
          initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, delay: reduced ? 0 : 0.62, ease: OX_EASE }}
        >
          {headline}
        </motion.p>

        <motion.div
          className="ox-hero__core-wrap"
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: reduced ? 0 : 0.75, ease: OX_EASE }}
        >
          <LivingCore
            mode="hero"
            energy={energy}
            label={`Bugünün yoğunluğu ${energy}`}
            className="ox-hero__core"
          />
        </motion.div>

        <motion.div
          className="ox-hero__cue"
          aria-hidden
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.5, delay: reduced ? 0 : 1.7, ease: OX_EASE }}
        >
          <span className="ox-hero__cue-line" />
          <span className="ox-hero__cue-label">Kaydır</span>
        </motion.div>
      </div>
    </section>
  );
}
