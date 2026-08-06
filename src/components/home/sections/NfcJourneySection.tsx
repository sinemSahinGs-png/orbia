"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { nfcJourneyContent } from "@/content/home";
import { EASE_OUT } from "@/lib/animation";

function NfcWave({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  return (
    <svg className="ak-nfc-wave" viewBox="0 0 80 40" aria-hidden focusable="false">
      {[12, 22, 32].map((r, i) => (
        <motion.path
          key={r}
          d={`M ${40 - r} 34 A ${r} ${r} 0 0 1 ${40 + r} 34`}
          fill="none"
          stroke="url(#ak-nfc-wave-grad)"
          strokeWidth={1.2}
          initial={false}
          animate={
            reduced || !active
              ? { opacity: active ? 0.7 : 0.2, pathLength: active ? 1 : 0.4 }
              : { opacity: [0.2, 0.95, 0.2], pathLength: [0.35, 1, 0.35] }
          }
          transition={
            reduced || !active
              ? { duration: 0.35 }
              : { duration: 2.2, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
      <defs>
        <linearGradient id="ak-nfc-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB0DE" />
          <stop offset="55%" stopColor="#FF4EC8" />
          <stop offset="100%" stopColor="#FF1493" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NfcJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 65%", "end 40%"],
  });
  const [active, setActive] = useState(0);
  const pathLength = useTransform(scrollYProgress, (v) => v);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      nfcJourneyContent.steps.length - 1,
      Math.max(0, Math.floor(v * nfcJourneyContent.steps.length)),
    );
    setActive((prev) => (prev === idx ? prev : idx));
  });

  return (
    <section
      ref={sectionRef}
      id="nfc-journey"
      className="ak-section ak-nfc"
      aria-labelledby="nfc-journey-heading"
    >
      <div className="ak-nfc__glow" aria-hidden />
      <div className="ak-container ak-nfc__grid ak-nfc__grid--steps-only">
        <SectionHeading
          id="nfc-journey-heading"
          heading={nfcJourneyContent.heading}
          description={nfcJourneyContent.description}
        />

        <div className="ak-nfc__steps-wrap">
          <div className="ak-nfc__rail" aria-hidden>
            <motion.span
              className="ak-nfc__rail-fill"
              style={reduced ? { scaleY: 1 } : { scaleY: pathLength }}
            />
          </div>
          <ol className="ak-nfc__steps">
            {nfcJourneyContent.steps.map((step, i) => {
              const isActive = active === i || !!reduced;
              return (
                <motion.li
                  key={step.n}
                  className={`ak-nfc__step${isActive ? " is-active" : ""}`}
                  initial={reduced ? false : { opacity: 0.4, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                  style={{ opacity: reduced ? 1 : isActive ? 1 : 0.42 }}
                >
                  <span className="ak-nfc__num">{step.n}</span>
                  <div className="ak-nfc__copy">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    {"nfc" in step && step.nfc ? (
                      <div className="ak-nfc__tap">
                        <NfcWave active={isActive && inView} />
                        {isActive && !reduced ? (
                          <motion.span
                            className="ak-nfc__tap-burst"
                            initial={{ scale: 0.6, opacity: 0.6 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
