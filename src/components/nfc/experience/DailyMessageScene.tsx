"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FadeBodyReveal,
  LineStaggerReveal,
  MaskedHeadingReveal,
  OX_EASE,
  SceneLabelReveal,
} from "@/components/nfc/experience/Reveal";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  sign: ZodiacSign;
  headline: string;
  summary: string;
  advice: string;
  avoidText: string;
};

function splitAdvice(advice: string) {
  const parts = advice
    .split(/(?<=[.!?])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [advice];
}

/** Immersive editorial daily message — no dark rectangle card. */
export function DailyMessageScene({ summary, advice, avoidText }: Props) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.28 });
  const lines = splitAdvice(advice);

  return (
    <section
      id="ox-message"
      ref={ref}
      className="ox-scene ox-message ox-scene--nebula-a"
      aria-labelledby="ox-message-heading"
    >
      <SceneLabelReveal>Günün mesajı</SceneLabelReveal>

      <motion.div
        className="ox-message__divider"
        aria-hidden
        initial={reduced ? false : { scaleX: 0, opacity: 0.3 }}
        animate={inView || reduced ? { scaleX: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.7, delay: 0.08, ease: OX_EASE }}
        style={{ transformOrigin: "left center" }}
      >
        <span />
        <span className="ox-message__star" />
        <span />
      </motion.div>

      {reduced ? (
        <p id="ox-message-heading" className="ox-message__pull">
          {advice}
        </p>
      ) : lines.length > 1 ? (
        <div id="ox-message-heading">
          <LineStaggerReveal lines={lines} className="ox-message__pull" delay={0.18} stagger={0.1} />
        </div>
      ) : (
        <MaskedHeadingReveal className="ox-message__pull" as="p" delay={0.18}>
          <span id="ox-message-heading">{advice}</span>
        </MaskedHeadingReveal>
      )}

      <FadeBodyReveal delay={0.42} className="ox-body ox-message__support">
        {summary}
      </FadeBodyReveal>
      <FadeBodyReveal delay={0.55} className="ox-message__soft">
        {avoidText}
      </FadeBodyReveal>

      <motion.span
        className="ox-message__mark"
        aria-hidden
        initial={reduced ? false : { opacity: 0, scale: 0.6 }}
        animate={inView || reduced ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.7, ease: OX_EASE }}
      />
    </section>
  );
}
