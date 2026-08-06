"use client";

import { useMemo } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { MagneticButton } from "@/components/animation/MagneticButton";
import { finalCtaContent } from "@/content/home";
import { EASE_OUT } from "@/lib/animation";

export function FinalCelestialCta() {
  const reduced = useReducedMotion();
  const points = useMemo(
    () => [
      [18, 62],
      [32, 28],
      [48, 44],
      [58, 18],
      [72, 36],
      [84, 58],
      [40, 72],
      [66, 78],
    ],
    [],
  );
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [2, 6],
    [4, 7],
  ];

  return (
    <section
      id="final-cta"
      className="ak-section ak-final"
      aria-labelledby="final-cta-heading"
    >
      <div className="ak-final__glow" aria-hidden />
      <div className="ak-final__constellation" aria-hidden>
        <div className="ak-final__ring" />
        <svg viewBox="0 0 100 100" className="ak-final__svg">
          {links.map(([a, b], i) => {
            const p1 = points[a];
            const p2 = points[b];
            return (
              <motion.line
                key={`l-${i}`}
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="rgba(215,217,223,0.22)"
                strokeWidth={0.5}
                initial={reduced ? { opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: reduced ? 0 : 0.35 + i * 0.08 }}
              />
            );
          })}
          {points.map(([x, y], i) => (
            <motion.circle
              key={`p-${i}`}
              cx={x}
              cy={y}
              r={1.2}
              fill="rgba(255,26,140,0.55)"
              initial={reduced ? { opacity: 0.8 } : { opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 0.8, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.07 }}
            />
          ))}
        </svg>
      </div>

      <div className="ak-container ak-final__content">
        <motion.h2
          id="final-cta-heading"
          className="ak-heading"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {finalCtaContent.heading.map((line) => (
            <span key={line} className="ak-heading__line">
              {line}
            </span>
          ))}
        </motion.h2>
        <motion.p
          className="ak-body"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {finalCtaContent.description}
        </motion.p>

        <div className="ak-final__actions">
          <div className="ak-final__pulse-wrap">
            {!reduced ? <span className="ak-final__nfc-pulse" aria-hidden /> : null}
            <MagneticButton href={finalCtaContent.primary.href} className="ak-cta-primary ak-final__primary">
              {finalCtaContent.primary.label}
            </MagneticButton>
          </div>
          <MagneticButton href={finalCtaContent.secondary.href} className="cine-btn--ghost">
            {finalCtaContent.secondary.label}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
