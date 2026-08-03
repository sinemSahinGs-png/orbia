"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CountUp } from "@/components/home/visuals/CountUp";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { ConstellationSvg } from "@/components/home/visuals/ConstellationSvg";
import { pairingContent } from "@/content/home";
import { getZodiacCollectionItem } from "@/content/zodiac";
import { MagneticButton } from "@/components/animation/MagneticButton";
import { EASE_OUT } from "@/lib/animation";

export function PairingExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [connected, setConnected] = useState(!!reduced);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "center center"],
  });

  const aslan = getZodiacCollectionItem("aslan")!;
  const terazi = getZodiacCollectionItem("terazi")!;

  const leftX = useTransform(scrollYProgress, [0, 0.55], reduced ? [0, 0] : [-48, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.55], reduced ? [0, 0] : [48, 0]);
  const leftY = useTransform(scrollYProgress, [0, 0.55], reduced ? [0, 0] : [-28, 0]);
  const rightY = useTransform(scrollYProgress, [0, 0.55], reduced ? [0, 0] : [28, 0]);
  const coreScale = useTransform(scrollYProgress, [0, 0.6], [0.82, 1.12]);
  const coreOpacity = useTransform(scrollYProgress, [0, 0.45], [0.7, 1]);
  const metricsOpacity = useTransform(scrollYProgress, [0.25, 0.65], [0.55, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) {
      setConnected(true);
      return;
    }
    setConnected(v > 0.4);
  });

  const sample = pairingContent.sample;
  const metrics = [
    { label: "Bugünün Ortak Ritmi", value: sample.generalRhythm },
    { label: "İletişim", value: sample.communication },
    { label: "Duygusal Akış", value: sample.emotionalFlow },
    { label: "Hareket Enerjisi", value: sample.movementEnergy },
  ];

  return (
    <section
      ref={sectionRef}
      id="pairing"
      className="ak-section ak-pair"
      aria-labelledby="pairing-heading"
    >
      <div className="ak-container">
        <SectionHeading
          id="pairing-heading"
          heading={pairingContent.heading}
          description={pairingContent.description}
        />

        <div className="ak-pair__stage">
          <motion.div
            className="ak-pair__constellation ak-pair__constellation--a"
            style={
              reduced
                ? undefined
                : {
                    x: leftX,
                    y: leftY,
                  }
            }
          >
            <ConstellationSvg data={aslan.constellation} color={aslan.accentColor} />
            <p className="ak-pair__sign-name" style={{ color: aslan.accentColor }}>
              {aslan.nameTr}
            </p>
          </motion.div>

          <motion.div
            className="ak-pair__core"
            style={
              reduced
                ? undefined
                : { scale: coreScale, opacity: coreOpacity }
            }
            aria-hidden
          >
            <span
              className="ak-pair__core-blend"
              style={{
                background: `radial-gradient(circle, ${aslan.accentColor}88 0%, ${terazi.accentColor}55 45%, transparent 70%)`,
              }}
            />
            {connected ? (
              <motion.span
                className="ak-pair__ripple"
                initial={reduced ? false : { scale: 0.6, opacity: 0.55 }}
                animate={reduced ? undefined : { scale: 1.45, opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            ) : null}
          </motion.div>

          <motion.div
            className="ak-pair__constellation ak-pair__constellation--b"
            style={
              reduced
                ? undefined
                : {
                    x: rightX,
                    y: rightY,
                  }
            }
          >
            <ConstellationSvg data={terazi.constellation} color={terazi.accentColor} />
            <p className="ak-pair__sign-name" style={{ color: terazi.accentColor }}>
              {terazi.nameTr}
            </p>
          </motion.div>
        </div>

        <ol className="ak-pair__flow">
          {pairingContent.flow.map((item, i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>

        <motion.div
          className="ak-pair__result"
          style={reduced ? undefined : { opacity: metricsOpacity }}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="ak-pair__pair-title">
            {sample.signA} × {sample.signB}
          </p>
          <ul className="ak-pair__metrics">
            {metrics.map((m) => (
              <li key={m.label}>
                <span>{m.label}</span>
                <strong>
                  <CountUp value={m.value} />
                </strong>
              </li>
            ))}
          </ul>
          <p className="ak-pair__message">{sample.message}</p>
          <MagneticButton href={pairingContent.ctaHref} className="ak-cta-primary">
            {pairingContent.cta}
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
