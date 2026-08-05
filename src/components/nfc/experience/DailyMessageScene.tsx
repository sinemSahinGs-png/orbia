"use client";

import { motion } from "framer-motion";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  sign: ZodiacSign;
  headline: string;
  summary: string;
  advice: string;
  avoidText: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Message content must stay readable even if motion IO never fires.
 * Never gate copy behind opacity: 0 initial.
 */
export function DailyMessageScene({ summary, advice, avoidText }: Props) {
  const reduced = useReducedMotionSafe();

  return (
    <section className="ox-scene ox-message" aria-labelledby="ox-message-heading">
      <motion.p
        className="ox-kicker"
        initial={reduced ? false : { letterSpacing: "0.1em" }}
        whileInView={{ letterSpacing: "0.06em" }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Günün mesajı
      </motion.p>
      <div className="ox-message__layout">
        <span className="ox-message__rail" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <div className="ox-message__copy">
          <p id="ox-message-heading" className="ox-message__pull">
            {advice}
          </p>
          <p className="ox-body">{summary}</p>
          <p className="ox-message__soft">{avoidText}</p>
        </div>
      </div>
    </section>
  );
}
