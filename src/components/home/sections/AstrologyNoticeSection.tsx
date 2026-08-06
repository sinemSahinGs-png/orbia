"use client";

import { motion, useReducedMotion } from "framer-motion";
import { astrologyNoticeContent } from "@/content/home";
import { EASE_OUT } from "@/lib/animation";

export function AstrologyNoticeSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="astrology-notice"
      className="ak-section ak-notice"
      aria-labelledby="astrology-notice-heading"
    >
      <div className="ak-container">
        <motion.div
          className="ak-notice__panel"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.75, ease: EASE_OUT }}
        >
          <svg className="ak-notice__trace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <motion.rect
              x="0.5"
              y="0.5"
              width="99"
              height="99"
              fill="none"
              stroke="rgba(255,26,140,0.55)"
              strokeWidth="0.4"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduced ? 0 : 1.6, ease: EASE_OUT }}
            />
          </svg>

          <h2 id="astrology-notice-heading" className="ak-notice__title">
            {astrologyNoticeContent.heading.map((line) => (
              <span key={line} className="ak-notice__title-line">
                {line}
              </span>
            ))}
            <span className="ak-notice__shine" aria-hidden />
          </h2>

          <motion.p
            className="ak-notice__text"
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.9, ease: EASE_OUT, delay: 0.15 }}
          >
            {astrologyNoticeContent.text}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
