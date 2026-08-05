"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ZodiacGlyph } from "@/components/home/visuals/ZodiacGlyph";
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
    { x: 18, y: 22, r: 1.1 },
    { x: 30, y: 20, r: 1.2 },
    { x: 42, y: 24, r: 1.15 },
    { x: 52, y: 32, r: 2.35, antares: true },
    { x: 58, y: 44, r: 1.3 },
    { x: 62, y: 56, r: 1.2 },
    { x: 68, y: 66, r: 1.35 },
    { x: 78, y: 72, r: 1.5 },
    { x: 86, y: 68, r: 1.25 },
    { x: 48, y: 48, r: 1.0 },
    { x: 40, y: 58, r: 1.05 },
    { x: 34, y: 70, r: 1.15 },
    { x: 28, y: 80, r: 1.1 },
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
      r: i === Math.floor(constellation.points.length / 2) ? 2.1 : 1.15,
      antares: i === Math.floor(constellation.points.length / 2),
    })),
    links: constellation.links,
  };
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sky-atlas map — sequential route draw; static without JS. */
export function CelestialSignature({ sign, dateKey, constellation }: Props) {
  const reduced = useReducedMotionSafe();
  const atlas = atlasFor(sign, constellation);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const depth = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [4, -4]);

  // When each star first becomes a link endpoint
  const starAppearDelay = atlas.points.map((_, i) => {
    if (i === 0) return 0.08;
    const idx = atlas.links.findIndex((pair) => pair[1] === i);
    return idx >= 0 ? 0.12 + idx * 0.085 + 0.35 : 0.2 + i * 0.05;
  });

  return (
    <section ref={ref} className="ox-scene ox-map ox-scene--nebula-b" aria-labelledby="ox-map-heading">
      <div className="ox-map__copy">
        <motion.p
          className="ox-kicker"
          initial={reduced ? false : { letterSpacing: "0.14em" }}
          whileInView={{ letterSpacing: "0.06em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          Gökyüzü atlası
        </motion.p>
        <h2 id="ox-map-heading" className="ox-heading">
          Bugünün göksel imzası
        </h2>
        <p className="ox-body">
          {sign.nameTr} haritası · {dateKey}. Aynı gün aynı iz.
        </p>
      </div>

      <motion.svg
        className="ox-map__svg"
        viewBox="8 8 88 88"
        role="img"
        aria-label={`${sign.nameTr} yıldız haritası`}
        style={{ y: depth }}
      >
        <motion.path
          d="M8 40 A 48 48 0 0 1 55 6"
          fill="none"
          stroke="rgba(201,182,232,0.22)"
          strokeWidth="0.35"
          initial={reduced ? false : { pathLength: 0, opacity: 0.15 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.35, ease: EASE }}
        />
        <motion.path
          d="M12 78 A 52 52 0 0 0 92 48"
          fill="none"
          stroke="rgba(201,182,232,0.16)"
          strokeWidth="0.3"
          strokeDasharray="1.2 4"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.12, ease: EASE }}
        />
        <path d="M70 92 A 40 40 0 0 0 98 55" fill="none" stroke="rgba(215,202,235,0.14)" strokeWidth="0.3" />

        <text x="6" y="38" fill="rgba(201,182,232,0.4)" fontSize="2.4" fontFamily="Manrope, sans-serif">
          16h
        </text>
        <text x="88" y="22" fill="rgba(201,182,232,0.35)" fontSize="2.2" fontFamily="Manrope, sans-serif">
          −20°
        </text>
        <text x="4" y="12" fill="rgba(201,182,232,0.32)" fontSize="2.1" fontFamily="Manrope, sans-serif">
          N
        </text>

        {atlas.links.map(([a, b], i) => {
          const p1 = atlas.points[a];
          const p2 = atlas.points[b];
          if (!p1 || !p2) return null;
          return (
            <g key={`link-${i}`}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(201,182,232,0.22)" strokeWidth="0.45" />
              <motion.line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="var(--astral-lilac)"
                strokeOpacity="0.72"
                strokeWidth="0.55"
                initial={reduced ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.085, ease: EASE }}
              />
            </g>
          );
        })}

        {atlas.points.map((p, i) => (
          <motion.circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={p.antares ? "var(--sign-primary)" : "var(--text-primary)"}
            className={p.antares && !reduced ? "ox-map__antares" : undefined}
            initial={reduced ? false : { opacity: 0.2 }}
            whileInView={{ opacity: p.antares ? 1 : 0.88 }}
            viewport={{ once: true }}
            transition={{
              delay: p.antares ? starAppearDelay[i]! + 0.25 : starAppearDelay[i],
              duration: p.antares ? 0.7 : 0.4,
              ease: EASE,
            }}
          />
        ))}

        <foreignObject x="8" y="78" width="18" height="18">
          <div style={{ display: "grid", placeItems: "center", width: "100%", height: "100%", opacity: 0.55 }}>
            <ZodiacGlyph sign={sign} size={16} draw={false} />
          </div>
        </foreignObject>
      </motion.svg>
    </section>
  );
}
