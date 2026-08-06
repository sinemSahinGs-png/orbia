"use client";

import { motion } from "framer-motion";
import { useId, type CSSProperties } from "react";
import type { MotionValue } from "framer-motion";
import { CountUp } from "@/components/home/visuals/CountUp";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

export type LivingCoreMode = "hero" | "metrics" | "map" | "eclipse" | "split" | "merge";

type MetricChannels = {
  emotional: number;
  focus: number;
  social: number;
};

type Props = {
  mode?: LivingCoreMode;
  energy?: number;
  metrics?: MetricChannels;
  activeMetric?: keyof MetricChannels | null;
  /** Optional center readout for metrics panel tabs. */
  centerValue?: number;
  centerCaption?: string;
  className?: string;
  label?: string;
  splitLabels?: [string, string];
  style?: CSSProperties | { gap?: MotionValue<string> | string | number };
};

function ringDash(value: number | null | undefined, r: number) {
  if (value == null || !Number.isFinite(value)) return { c: 2 * Math.PI * r, dash: 0, empty: true as const };
  const c = 2 * Math.PI * r;
  const pct = Math.max(0.06, Math.min(1, value / 100));
  return { c, dash: pct * c, empty: false as const };
}

function nodeAt(cx: number, cy: number, r: number, deg: number, size = 1.15) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r, size };
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Celestial Seal — layered atlas mechanics; energy numeral only in hero. */
export function LivingCore({
  mode = "hero",
  energy = 70,
  metrics,
  activeMetric = null,
  centerValue,
  centerCaption,
  className = "",
  label,
  splitLabels = ["Senin ORBIA’n", "Sinyal bekleniyor"],
  style,
}: Props) {
  const reduced = useReducedMotionSafe();
  const uid = useId().replace(/:/g, "");
  const gradId = `lc-gold-ring-${uid}`;
  const glowId = `lc-soft-glow-${uid}`;
  const main = ringDash(energy, 36);
  const highlight = nodeAt(50, 50, 36, (Math.max(0, Math.min(100, energy)) / 100) * 300 - 90, 1.6);
  const e = metrics ? ringDash(metrics.emotional, 34) : null;
  const f = metrics ? ringDash(metrics.focus, 26) : null;
  const s = metrics ? ringDash(metrics.social, 18) : null;

  if (mode === "split" || mode === "merge") {
    const merged = mode === "merge";
    return (
      <motion.div
        className={`lc lc--split${merged ? " is-merged" : ""} ${className}`}
        style={style}
        aria-hidden
      >
        <div className="lc-split__core lc-split__core--a">
          <svg className="lc-split__svg" viewBox="0 0 100 100" aria-hidden>
            <g className={reduced ? undefined : "lc__drift-a"}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line-soft)" strokeWidth="0.7" />
            </g>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(200,92,140,0.45)" strokeWidth="0.9" />
            <motion.path
              d="M50 18 Q 62 34, 50 50 Q 38 66, 50 82"
              fill="none"
              stroke="var(--astral-lilac)"
              strokeOpacity="0.45"
              strokeWidth="0.7"
              initial={reduced ? false : { pathLength: 0, opacity: 0.2 }}
              whileInView={{ pathLength: 1, opacity: 0.55 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE }}
            />
            <circle cx="50" cy="50" r="6" fill="var(--sign-primary)" opacity="0.85" />
          </svg>
          <span className="lc-split__label">{splitLabels[0]}</span>
        </div>
        <svg className="lc-split__bond" viewBox="0 0 140 36" aria-hidden>
          <motion.path
            d="M8 18 Q 40 6, 70 18 T 132 18"
            fill="none"
            stroke="var(--astral-lilac)"
            strokeWidth="1.35"
            strokeOpacity={merged ? 0.95 : 0.72}
            strokeDasharray="2 5"
            initial={reduced ? false : { pathLength: 0, opacity: 0.25 }}
            whileInView={{ pathLength: 1, opacity: merged ? 0.95 : 0.72 }}
            viewport={{ once: true }}
            transition={{ duration: 1.15, ease: EASE }}
          />
          {[28, 55, 82, 108].map((x, i) => (
            <motion.circle
              key={x}
              cx={x}
              cy={x % 40 < 20 ? 12 : 24}
              r="1.4"
              fill="var(--astral-lilac)"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.45 }}
            />
          ))}
          {!reduced ? (
            <circle r="1.55" fill="#F2E6C4" opacity="0.85">
              <animateMotion
                dur="7.5s"
                repeatCount="indefinite"
                path="M8 18 Q 40 6, 70 18 T 132 18"
              />
            </circle>
          ) : null}
        </svg>
        <div className={`lc-split__core lc-split__core--b${merged ? " is-on" : ""}`}>
          <svg className="lc-split__svg" viewBox="0 0 100 100" aria-hidden>
            <g className={reduced ? undefined : "lc__drift-b"}>
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="var(--line-soft)"
                strokeWidth="0.7"
                strokeDasharray={merged ? undefined : "2 4"}
              />
            </g>
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={merged ? "var(--astral-lilac)" : "rgba(201,182,232,0.28)"}
              strokeWidth="0.85"
            />
            {merged ? (
              <circle cx="50" cy="50" r="7" fill="var(--astral-lilac)" opacity="0.9" />
            ) : (
              <>
                <motion.circle
                  cx="42"
                  cy="44"
                  r="1.2"
                  fill="var(--astral-lilac)"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                />
                <motion.circle
                  cx="58"
                  cy="52"
                  r="1"
                  fill="var(--astral-lilac)"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 0.4 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                />
                <motion.circle
                  cx="50"
                  cy="60"
                  r="0.9"
                  fill="var(--astral-lilac)"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 0.35 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.85, duration: 0.5 }}
                />
              </>
            )}
          </svg>
          <span className="lc-split__label">{merged ? "Ortak mühür" : splitLabels[1]}</span>
        </div>
      </motion.div>
    );
  }

  if (mode === "eclipse") {
    return (
      <div className={`lc lc--eclipse ${className}`} aria-hidden>
        <svg className="lc__svg" viewBox="0 0 100 100">
          <g className={reduced ? undefined : "lc__sway-slow"}>
            <path
              d="M12 50 A 38 38 0 0 1 88 42"
              fill="none"
              stroke="var(--line-soft)"
              strokeWidth="0.7"
            />
          </g>
          <path
            d="M18 58 A 32 32 0 0 1 82 48"
            fill="none"
            stroke="rgba(201,182,232,0.28)"
            strokeWidth="0.45"
            strokeDasharray="1.2 4"
          />
        </svg>
      </div>
    );
  }

  const showEnergyNumeral = mode === "hero";
  const eDeg = metrics ? (metrics.emotional / 100) * 300 - 90 : 0;
  const fDeg = metrics ? (metrics.focus / 100) * 280 + 20 : 0;
  const sDeg = metrics ? (metrics.social / 100) * 260 + 120 : 0;
  const eNode = e && !e.empty ? nodeAt(50, 50, 34, eDeg) : null;
  const fNode = f && !f.empty ? nodeAt(50, 50, 26, fDeg) : null;
  const sNode = s && !s.empty ? nodeAt(50, 50, 18, sDeg) : null;

  const eActive = activeMetric === "emotional" || !activeMetric;
  const fActive = activeMetric === "focus" || !activeMetric;
  const sActive = activeMetric === "social" || !activeMetric;

  const metricCenter =
    mode === "metrics" && centerValue != null && Number.isFinite(centerValue)
      ? Math.round(centerValue)
      : null;

  return (
    <div
      className={`lc lc--${mode}${reduced ? "" : " lc--alive"} ${className}`}
      aria-hidden={!label}
      aria-label={label}
    >
      <svg className="lc__svg" viewBox="0 0 100 100">
        {mode === "hero" ? (
          <>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8D5A8" stopOpacity="0.7" />
                <stop offset="40%" stopColor="var(--sign-primary)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#C9B6E8" stopOpacity="0.75" />
              </linearGradient>
              <radialGradient id={`${uid}-core`} cx="50%" cy="42%" r="55%">
                <stop offset="0%" stopColor="rgba(232,213,168,0.12)" />
                <stop offset="55%" stopColor="rgba(74,40,110,0.35)" />
                <stop offset="100%" stopColor="rgba(16,13,23,0.92)" />
              </radialGradient>
              <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="1.35" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="47" fill={`url(#${uid}-core)`} opacity="0.9" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(232,213,168,0.32)"
              strokeWidth="0.4"
            />
            {[0, 72, 144, 216, 288].map((deg, i) => {
              const n = nodeAt(50, 50, 46, deg, 0.75);
              return (
                <circle
                  key={deg}
                  className={reduced ? undefined : `lc__twinkle lc__twinkle--${i % 4}`}
                  cx={n.x}
                  cy={n.y}
                  r={n.size}
                  fill="rgba(232,213,168,0.9)"
                  opacity="0.6"
                />
              );
            })}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(215,202,235,0.2)"
              strokeWidth="0.35"
              strokeDasharray="1.4 3.6"
            />
            <path
              d="M18 62 Q 28 28, 50 22 Q 78 28, 84 58"
              fill="none"
              stroke="var(--astral-lilac)"
              strokeOpacity="0.28"
              strokeWidth="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="rgba(215,202,235,0.14)"
              strokeWidth="1.45"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeDasharray={`${main.dash} ${main.c}`}
              transform="rotate(-90 50 50)"
              filter={`url(#${glowId})`}
              initial={reduced ? false : { strokeDasharray: `0 ${main.c}` }}
              whileInView={{ strokeDasharray: `${main.dash} ${main.c}` }}
              viewport={{ once: true }}
              transition={{ duration: 1.15, ease: EASE }}
            />
            <circle
              cx={highlight.x}
              cy={highlight.y}
              r="2.25"
              fill="#F2E6C4"
              opacity="0.95"
              filter={`url(#${glowId})`}
            />
            <circle
              cx="50"
              cy="50"
              r="17"
              fill="rgba(16,13,23,0.9)"
              stroke="rgba(232,213,168,0.28)"
              strokeWidth="0.5"
            />
          </>
        ) : null}

        {mode === "metrics" ? (
          <>
            <path d="M22 70 A 36 36 0 0 1 78 28" fill="none" stroke="var(--line-soft)" strokeWidth="0.4" />
            <path
              d="M30 78 A 40 40 0 0 1 86 40"
              fill="none"
              stroke="rgba(201,182,232,0.2)"
              strokeWidth="0.35"
              strokeDasharray="1 5"
            />
            {e ? (
              <motion.circle
                cx="50"
                cy="50"
                r={activeMetric === "emotional" ? 35 : 34}
                fill="none"
                stroke="var(--sign-primary)"
                strokeOpacity={eActive ? 0.92 : 0.28}
                strokeWidth={activeMetric === "emotional" ? 1.95 : 1.45}
                strokeLinecap="round"
                strokeDasharray={e.empty ? `0 ${e.c}` : `${e.dash} ${e.c}`}
                transform="rotate(-100 50 50)"
                initial={reduced ? false : { strokeDasharray: `0 ${e.c}` }}
                whileInView={{ strokeDasharray: e.empty ? `0 ${e.c}` : `${e.dash} ${e.c}` }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, delay: 0.05, ease: EASE }}
              />
            ) : null}
            {f ? (
              <motion.circle
                cx="50"
                cy="50"
                r={activeMetric === "focus" ? 27 : 26}
                fill="none"
                stroke="var(--cosmic-violet)"
                strokeOpacity={fActive ? 0.88 : 0.24}
                strokeWidth={activeMetric === "focus" ? 1.8 : 1.3}
                strokeLinecap="round"
                strokeDasharray={f.empty ? `0 ${f.c}` : `${f.dash} ${f.c}`}
                transform="rotate(-40 50 50)"
                initial={reduced ? false : { strokeDasharray: `0 ${f.c}` }}
                whileInView={{ strokeDasharray: f.empty ? `0 ${f.c}` : `${f.dash} ${f.c}` }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, delay: 0.22, ease: EASE }}
              />
            ) : null}
            {s ? (
              <motion.circle
                cx="50"
                cy="50"
                r={activeMetric === "social" ? 19 : 18}
                fill="none"
                stroke="var(--astral-lilac)"
                strokeOpacity={sActive ? 0.88 : 0.24}
                strokeWidth={activeMetric === "social" ? 1.65 : 1.2}
                strokeLinecap="round"
                strokeDasharray={s.empty ? `0 ${s.c}` : `${s.dash} ${s.c}`}
                transform="rotate(50 50 50)"
                initial={reduced ? false : { strokeDasharray: `0 ${s.c}` }}
                whileInView={{ strokeDasharray: s.empty ? `0 ${s.c}` : `${s.dash} ${s.c}` }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, delay: 0.4, ease: EASE }}
              />
            ) : null}
            {eNode ? (
              <motion.circle
                cx={eNode.x}
                cy={eNode.y}
                r="1.55"
                fill="var(--sign-primary)"
                initial={reduced ? false : { opacity: 0, cx: 50, cy: 50 }}
                whileInView={{ opacity: eActive ? 1 : 0.35, cx: eNode.x, cy: eNode.y }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.55, ease: EASE }}
              />
            ) : null}
            {fNode ? (
              <motion.circle
                cx={fNode.x}
                cy={fNode.y}
                r="1.4"
                fill="var(--cosmic-violet)"
                initial={reduced ? false : { opacity: 0, cx: 50, cy: 50 }}
                whileInView={{ opacity: fActive ? 1 : 0.3, cx: fNode.x, cy: fNode.y }}
                viewport={{ once: true }}
                transition={{ delay: 0.72, duration: 0.55, ease: EASE }}
              />
            ) : null}
            {sNode ? (
              <motion.circle
                cx={sNode.x}
                cy={sNode.y}
                r="1.3"
                fill="var(--astral-lilac)"
                initial={reduced ? false : { opacity: 0, cx: 50, cy: 50 }}
                whileInView={{ opacity: sActive ? 1 : 0.3, cx: sNode.x, cy: sNode.y }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.55, ease: EASE }}
              />
            ) : null}
            {metricCenter == null ? (
              <>
                <circle cx="50" cy="50" r="5" fill="none" stroke="var(--line-soft)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="1.4" fill="var(--astral-lilac)" opacity="0.7" />
              </>
            ) : (
              <circle
                cx="50"
                cy="50"
                r="14"
                fill="rgba(16,13,23,0.82)"
                stroke="rgba(232,213,168,0.18)"
                strokeWidth="0.4"
              />
            )}
          </>
        ) : null}
      </svg>

      {showEnergyNumeral ? (
        <div className="lc__readout">
          <p className="lc__num">
            {Number.isFinite(energy) ? <CountUp value={Math.round(energy)} duration={0.85} /> : "—"}
          </p>
          <p className="lc__caption">Bugünün yoğunluğu</p>
        </div>
      ) : null}

      {metricCenter != null ? (
        <div className="lc__readout lc__readout--metric">
          <p className="lc__num">
            <CountUp key={metricCenter} value={metricCenter} duration={0.7} />
          </p>
          <p className="lc__caption">{centerCaption ?? "Kanal"}</p>
        </div>
      ) : null}
    </div>
  );
}
