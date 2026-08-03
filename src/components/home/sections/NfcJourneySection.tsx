"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
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
          stroke="rgba(183,161,106,0.75)"
          strokeWidth={1.2}
          initial={false}
          animate={
            reduced || !active
              ? { opacity: active ? 0.6 : 0.18, pathLength: active ? 1 : 0.4 }
              : { opacity: [0.18, 0.85, 0.18], pathLength: [0.35, 1, 0.35] }
          }
          transition={
            reduced || !active
              ? { duration: 0.35 }
              : { duration: 2.2, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </svg>
  );
}

function NfcPhoneVisual({
  activeStep,
  progress,
}: {
  activeStep: number;
  progress: number | MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const isNfc = activeStep === 2;

  return (
    <div className="ak-nfc__phone" aria-hidden>
      <div className="ak-nfc__phone-frame">
        <div className="ak-nfc__phone-screen">
          <motion.div
            className="ak-nfc__phone-pulse"
            animate={
              reduced
                ? { opacity: isNfc ? 0.55 : 0.2, scale: 1 }
                : isNfc
                  ? { opacity: [0.25, 0.85, 0.25], scale: [0.92, 1.08, 0.92] }
                  : { opacity: 0.2, scale: 1 }
            }
            transition={
              isNfc && !reduced
                ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          />
          <span className="ak-nfc__phone-label">
            {nfcJourneyContent.steps[activeStep]?.title ?? ""}
          </span>
        </div>
      </div>
      <div className="ak-nfc__phone-path">
        <svg viewBox="0 0 12 160" fill="none" preserveAspectRatio="none">
          <path d="M6 4 V156" stroke="rgba(215,217,223,0.16)" strokeWidth="1" />
          <motion.path
            d="M6 4 V156"
            stroke="rgba(183,161,106,0.9)"
            strokeWidth="1.6"
            strokeLinecap="round"
            style={
              typeof progress === "number"
                ? { pathLength: progress }
                : { pathLength: progress }
            }
          />
        </svg>
      </div>
    </div>
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
      <div className="ak-container ak-nfc__grid">
        <div className="ak-nfc__sticky">
          <SectionHeading
            id="nfc-journey-heading"
            heading={nfcJourneyContent.heading}
            description={nfcJourneyContent.description}
          />
          <div className="ak-nfc__hero-visual">
            <NfcPhoneVisual
              activeStep={active}
              progress={reduced ? 1 : pathLength}
            />
          </div>
        </div>

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
