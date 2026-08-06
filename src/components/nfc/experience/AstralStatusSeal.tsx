"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "@/components/home/visuals/CountUp";
import { OX_EASE, OX_DUR } from "@/components/nfc/experience/Reveal";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  energy: number;
  emotional: number;
  focus: number;
  social: number;
  keyword: string;
  summary: string;
};

const STATS = [
  { key: "energy", label: "Enerji", angle: -90 },
  { key: "emotional", label: "Duygu", angle: 0 },
  { key: "focus", label: "Odak", angle: 90 },
  { key: "social", label: "Sosyal", angle: 180 },
] as const;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
}

function arcLen(value: number, r: number) {
  const c = 2 * Math.PI * r;
  return Math.max(0.08, Math.min(1, value / 100)) * c * 0.72;
}

/** Astral Status Seal — all four daily stats visible at once. No tabs. */
export function AstralStatusSeal({ energy, emotional, focus, social, keyword, summary }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduced = useReducedMotionSafe();
  const values = { energy, emotional, focus, social };

  const orbitR = 38;
  const arcR = 11;

  return (
    <section id="ox-status" ref={ref} className="ox-scene ox-astral ox-scene--nebula-a" aria-labelledby="ox-status-heading">
      <p className="ox-kicker">Astral durum</p>
      <h2 id="ox-status-heading" className="ox-heading">
        Bugünün mühürü
      </h2>

      <div className="ox-seal" aria-label="Günün dört kanalı">
        <svg className="ox-seal__svg" viewBox="0 0 100 100" role="img">
          <defs>
            <linearGradient id="ox-seal-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8D5A8" stopOpacity="0.85" />
              <stop offset="55%" stopColor="var(--sign-primary)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#C9B6E8" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Outer orbit */}
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(232,213,168,0.28)"
            strokeWidth="0.35"
            initial={reduced ? false : { pathLength: 0, opacity: 0.2 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.95, ease: OX_EASE }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r={orbitR}
            fill="none"
            stroke="rgba(201,182,232,0.22)"
            strokeWidth="0.4"
            strokeDasharray="1.2 3.2"
            initial={reduced ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.05, delay: 0.08, ease: OX_EASE }}
          />

          {/* Center ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="18"
            fill="rgba(10,8,16,0.88)"
            stroke="url(#ox-seal-ring)"
            strokeWidth="1.5"
            initial={reduced ? false : { scale: 0.85, opacity: 0.3 }}
            animate={inView ? { scale: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.75, delay: 0.15, ease: OX_EASE }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {STATS.map((stat, i) => {
            const v = values[stat.key];
            const pos = polar(50, 50, orbitR, stat.angle);
            const c = 2 * Math.PI * arcR;
            const dash = arcLen(v, arcR);
            return (
              <g key={stat.key}>
                <motion.line
                  x1="50"
                  y1="50"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="rgba(201,182,232,0.22)"
                  strokeWidth="0.35"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                  transition={{ duration: 0.55, delay: 0.35 + i * 0.11, ease: OX_EASE }}
                />
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={arcR + 1.5}
                  fill="rgba(12,10,18,0.72)"
                  stroke="rgba(215,202,235,0.16)"
                  strokeWidth="0.4"
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  animate={inView ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 0.45, delay: 0.4 + i * 0.11, ease: OX_EASE }}
                  style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                />
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={arcR}
                  fill="none"
                  stroke="url(#ox-seal-ring)"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${c}`}
                  transform={`rotate(-90 ${pos.x} ${pos.y})`}
                  initial={reduced ? false : { strokeDasharray: `0 ${c}` }}
                  animate={inView ? { strokeDasharray: `${dash} ${c}` } : undefined}
                  transition={{ duration: 0.85, delay: 0.5 + i * 0.11, ease: OX_EASE }}
                />
              </g>
            );
          })}
        </svg>

        <div className="ox-seal__center">
          <p className="ox-seal__num">
            {inView || reduced ? <CountUp value={Math.round(energy)} duration={OX_DUR.count} /> : "0"}
          </p>
          <p className="ox-seal__cap">Bugünün yoğunluğu</p>
        </div>

        {STATS.map((stat, i) => {
          const v = values[stat.key];
          const pos = polar(50, 50, 38, stat.angle);
          // Convert SVG % to CSS % for absolute labels
          return (
            <motion.div
              key={stat.key}
              className={`ox-seal__stat ox-seal__stat--${stat.key}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              initial={reduced ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: reduced ? 1 : 0 }}
              transition={{ duration: 0.45, delay: 0.48 + i * 0.12, ease: OX_EASE }}
            >
              <span className="ox-seal__stat-val">
                {inView || reduced ? <CountUp value={Math.round(v)} duration={0.75} /> : "0"}
              </span>
              <span className="ox-seal__stat-lab">{stat.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="ox-seal__keyword"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.95, ease: OX_EASE }}
      >
        {keyword}
      </motion.p>
      <motion.p
        className="ox-seal__summary"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.55, delay: 1.1, ease: OX_EASE }}
      >
        {summary}
      </motion.p>
    </section>
  );
}
