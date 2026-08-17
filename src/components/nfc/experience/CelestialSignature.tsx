"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ZodiacGlyph } from "@/components/home/visuals/ZodiacGlyph";
import { FadeBodyReveal, MaskedHeadingReveal, OX_EASE, SceneLabelReveal } from "@/components/nfc/experience/Reveal";
import type { ZodiacConstellation } from "@/content/zodiac";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  sign: ZodiacSign;
  dateKey: string;
  constellation: ZodiacConstellation;
};

const SCORPIO_ATLAS = {
  points: [
    { x: 18, y: 22, r: 1.25 },
    { x: 30, y: 20, r: 1.35 },
    { x: 42, y: 24, r: 1.3 },
    { x: 52, y: 32, r: 2.7, antares: true },
    { x: 58, y: 44, r: 1.45 },
    { x: 62, y: 56, r: 1.35 },
    { x: 68, y: 66, r: 1.5 },
    { x: 78, y: 72, r: 1.65 },
    { x: 86, y: 68, r: 1.4 },
    { x: 48, y: 48, r: 1.15 },
    { x: 40, y: 58, r: 1.2 },
    { x: 34, y: 70, r: 1.3 },
    { x: 28, y: 80, r: 1.25 },
  ],
  links: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [3, 9],
    [9, 10],
    [10, 11],
    [11, 12],
  ] as [number, number][],
};

function atlasFor(sign: ZodiacSign, constellation: ZodiacConstellation) {
  if (sign.slug === "akrep") return SCORPIO_ATLAS;
  return {
    points: constellation.points.map((p, i) => ({
      x: p.x,
      y: p.y,
      r: i === Math.floor(constellation.points.length / 2) ? 2.45 : 1.3,
      antares: i === Math.floor(constellation.points.length / 2),
    })),
    links: constellation.links,
  };
}

const NODE_MEANINGS = ["Kök", "Yön", "Eşik", "Kalp", "Akış", "Uç", "İz", "Işık", "Hat", "Bağ", "Sınır", "Niyet", "Son"];

/** Sky-atlas map — large chart, sequential draw, optional node tap. */
export function CelestialSignature({ sign, dateKey, constellation }: Props) {
  const reduced = useReducedMotionSafe();
  const atlas = atlasFor(sign, constellation);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const depth = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [4, -4]);
  const [active, setActive] = useState<number | null>(() =>
    atlas.points.findIndex((p) => p.antares) >= 0 ? atlas.points.findIndex((p) => p.antares) : 0,
  );

  const starAppearDelay = atlas.points.map((_, i) => {
    if (i === 0) return 0.08;
    const idx = atlas.links.findIndex((pair) => pair[1] === i);
    return idx >= 0 ? 0.12 + idx * 0.085 + 0.35 : 0.2 + i * 0.05;
  });

  const activePoint = active != null ? atlas.points[active] : null;
  const activeLabel = active != null ? NODE_MEANINGS[active % NODE_MEANINGS.length] : null;

  return (
    <section ref={ref} id="ox-map" className="ox-scene ox-map ox-scene--nebula-b" aria-labelledby="ox-map-heading">
      <div className="ox-map__copy">
        <SceneLabelReveal>Göksel imza</SceneLabelReveal>
        {reduced ? (
          <h2 id="ox-map-heading" className="ox-heading">
            Bugünün göksel imzası
          </h2>
        ) : (
          <MaskedHeadingReveal className="ox-heading" as="h2" delay={0.06}>
            <span id="ox-map-heading">Bugünün göksel imzası</span>
          </MaskedHeadingReveal>
        )}
        <FadeBodyReveal delay={0.14} className="ox-body">
          {sign.nameTr} haritası · {dateKey}. Aynı gün aynı iz.
        </FadeBodyReveal>
      </div>

      <div className="ox-map__stage">
        <motion.svg
          className="ox-map__svg"
          viewBox="0 0 100 100"
          role="img"
          aria-label={`${sign.nameTr} yıldız haritası`}
          style={{ y: depth }}
          initial={reduced ? false : { opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: OX_EASE }}
        >
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(201,182,232,0.16)"
            strokeWidth="0.35"
            initial={reduced ? false : { pathLength: 0, opacity: 0.2 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: OX_EASE }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="rgba(232,213,168,0.12)"
            strokeWidth="0.3"
            strokeDasharray="1.1 3.4"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.08, ease: OX_EASE }}
          />
          {[0, 45, 90, 135].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x2 = 50 + Math.cos(rad) * 46;
            const y2 = 50 + Math.sin(rad) * 46;
            return (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke="rgba(201,182,232,0.08)"
                strokeWidth="0.25"
              />
            );
          })}

          <text x="4" y="12" fill="rgba(201,182,232,0.62)" fontSize="2.75" fontFamily="var(--font-ui), Figtree, sans-serif">
            N
          </text>
          <text x="88" y="22" fill="rgba(201,182,232,0.65)" fontSize="2.85" fontFamily="var(--font-ui), Figtree, sans-serif">
            −20°
          </text>

          {atlas.links.map(([a, b], i) => {
            const p1 = atlas.points[a];
            const p2 = atlas.points[b];
            if (!p1 || !p2) return null;
            return (
              <g key={`link-${i}`}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(201,182,232,0.2)" strokeWidth="0.45" />
                <motion.line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="var(--astral-lilac)"
                  strokeOpacity="0.8"
                  strokeWidth="0.7"
                  initial={reduced ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, delay: 0.12 + i * 0.065, ease: OX_EASE }}
                />
              </g>
            );
          })}

          {atlas.points.map((p, i) => (
            <g key={`p-${i}`}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={p.r + (active === i ? 1.2 : 0)}
                fill={p.antares || active === i ? "var(--sign-primary)" : "var(--text-primary)"}
                className={p.antares && !reduced ? "ox-map__antares" : !reduced ? "ox-map__star" : undefined}
                initial={reduced ? false : { opacity: 0.15, scale: 0.6 }}
                whileInView={{ opacity: p.antares || active === i ? 1 : 0.9, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: p.antares ? starAppearDelay[i]! + 0.2 : starAppearDelay[i],
                  duration: p.antares ? 0.7 : 0.45,
                  ease: OX_EASE,
                }}
                style={{ cursor: "pointer" }}
                onClick={() => setActive(i)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => setActive(i)}
              >
                <title>{NODE_MEANINGS[i % NODE_MEANINGS.length]}</title>
              </circle>
            </g>
          ))}

          <foreignObject x="8" y="78" width="18" height="18">
            <div style={{ display: "grid", placeItems: "center", width: "100%", height: "100%", opacity: 0.55 }}>
              <ZodiacGlyph sign={sign} size={16} draw={false} />
            </div>
          </foreignObject>
        </motion.svg>

        {activePoint && activeLabel ? (
          <p className="ox-map__hint" role="status">
            <span style={{ left: `${activePoint.x}%`, top: `${Math.max(8, activePoint.y - 8)}%` }}>
              {activeLabel}
            </span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
