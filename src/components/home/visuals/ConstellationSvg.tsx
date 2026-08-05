"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ZodiacConstellation } from "@/content/zodiac";

type Props = {
  data: ZodiacConstellation;
  color?: string;
  className?: string;
  animate?: boolean;
};

export function ConstellationSvg({
  data,
  color = "rgba(183, 161, 106, 0.75)",
  className = "",
  animate = true,
}: Props) {
  const reduced = useReducedMotion();
  const run = animate && !reduced;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      focusable="false"
      fill="none"
    >
      {data.links.map(([a, b], i) => {
        const p1 = data.points[a];
        const p2 = data.points[b];
        if (!p1 || !p2) return null;
        return (
          <motion.line
            key={`l-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={color}
            strokeWidth={0.6}
            initial={run ? { pathLength: 0, opacity: 0.7 } : { pathLength: 1, opacity: 0.7 }}
            whileInView={{ pathLength: 1, opacity: 0.7 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, delay: run ? 0.12 + i * 0.07 : 0, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
      {data.points.map((p, i) => (
        <motion.circle
          key={`p-${i}`}
          cx={p.x}
          cy={p.y}
          r={1.35}
          fill={color}
          initial={run ? { opacity: 0, scale: 0.4 } : { opacity: 0.9, scale: 1 }}
          whileInView={{ opacity: 0.9, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, delay: run ? i * 0.05 : 0 }}
        />
      ))}
    </svg>
  );
}
